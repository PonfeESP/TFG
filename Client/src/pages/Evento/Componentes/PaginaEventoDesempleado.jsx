import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Modal, Box, Grid, Card, CardContent } from '@mui/material';
import { useParams } from 'react-router-dom';
import { axiosConfig } from '../../../constant/axiosConfig.constant';

export const PaginaEventoDesempleado = () => {
    const { idEvento } = useParams();
    const [evento, setEvento] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userData, setUserData] = useState({});
    const [isRegistrado, setIsRegistrado] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/user',
            method: 'GET'
        })
            .then(res => {
                setUserData(res.data);
            })
            .catch(err => console.log(err))
    }, []);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/eventos/${idEvento}`,
            method: 'GET'
        })
            .then(res => {
                setEvento(res.data);
                if (res.data && userData.id) {
                    setIsRegistrado(res.data.eventoFormateado.Interesados.includes(userData.id));
                }
            })
            .catch(err => {
                console.log(err);
                setErrorMessage('Error al cargar el evento. Por favor, inténtelo de nuevo.');
            });
    }, [idEvento, userData.id]);

    const handleInteresado = () => {
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        const userId = userData.id;
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/solicitud_evento/${idEvento}`,
            method: 'PUT',
            data: {
                userId: userId,
            }
        })
            .then(res => {
                console.log('Solicitud enviada con éxito');
                setIsRegistrado(true);
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.status === 400) {
                    setErrorMessage(err.response.data.error);
                } else {
                    setErrorMessage('Error al enviar la solicitud. Por favor, inténtelo de nuevo.');
                }
            })
            .finally(() => {
                setConfirmOpen(false);
            });
    };

    const handleCancelarInteres = () => {
        const userId = userData.id;
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/solicitud_evento/${idEvento}`,
            method: 'DELETE',
            data: {
                userId: userId,
            }
        })
            .then(res => {
                console.log('Interés cancelado con éxito');
                setIsRegistrado(false);
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.status === 400) {
                    setErrorMessage(err.response.data.error);
                } else {
                    setErrorMessage('Error al cancelar el interés. Por favor, inténtelo de nuevo.');
                }
            });
    };

    const handleClose = () => {
        setConfirmOpen(false);
    };

    return (
        <div>
            {evento && (
                <div style={{ backgroundColor: 'transparent' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} className="campo">
                            <Typography variant="h5" align="center" style={{ fontWeight: 'bold' }}>{evento.eventoFormateado.Nombre}</Typography>
                        </Grid>
                        <Grid item xs={12} className="campo">
                            <Typography variant="body1" align="center">Descripción: {evento.eventoFormateado.Descripcion}</Typography>
                        </Grid>
                        <Grid item xs={12} className="campo">
                            <Typography variant="body1" align="center">Fecha: {evento.eventoFormateado.Dia}</Typography>
                        </Grid>
                        <Grid item xs={12} className="campo">
                            <Typography variant="body1" align="center">Hora: {evento.eventoFormateado.Hora}</Typography>
                        </Grid>
                        <Grid item xs={12} className="campo">
                            <Typography variant="body1" align="center">Aforo: {evento.eventoFormateado.Aforo}</Typography>
                        </Grid>
                        <Grid item xs={12} className="campo">
                            <Typography variant="body1" align="center">Empresa: {evento.eventoFormateado.Empresa.Nombre}</Typography>
                        </Grid>
                    </Grid>
                </div>
            )}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {isRegistrado ? (
                    <Button variant="contained" color="secondary" onClick={handleCancelarInteres}>Cancelar Interés</Button>
                ) : (
                    <Button variant="contained" color="primary" onClick={handleInteresado}>Solicitar Evento</Button>
                )}
            </div>
            <Modal
                open={confirmOpen}
                onClose={handleClose}
                aria-labelledby="modal-confirm-title"
                aria-describedby="modal-confirm-description"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box sx={{ width: 300, bgcolor: 'background.paper', p: 2 }}>
                    <Typography id="modal-confirm-title" variant="h6" component="h2" gutterBottom>
                        ¿Está seguro de que quiere solicitar este evento?
                    </Typography>
                    <Button onClick={handleConfirm} variant="contained" color="primary">Confirmar</Button>
                    <Button onClick={handleClose} variant="outlined" color="secondary">Cancelar</Button>
                    {errorMessage && (
                        <Typography variant="body2" color="error">
                            {errorMessage}
                        </Typography>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default PaginaEventoDesempleado;
