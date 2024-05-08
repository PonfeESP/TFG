import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, MenuItem, Select } from '@mui/material';
import Rating from '@mui/material/Rating';
import './PaginaDesempleadoModificacion.css'; // Importamos el archivo CSS

export const PaginaDesempleadoModificacion = ({ userId }) => {
    const [usuario, setUsuario] = useState(null);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [edad, setEdad] = useState(0);
    const [experienciaLaboral, setExperienciaLaboral] = useState(0);
    const [estudios, setEstudios] = useState('');
    const [tags, setTags] = useState([]);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfs, setPdfs] = useState([]);
    const [pdfUrl, setPdfUrl] = useState('');
    const [lenguajesProgramacion, setlenguajesProgramacion] = useState([]);
    const [formIsValid, setFormIsValid] = useState(true);
    const [errorMessages, setErrorMessages] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
        axios({
            url: 'http://localhost:8000/tags',
            method: 'GET'
        })
            .then(res => {
                setlenguajesProgramacion(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8000/usuarios/${userId}`)
            .then(res => {
                const userData = res.data;
                setUsuario(userData);
                setNombre(userData.Nombre);
                setEmail(userData.Email);
                setDescripcion(userData.Descripcion);
                setEdad(userData.Edad);
                setExperienciaLaboral(userData.Experiencia_Laboral);
                setEstudios(userData.Estudios);
                setTags(userData.Tags);
                setPdfUrl(userData.CurriculumPDF); // Asignar la URL del PDF directamente
            })
            .catch(err => console.log(err));
    }, [userId]);

    const handleNombreChange = (e) => {
        const inputValue = e.target.value;
        const regex = /^[a-zA-Z\s]*$/; // Expresión regular que permite solo letras y espacios
        if (regex.test(inputValue) || inputValue === '') {
            setNombre(inputValue);
        }
    };

    const handleDescripcionChange = (e) => {
        const inputValue = e.target.value;
        const regex = /^[a-zA-Z0-9\s.,]*$/; // Expresión regular que permite letras, números y algunos símbolos
        if (regex.test(inputValue) || inputValue === '') {
            setDescripcion(inputValue);
        }
    };

    const handleEdadChange = (e) => {
        const inputValue = e.target.value;
        const regex = /^[0-9]*$/; // Expresión regular que permite solo números
        if (regex.test(inputValue) || inputValue === '') {
            setEdad(parseInt(inputValue));
        }
    };

    const handleExperienciaLaboralChange = (e) => {
        const inputValue = e.target.value;
        const regex = /^[0-9]*$/; // Expresión regular que permite solo números
        if (regex.test(inputValue) || inputValue === '') {
            setExperienciaLaboral(parseInt(inputValue));
        }
    };

    const handleEstudiosChange = (e) => {
        const inputValue = e.target.value;
        const regex = /^[a-zA-Z\s]*$/; // Expresión regular que permite solo letras y espacios
        if (regex.test(inputValue) || inputValue === '') {
            setEstudios(inputValue);
        }
    };


    const handleAddTag = () => {
        if (tags.every(tag => tag.Lenguaje.trim() !== '' && tag.Puntuacion !== 0) && tags[tags.length - 1].Lenguaje.trim() !== '') {
            setTags([...tags, { Lenguaje: '', Puntuacion: 0 }]);
            setFormIsValid(true);
        } else {
            setFormIsValid(false);
        }
    };

    const handleRemoveTag = (index) => {
        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
    };

    const handleTagChange = (index, key, value) => {
        const newTags = [...tags];
        newTags[index] = { ...newTags[index], [key]: value };
        setTags(newTags);
        setFormIsValid(newTags.every(tag => tag.Lenguaje.trim() !== '' && tag.Puntuacion !== 0));
    };

    const handlePdfChange = (event) => {
        setPdfFile(event.target.files[0]);
    };

    const handlePdfUpload = () => {
        const formData = new FormData();
        formData.append('pdf', pdfFile);

        axios.put(`http://localhost:8000/usuarios/${userId}/pdf`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                console.log('PDF agregado:', res.data);
                setPdfs([...pdfs, res.data]);
            })
            .catch(err => console.log(err));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const errors = {};

        // Verificar si algún campo obligatorio está vacío
        if (!nombre) {
            errors.nombre = 'Por favor, ingrese su nombre.';
        }
        if (!email) {
            errors.email = 'Por favor, ingrese su correo electrónico.';
        }
        if (!descripcion) {
            errors.descripcion = 'Por favor, ingrese una descripción.';
        }
        if (!edad) {
            errors.edad = 'Por favor, ingrese su edad.';
        }
        if (!experienciaLaboral) {
            errors.experienciaLaboral = 'Por favor, ingrese su experiencia laboral.';
        }
        if (!estudios) {
            errors.estudios = 'Por favor, ingrese sus estudios.';
        }
        if (!tags.length) {
            errors.tags = 'Por favor, agregue al menos una etiqueta.';
        } else {
            const lenguajes = new Set();
            tags.forEach((tag, index) => {
                if (tag.Puntuacion < 1 || tag.Puntuacion > 5 || tag.Lenguaje.trim() === '') {
                    errors[`tag${index}`] = 'Seleccione un tag y su puntuación';
                }
                if (lenguajes.has(tag.Lenguaje)) {
                    errors.duplicateTag = 'No se pueden introducir tags con el mismo lenguaje';
                }
                lenguajes.add(tag.Lenguaje);
            });
        }

        setErrorMessages(errors);

        // Si hay algún error, mostramos el mensaje de error y evitamos enviar el formulario
        if (Object.keys(errors).length > 0) {
            if (errors.duplicateTag) {
                setErrorMessage(errors.duplicateTag);
            } else {
                setErrorMessage('');
            }
            return;
        }

        // Si no hay errores, enviamos el formulario
        const updatedUser = {
            Nombre: nombre,
            Email: email,
            Descripcion: descripcion,
            Edad: edad,
            Experiencia_Laboral: experienciaLaboral,
            Estudios: estudios,
            Tags: tags
        };

        axios.put(`http://localhost:8000/usuarios/${userId}`, updatedUser)
            .then(res => {
                console.log('Usuario actualizado:', res.data);
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.data && err.response.data.error) {
                    setErrorMessage(err.response.data.error);
                } else {
                    setErrorMessage('Error al enviar el formulario');
                }
            });
    };

    const filteredLenguajesProgramacion = lenguajesProgramacion.filter(lenguaje =>
        lenguaje.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pagina-desempleado-modificacion-container" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="info-usuario" style={{ width: '100%', height: '100%' }}>
                <Paper elevation={3} className="form-container" style={{ width: '60%', marginRight: '10px' }}>
                    <Paper elevation={3} className="formulario" style={{ width: '100%', minHeight: '300px', padding: '20px', boxSizing: 'border-box', overflowY: 'auto' }}>
                        <Typography variant="h4" className="titulo">Modificar Perfil</Typography>
                        {usuario && (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="nombre">Nombre:</label>
                                    <input id="nombre" type="text" value={nombre} onChange={(e) => handleNombreChange(e)} />
                                    {errorMessages.nombre && <p style={{ color: 'red' }}>{errorMessages.nombre}</p>}
                                </div>
                                <div className="form-group" style={{ height: '100px', marginBottom: '40px' }}>
                                    <label htmlFor="descripcion">Descripción:</label>
                                    <textarea id="descripcion" style={{ width: '100%', height: '100%', fontSize: '16px', fontFamily: 'inherit' }} value={descripcion} onChange={(e) => handleDescripcionChange(e)} />
                                    {errorMessages.descripcion && <p style={{ color: 'red' }}>{errorMessages.descripcion}</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edad">Edad:</label>
                                    <input id="edad" type="number" value={edad} onChange={(e) => handleEdadChange(e)} />
                                    {errorMessages.edad && <p style={{ color: 'red' }}>{errorMessages.edad}</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="experiencia">Experiencia Laboral:</label>
                                    <input id="experiencia" type="number" value={experienciaLaboral} onChange={(e) => handleExperienciaLaboralChange(e)} />
                                    {errorMessages.experienciaLaboral && <p style={{ color: 'red' }}>{errorMessages.experienciaLaboral}</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="estudios">Estudios:</label>
                                    <textarea id="descripcion" style={{ width: '100%', height: '100%', fontSize: '16px', fontFamily: 'inherit' }} value={estudios} onChange={(e) => handleEstudiosChange(e)} />
                                    {errorMessages.estudios && <p style={{ color: 'red' }}>{errorMessages.estudios}</p>}
                                </div>
                            </form>
                        )}
                    </Paper>
                </Paper>
                <Paper elevation={3} className="tags-container" style={{ width: '40%' }}>
                    <Typography variant="h4" className="titulo">Etiquetas</Typography>
                    <div className="form-group tags">
                        {tags.map((tag, index) => (
                            <div key={index} className="tag">
                                <label htmlFor={`tag-${index}`}>Lenguaje:</label>
                                <Select
                                    id={`tag-${index}`}
                                    value={tag.Lenguaje}
                                    onChange={(e) => handleTagChange(index, 'Lenguaje', e.target.value)}
                                    style={{ minWidth: '120px' }}
                                >
                                    {filteredLenguajesProgramacion.map((language, langIndex) => (
                                        <MenuItem key={langIndex} value={language.Nombre}>{language.Nombre}</MenuItem>
                                    ))}
                                </Select>

                                <label htmlFor={`rating-${index}`}>Puntuación:</label>
                                <Rating
                                    id={`rating-${index}`}
                                    name={`rating-${index}`}
                                    value={tag.Puntuacion}
                                    onChange={(event, newValue) => handleTagChange(index, 'Puntuacion', newValue)}
                                />
                                {errorMessages[`tag${index}`] && <p style={{ color: 'red' }}>{errorMessages[`tag${index}`]}</p>}
                                <button type="button" onClick={() => handleRemoveTag(index)}>Eliminar</button>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <button type="button" onClick={handleAddTag}>Agregar Etiqueta</button>
                    </div>
                </Paper>

            </div>
            <div className="guardar-cambios" style={{ textAlign: 'center', marginTop: '20px' }}>
                {errorMessage && (
                    <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>
                )}
                <button type="submit" disabled={!formIsValid} onClick={handleSubmit}>Guardar Cambios</button>
                {!formIsValid && (
                    <p style={{ color: 'red', textAlign: 'center' }}>Por favor, complete todos los campos de etiqueta y seleccione una puntuación antes de guardar.</p>
                )}
            </div>
            <div className="pdf" style={{ width: '100%', marginTop: '20px' }}>
                <Paper elevation={3} className="pdf-upload" style={{ textAlign: 'center' }}>
                    <Typography variant="h5" className="titulo" style={{ marginBottom: '10px' }}>Agregar PDF</Typography>
                    <input type="file" onChange={handlePdfChange} style={{ display: 'block', margin: 'auto' }} />
                    <button type="button" onClick={handlePdfUpload} style={{ marginTop: '20px', marginBottom: '20px' }}>Subir PDF</button>
                </Paper>

                {pdfUrl && (
                    <Paper elevation={3} className="pdf-list" style={{ textAlign: 'center' }}>
                        <Typography variant="h5" className="titulo">PDF existente</Typography>
                        <a href={`http://localhost:8000/pdfs/${pdfUrl}`} target="_blank" rel="noopener noreferrer">Ver PDF</a>
                    </Paper>
                )}
            </div>
        </div>
    );
};

export default PaginaDesempleadoModificacion;
