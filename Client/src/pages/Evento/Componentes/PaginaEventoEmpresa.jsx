import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Modal, Box, TextField, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams } from 'react-router-dom';
import { axiosConfig } from '../../../constant/axiosConfig.constant';

const styles = `
    .degradado-invertido {
        border: solid ;  
    }
    .modal-box {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
        outline: none;
    }
    .modal-button-container {
        display: flex;
        justify-content: space-around;
        margin-top: 20px;
    }
    .error-message {
        color: red;
        margin-top: 10px;
    }
`;

export const PaginaEventoEmpresa = () => {
    const { idEvento } = useParams();
    const [evento, setEvento] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userData, setUserData] = useState({});
    const [finishLoading, setFinishLoading] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/user',
            method: 'GET'
        })
            .then(res => {
                setUserData(res.data);
                setFinishLoading(!!res.data && !!res.data.userType && res.data.userType === 'Empresa');
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
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.status === 404) {
                    setErrorMessage('Evento no encontrado');
                } else {
                    setErrorMessage('');
                }
            });
    }, []);

    const handleModificar = () => {
        setConfirmOpen(true);
    };

    const handleConfirmarModificacion = () => {
        const nuevaFechaHora = new Date(evento.Dia + 'T' + evento.Hora);
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/evento/${idEvento}`,
            method: 'PUT',
            data: {
                // Aquí pasamos los datos actualizados del evento, incluyendo la nueva fecha y hora combinadas
                ...evento,
                Fecha: nuevaFechaHora.toISOString() // Aquí combinamos el día y la hora en un solo formato
            }
        })
            .then(res => {
                console.log('Evento modificado con éxito:', res.data);
                setConfirmOpen(false);
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.data && err.response.data.error === 'No se puede modificar el evento porque la fecha está a menos de 24 horas de la hora actual') {
                    setErrorMessage(err.response.data.error);
                } else {
                    setErrorMessage('Error al modificar el evento. Por favor, inténtelo de nuevo.');
                }
            });
    };

    console.log("DAPKF", evento)

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            <style>{styles}</style>
            {evento && (
                <>
                    <Typography variant="h4">Nombre:
                        <TextField
                            defaultValue={evento.eventoFormateado.Nombre}
                            onChange={(e) => setEvento({ ...evento, Nombre: e.target.value })}
                        />
                    </Typography>
                    <Typography variant="body1">Descripción:
                        <TextField
                            defaultValue={evento.eventoFormateado.Descripcion}
                            onChange={(e) => setEvento({ ...evento, Descripcion: e.target.value })}
                        />
                    </Typography>
                    <Typography variant="body1">Dia:
                        <TextField
                            type="date"
                            defaultValue={evento.eventoFormateado.Dia}
                            onChange={(e) => setEvento({ ...evento, Dia: e.target.value })}
                        />
                    </Typography>
                    <Typography variant="body1">Hora:
                        <TextField
                            type="time"
                            defaultValue={evento.eventoFormateado.Hora}
                            onChange={(e) => setEvento({ ...evento, Hora: e.target.value })}
                        />
                    </Typography>
                    <Typography variant="body1">Localizacion:
                        <TextField
                            defaultValue={evento.eventoFormateado.Localizacion}
                            onChange={(e) => setEvento({ ...evento, Localizacion: e.target.value })}
                        />
                    </Typography>
                    <Typography variant="body1">Aforo:
                        <TextField
                            type="number"
                            defaultValue={evento.eventoFormateado.Aforo}
                            onChange={(e) => setEvento({ ...evento, Aforo: e.target.value })}
                        />
                    </Typography>
                    <Typography variant="h5">Interesados:</Typography>
                    <ul>
                        {evento.Interesados && evento.eventoFormateado.Interesados.length > 0 ? (
                            evento.eventoFormateado.Interesados.map((interesado, index) => (
                                <li key={index}>{interesado}</li>
                            ))
                        ) : (
                            <li>No hay interesados</li>
                        )}
                    </ul>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleModificar}
                    >
                        Modificar
                    </Button>
                    {errorMessage && <Typography className="error-message">{errorMessage}</Typography>}
                </>
            )}
            <Modal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                aria-labelledby="confirm-modal-title"
                aria-describedby="confirm-modal-description"
            >
                <Box className="modal-box">
                    <Typography variant="h6" id="confirm-modal-title">
                        ¿Confirmar modificación?
                    </Typography>
                    <div className="modal-button-container">
                        <Button onClick={handleConfirmarModificacion}>Confirmar</Button>
                        <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default PaginaEventoEmpresa;
