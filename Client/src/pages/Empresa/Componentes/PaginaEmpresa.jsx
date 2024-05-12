import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Chip, Button, Modal, TextField, Autocomplete, Box, Rating, Snackbar } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';
import './PaginaEmpresa.css';

export const PaginaEmpresa = ({ userId }) => {
    const [ofertas, setOfertas] = useState([]);
    const [nuevaOfertaData, setNuevaOfertaData] = useState({
        Nombre: '',
        Descripcion: '',
        Tags: [],
        Disponible: true,
        Empresa: userId,
        Interesados: []
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [tags, setTags] = useState([]);
    const [tagsExperience, setTagsExperience] = useState({});
    const [programmingLanguages, setProgrammingLanguages] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/ofertas_empresa/${userId}`,
            method: 'GET'
        })
            .then(res => {
                setOfertas(res.data);
            })
            .catch(err => console.log(err))
    }, [userId]);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/tags',
            method: 'GET'
        })
            .then(res => {
                setProgrammingLanguages(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevaOfertaData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleTagsChange = (event, value) => {
        setTags(value);
    };

    const handleExperienceChange = (event, value, tag) => {
        setTagsExperience({ ...tagsExperience, [tag]: value });
    };

    const handleRegistrarNuevaOferta = () => {
        const tagsData = tags.map(tag => ({ Lenguaje: tag.label, Puntuacion: tagsExperience[tag.value] || 0 }));
        setNuevaOfertaData(prevData => ({ ...prevData, Tags: tagsData }));

        // Validación de campos
        if (!nuevaOfertaData.Nombre || !nuevaOfertaData.Descripcion || !nuevaOfertaData.Tags || nuevaOfertaData.Tags.length === 0 || !nuevaOfertaData.Disponible || !nuevaOfertaData.Empresa) {
            setError("Por favor, completa todos los campos y añade al menos un tag.");
            return;
        }

        // Validación de tags duplicados
        const tagNames = nuevaOfertaData.Tags.map(tag => tag.Lenguaje);
        const uniqueTagNames = new Set(tagNames);
        if (tagNames.length !== uniqueTagNames.size) {
            setError("No se permiten tags duplicados en la oferta.");
            return;
        }

        axios.post(`http://localhost:8000/registro_oferta/${userId}`, nuevaOfertaData)
            .then(res => {
                console.log('Oferta registrada con éxito:', res.data);
                setOfertas(prevOfertas => [...prevOfertas, res.data]);
                handleModalClose();
                // Resetear la información de la nueva oferta después del registro exitoso
                setNuevaOfertaData({
                    Nombre: '',
                    Descripcion: '',
                    Tags: [],
                    Disponible: true,
                    Empresa: userId,
                    Interesados: []
                });
            })
            .catch(err => {
                console.error('Error al registrar la oferta:', err);
                setError("Error al registrar la oferta. Inténtalo de nuevo más tarde.");
            });
    };

    const handleCloseError = () => {
        setError(null);
    };

    return (
        <div>
            <Grid container spacing={2}>
                {ofertas.length > 0 && !!ofertas[0]._id && (
                    ofertas.map((oferta, index) => (
                        <Grid key={oferta._id} item xs={12} sm={6} md={4} lg={3}>
                            <Link to={`/oferta/${oferta._id}`} className="link">
                                <Card variant="outlined" className="card">
                                    <CardContent>
                                        <Typography variant="h5" className="title">
                                            {oferta.Nombre}
                                        </Typography>
                                        <Typography variant="body1" className="tags">
                                            {oferta.Tags && oferta.Tags.map((tag, tagIndex) => (
                                                <Chip key={tagIndex} label={`${tag.Lenguaje}: ${tag.Puntuacion}`} variant="outlined" className="chip" />
                                            ))}
                                        </Typography>
                                        <Typography variant="body1" className="description">
                                            {oferta.Descripcion}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))
                )}
            </Grid>
            {/* Controles de paginación */}
            <div className="pagination">
                <Button variant="contained" color="primary" onClick={handleModalOpen}>
                    Registrar Nueva Oferta
                </Button>
                <Modal
                    open={modalOpen}
                    onClose={handleModalClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                        <Typography variant="h6" id="modal-title">Registrar Nueva Oferta</Typography>
                        <TextField
                            label="Nombre"
                            name="Nombre"
                            value={nuevaOfertaData.Nombre}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Descripción"
                            name="Descripcion"
                            value={nuevaOfertaData.Descripcion}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <Autocomplete
                            multiple
                            options={programmingLanguages.map(language => ({ label: language.Nombre, value: language._id }))}
                            getOptionLabel={option => option.label}
                            value={tags}
                            onChange={handleTagsChange}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Tags (Programming Languages)"
                                    placeholder="Select tags"
                                />
                            )}
                        />
                        {tags.map(tag => (
                            <Box key={tag.value}>
                                <span>{tag.label}</span>
                                <Rating
                                    name={tag.value}
                                    value={tagsExperience[tag.value] || 0}
                                    onChange={(event, value) => handleExperienceChange(event, value, tag.value)}
                                />
                            </Box>
                        ))}
                        <Button variant="contained" color="primary" onClick={handleRegistrarNuevaOferta}>Registrar</Button>
                    </div>
                </Modal>
            </div>
            {/* Mensaje de error */}
            <Snackbar
                open={error !== null}
                autoHideDuration={6000}
                onClose={handleCloseError}
                message={error}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                action={
                    <Button color="secondary" size="small" onClick={handleCloseError}>
                        Cerrar
                    </Button>
                }
            />
        </div>
    );
}

export default PaginaEmpresa;
