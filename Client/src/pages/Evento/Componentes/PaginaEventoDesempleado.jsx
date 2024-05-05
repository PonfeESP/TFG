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
                // Comprobación si el usuario ya está registrado en el evento
                if (res.data && userData.id) {
                    setIsRegistrado(res.data.Interesados.includes(userData.id));
                }
            })
            .catch(err => console.log(err));
    }, [idEvento, userData.id]);

    const handleInteresado = () => {
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        const userId = userData.id;
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/solicitud_evento',
            method: 'PUT',
            data: {
                userId: userId,
                eventoId: idEvento
            }
        })
            .then(res => {
                console.log('Solicitud enviada con éxito');
                setIsRegistrado(true); 
            })
            .catch(err => console.log(err))
            .finally(() => {
                setConfirmOpen(false); 
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
                        onClick={handleInteresado}
                        disabled={isRegistrado} 
                    >
                        {isRegistrado ? 'Ya registrado' : 'Interesado'}
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
                        </Box>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default PaginaEventoDesempleado;
