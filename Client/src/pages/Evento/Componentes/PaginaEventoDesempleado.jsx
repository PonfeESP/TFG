import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Modal, Box } from '@mui/material';
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
                    setIsRegistrado(res.data.Interesados.includes(userData.id));
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
            url: `http://localhost:8000/retirar_solicitud_evento/${idEvento}`,
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
        <div style={{ backgroundColor: 'transparent' }}>
            {evento && (
                <>
                    <Typography variant="h4">{evento.Nombre}</Typography>
                    <Typography variant="body1">Descripción: {evento.Descripcion}</Typography>
                    <Typography variant="body1">Fecha: {new Date(evento.Fecha).toLocaleDateString()}</Typography>
                    <Typography variant="body1">Hora: {evento.Hora}</Typography>
                    <Typography variant="body1">Aforo: {evento.Aforo}</Typography>
                    <Typography variant="body1">Empresa: {evento.Empresa.Nombre}</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={isRegistrado ? handleCancelarInteres : handleInteresado}
                        disabled={evento.Interesados.length >= evento.Aforo}
                    >
                        {isRegistrado ? 'Cancelar Interés' : 'Interesado'}
                    </Button>


                    <Modal
                        open={confirmOpen}
                        onClose={handleClose}
                        aria-labelledby="modal-confirm-title"
                        aria-describedby="modal-confirm-description"
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
                </>
            )}
        </div>
    );
};

export default PaginaEventoDesempleado;
