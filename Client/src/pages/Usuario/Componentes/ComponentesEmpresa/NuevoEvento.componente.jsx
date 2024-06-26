import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosConfig } from '../../../../constant/axiosConfig.constant';
import { ThemeProvider } from '@mui/material/styles';
import { Button, TextField, Dialog, DialogContent, DialogActions, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';
import theme from '../../../../constant/Theme.js';
import Fondo from '../../../../Imagenes/HeaderDefinitivo2.jpg';


const RegistroEvento = ({ userId, handleCloseModal, onEventoCreado }) => {
    const [open, setOpen] = useState(true);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [localizacion, setLocalizacion] = useState("");
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [fechaHoraFormato, setFechaHoraFormato] = useState('');
    const [aforo, setAforo] = useState("");
    const [error, setError] = useState('');
    const [nombreError, setNombreError] = useState(false);
    const [localizacionError, setLocalizacionError] = useState(false);
    const [aforoError, setAforoError] = useState(false);
    const [fechaError, setFechaError] = useState(false);
    const [errorHora, setErrorHora] = useState('');
    const [horaError, setHoraError] = useState(false);
    const [descripcionError, setDescripcionError] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

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


    const handleRegistrarNuevaEvento = () => {

        const regexHora = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!regexHora.test(hora) || hora === '') {
            setHoraError(true);
        } else (setHoraError(false))
        if (nombre === '') {
            setNombreError(true);
        } else (setNombreError(false))
        if (descripcion === '') {
            setDescripcionError(true);
        } else (setDescripcionError(false))
        if (aforo === '') {
            setAforoError(true);
        } else (setAforoError(false))
        if (fecha === '') {
            setFechaError(true);
        } else (setFechaError(false))
        if (localizacion === '') {
            setLocalizacionError(true);
        } else (setLocalizacionError(false))

        if (!nombre || !descripcion || !aforo || !fecha || !hora || !regexHora.test(hora) || !localizacion) {
            setError("Por favor, completa todos los campos y asigna una experiencia no nula a todos los tags.");
            return;
        }
        const fechaHora = new Date(`${fecha}T${hora}:00.000Z`);

        const eventoData = {
            Nombre: nombre,
            Descripcion: descripcion,
            Localizacion: localizacion,
            Fecha: fechaHora,
            Aforo: aforo,
            Empresa: userId
        };

        axios({
            ...axiosConfig,
            url: `http://localhost:8000/registro_evento/${userId}`,
            method: 'POST',
            data: eventoData
        })
            .then(res => {
                console.log('evento registrada con éxito:', res.data);
                setNombre("");
                setDescripcion("");
                setAforo("");
                setFecha("");
                setHora("");
                setLocalizacion("");
                handleModalClose();
                handleCloseModal();
                onEventoCreado();
            })
            .catch(err => {
                console.error('Error al registrar la evento:', err);
                setError("Error al registrar la evento. Inténtalo de nuevo más tarde.");
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
                                const isLetter = /^[a-zA-Z]$/;
                                const isDotOrComma = /^[.,]$/;
                                if (!isLetter.test(e.key) && !isDotOrComma.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            error={nombreError}
                            helperText={nombreError && 'Por favor, ingrese un nombre.'}
                        />
                        <TextField
                            required
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
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
                        <TextField
                            required
                            value={aforo}
                            onChange={(e) => setAforo(e.target.value)}
                            margin="dense"
                            id="aforo"
                            label="Aforo"
                            fullWidth
                            variant="outlined"
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                                const isDigit = /^\d$/;
                                if (!isDigit.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            error={aforoError}
                            helperText={aforoError && 'Por favor, ingrese el aforo.'}
                        />
                        <TextField
                            required
                            name="Fecha"
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            fullWidth
                            margin="normal"
                            error={fechaError}
                            helperText={fechaError && 'Por favor, ingrese una fecha.'}
                        />
                        <TextField
                            required
                            name="Hora"
                            type="text"
                            value={hora}
                            onChange={(e) => setHora(e.target.value)}
                            fullWidth
                            label="Hora"
                            margin="normal"
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ':'];
                                const isDigit = /^\d$/;
                                if (!isDigit.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            error={horaError}
                            helperText={horaError && 'Por favor, ingrese una hora valida HH:MM'}
                        />
                        <TextField
                            required
                            value={localizacion}
                            onChange={(e) => setLocalizacion(e.target.value)}
                            margin="dense"
                            id="localizacion"
                            label="Localizacion"
                            fullWidth
                            variant="outlined"
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '];
                                const isLetter = /^[a-zA-Z]$/;
                                const isDotOrComma = /^[.,-]$/;
                                if (!isLetter.test(e.key) && !isDotOrComma.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            error={localizacionError}
                            helperText={localizacionError && 'Por favor, ingrese una fecha valida.'}
                        />
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
                                onClick={handleRegistrarNuevaEvento}
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

export default RegistroEvento;
