import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Modal, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { axiosConfig } from '../../../constant/axiosConfig.constant';

const styles = `
    .degradado-invertido {
        border: solid ;  
    }
`;

export const PaginaOfertaDesempleado = () => {
    const { idOferta } = useParams();
    const [oferta, setOferta] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userData, setUserData] = useState({});
    const [finishLoading, setFinishLoading] = useState(null);
    const [isRegistrado, setIsRegistrado] = useState(false); // Estado para controlar el registro repetido

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/user',
            method: 'GET'
        })
            .then(res => {
                setUserData(res.data);
                setFinishLoading(!!res.data && !!res.data.userType && res.data.userType === 'Desempleado');
            })
            .catch(err => console.log(err))
    }, []);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/ofertas/${idOferta}`,
            method: 'GET'
        })
            .then(res => {
                setOferta(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    const handleInteresado = () => {
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        const userId = userData.id;
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/solicitud_oferta',
            method: 'PUT',
            data: {
                userId: userId,
                ofertaId: idOferta
            }
        })
            .then(res => {
                console.log('Solicitud enviada con éxito');
                setIsRegistrado(true); // Actualizar el estado para indicar que ya está registrado
            })
            .catch(err => console.log(err))
            .finally(() => {
                setConfirmOpen(false); // Cerrar el modal después de enviar la solicitud
            });
    };

    const handleClose = () => {
        setConfirmOpen(false);
    };

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            <style>{styles}</style>
            {oferta && (
                <>
                    <Typography variant="h4">{oferta.Nombre}</Typography>
                    <Typography variant="body1">Descripción: {oferta.Descripcion}</Typography>
                    <Typography variant="body1">Empresa: {oferta.Empresa.Nombre}</Typography>
                    <Typography variant="body1">Disponible: {oferta.Disponible ? 'Sí' : 'No'}</Typography>
                    <Typography variant="h5">Tags:</Typography>
                    <ul>
                        {oferta.Tags.map((tag, index) => (
                            <li key={index}>{tag.Lenguaje}: {tag.Puntuacion}</li>
                        ))}
                    </ul>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleInteresado}
                        disabled={isRegistrado} // Deshabilitar el botón si ya está registrado
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
                                ¿Está seguro de que quiere solicitar esta oferta?
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

export default PaginaOfertaDesempleado;
