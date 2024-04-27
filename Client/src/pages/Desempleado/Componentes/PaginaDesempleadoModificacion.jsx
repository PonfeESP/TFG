import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography } from '@mui/material';
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
            })
            .catch(err => console.log(err));
    }, [userId]);

    const handleAddTag = () => {
        setTags([...tags, { Lenguaje: '', Puntuacion: 0 }]);
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
    };

    const handleSubmit = (event) => {
        event.preventDefault();
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
            .catch(err => console.log(err));
    };

    return (
        <div className="pagina-desempleado-modificacion-container">
            <Paper elevation={3} className="formulario">
                <Typography variant="h4" className="titulo">Modificar Perfil</Typography>
                {usuario && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre:</label>
                            <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="descripcion">Descripción:</label>
                            <input id="descripcion" type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="edad">Edad:</label>
                            <input id="edad" type="number" value={edad} onChange={(e) => setEdad(parseInt(e.target.value))} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="experiencia">Experiencia Laboral:</label>
                            <input id="experiencia" type="number" value={experienciaLaboral} onChange={(e) => setExperienciaLaboral(parseInt(e.target.value))} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="estudios">Estudios:</label>
                            <input id="estudios" type="text" value={estudios} onChange={(e) => setEstudios(e.target.value)} />
                        </div>
                        <div className="form-group tags">
                            {tags.map((tag, index) => (
                                <div key={index} className="tag">
                                    <label htmlFor={`tag-${index}`}>Lenguaje:</label>
                                    <input
                                        id={`tag-${index}`}
                                        type="text"
                                        value={tag.Lenguaje}
                                        onChange={(e) => handleTagChange(index, 'Lenguaje', e.target.value)}
                                    />
                                    <label htmlFor={`rating-${index}`}>Puntuación:</label>
                                    <Rating
                                        id={`rating-${index}`}
                                        name={`rating-${index}`}
                                        value={tag.Puntuacion}
                                        onChange={(event, newValue) => handleTagChange(index, 'Puntuacion', newValue)}
                                    />
                                    <button type="button" onClick={() => handleRemoveTag(index)}>Eliminar</button>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddTag}>Agregar Etiqueta</button>
                        </div>
                        <button type="submit">Guardar Cambios</button>
                    </form>
                )}
            </Paper>
        </div>
    );
};

export default PaginaDesempleadoModificacion;
