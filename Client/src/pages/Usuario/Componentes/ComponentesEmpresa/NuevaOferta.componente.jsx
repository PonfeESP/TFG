import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosConfig } from '../../../../constant/axiosConfig.constant';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Autocomplete, Rating, Chip, TextField, Dialog, DialogContent, DialogActions, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';
import theme from '../../../../components/Theme.js';
import Fondo from '../../../../Imagenes/HeaderDefinitivo2.jpg';

const RegistroOferta = ({ userId, handleCloseModal }) => {
    const [nuevaOfertaData, setNuevaOfertaData] = useState({
        Nombre: '',
        Descripcion: '',
        Tags: [],
        Disponible: true,
        Empresa: userId,
        Interesados: []
    });
    const [open, setOpen] = useState(true);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tags, setTags] = useState([]);
    const [tagsExperience, setTagsExperience] = useState({});
    const [tagsError, setTagsError] = useState(false);
    const [error, setError] = useState('');
    const [nombreError, setNombreError] = useState(false);
    const [descripcionError, setDescripcionError] = useState(false);
    const [programmingLanguages, setProgrammingLanguages] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const handleTagsChange = (event, value) => {
        setTags(value);
    };

    const handleExperienceChange = (event, value, tag) => {
        setTagsExperience({ ...tagsExperience, [tag]: value });
    };

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


    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleRegistrarNuevaOferta = () => {


        if (tags.length === 0) {
            setTagsError(true);
        }

        if (nombre === '') {
            setNombreError(true);
        }

        if (descripcion === '') {
            setDescripcionError(true);
        }

        const tagsWithExperience = tags.map(tag => ({
            Lenguaje: tag.label,
            Puntuacion: tagsExperience[tag.value] || 1
        }));

        if (!nombre || !descripcion || tagsWithExperience.length === 0) {
            setError("Por favor, completa todos los campos y asigna una experiencia no nula a todos los tags.");
            return;
        }

        console.log("tags", tagsWithExperience.length)

        const tagNames = nuevaOfertaData.Tags.map(tag => tag.Lenguaje);
        const uniqueTagNames = new Set(tagNames);
        if (tagNames.length !== uniqueTagNames.size) {
            setError("No se permiten tags duplicados en la oferta.");
            return;
        }

        const ofertaData = {
            Nombre: nombre,
            Descripcion: descripcion,
            Tags: tagsWithExperience,
            Disponible: true,
            Empresa: userId
        };

        console.log("why", ofertaData)


        axios({
            ...axiosConfig,
            url: `http://localhost:8000/registro_oferta/${userId}`,
            method: 'POST',
            data: ofertaData
        })
            .then(res => {
                console.log('Oferta registrada con éxito:', res.data);
                setNombre("");
                setDescripcion("");
                handleModalClose();
                handleCloseModal();
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

    return (
        <ThemeProvider theme={theme}>
            <div sx={{ width: '100%' }}>
                <Dialog open={open} onClose={handleClose} sx={{ width: '100%' }}>
                    <Box
                        sx={{
                            backgroundImage: `url(${Fondo})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '90px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography variant="h5" color="white">
                            ITJobFinder
                        </Typography>
                    </Box>
                    <DialogContent sx={{ backgroundColor: '#302c2c', width: '100%' }}>
                        <TextField
                            required
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)} // Actualiza el estado 'nombre'
                            margin="dense"
                            id="nombre"
                            label="Nombre"
                            fullWidth
                            variant="outlined"
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '];
                                const isLetter = /^[a-zA-Z\s]$/;
                                if (!isLetter.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            error={nombreError}
                            helperText={nombreError && 'Por favor, ingrese un nombre.'}
                        />
                        <TextField
                            required
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)} // Actualiza el estado 'descripcion'
                            margin="dense"
                            id="descripcion"
                            label="Descripcion"
                            fullWidth
                            variant="outlined"
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '];
                                const isLetter = /^[a-zA-Z]$/;
                                const isDotOrComma = /^[.,]$/;
                                if (!isLetter.test(e.key) && !isDotOrComma.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            error={descripcionError}
                            helperText={descripcionError && 'Por favor, ingrese una descripción.'}
                        />
                        <Autocomplete
                            multiple
                            options={programmingLanguages.map(language => ({ label: language.Nombre, value: language._id }))}
                            getOptionLabel={option => option.label}
                            value={tags}
                            sx={{ width: '100%' }}
                            onChange={handleTagsChange}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Tags"
                                    placeholder="Select tags"
                                    fullWidth
                                    error={tagsError}
                                    helperText={tagsError && 'Por favor, seleccione al menos un tag.'}
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: { background: 'white' }
                                    }}
                                />
                            )}
                        />
                        {tags.map(tag => (
                            <Box key={tag.value} sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                <Chip style={{ color: 'white', backgroundColor: 'green', marginRight: '10px' }} label={tag.label} />
                                <Rating
                                    name={`rating-${tag.value}`}
                                    value={tagsExperience[tag.value] || 1}
                                    onChange={(event, value) => handleExperienceChange(event, value, tag.value)}
                                    sx={{ '& .MuiRating-icon': { height: '24px', width: '24px' } }} // Ajusta el tamaño de las estrellas
                                />
                            </Box>
                        ))}
                        <DialogActions>
                            <Button onClick={() => {
                                handleClose();
                                handleCloseModal();
                            }}
                                variant="contained"
                                sx={{ mt: theme.spacing(3), mb: theme.spacing(2), width: '50%' }}
                            >
                                CANCELAR
                            </Button>
                            <Button
                                onClick={handleRegistrarNuevaOferta}
                                variant="contained"
                                sx={{ mt: theme.spacing(3), mb: theme.spacing(2), width: '50%' }}>
                                REGISTRARSE
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </div>
        </ThemeProvider >
    );
};

export default RegistroOferta;
