import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, Modal, TextField, Snackbar } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';

export const PaginaEmpresaEvento = ({ userId }) => {
    const [eventos, setEventos] = useState([]);
    const [nuevoEventoData, setNuevoEventoData] = useState({
        Nombre: '',
        Descripcion: '',
        Fecha: '',
        Localizacion: '',
        Aforo: ''
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/eventos_empresa/${userId}`,
            method: 'GET'
        })
            .then(res => {
                setEventos(res.data);
            })
            .catch(err => console.log(err))
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoEventoData(prevData => ({
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

    const handleRegistrarNuevoEvento = () => {
        if (!nuevoEventoData.Nombre || !nuevoEventoData.Descripcion || !nuevoEventoData.Fecha || !nuevoEventoData.Localizacion || !nuevoEventoData.Aforo) {
            setError("Por favor, completa todos los campos.");
            return;
        }
    
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/registro_evento/${userId}`,
            method: 'POST',
            data: nuevoEventoData
        })
        .then(res => {
            console.log('Evento registrado con éxito:', res.data);
            setEventos(prevEventos => [...prevEventos, res.data]);
            handleModalClose();
            setNuevoEventoData({
                Nombre: '',
                Descripcion: '',
                Fecha: '',
                Localizacion: '',
                Aforo: ''
            });
        })
        .catch(err => {
            console.error('Error al registrar el evento:', err);
            setError("Error al registrar el evento. Inténtalo de nuevo más tarde.");
        });
    };
    

    const handleCloseError = () => {
        setError(null);
    };

    return (
        <div>
            <Grid container spacing={2}>
                {eventos.length > 0 && !!eventos[0]._id && (
                    eventos.map((evento, index) => (
                        <Grid key={evento._id} item xs={12} sm={6} md={4} lg={3}>
                            <Link to={`/evento/${evento._id}`} className="link">
                                <Card variant="outlined" className="card">
                                    <CardContent>
                                        <Typography variant="h5" className="title">
                                            {evento.Nombre}
                                        </Typography>
                                        <Typography variant="body1" className="description">
                                            {evento.Descripcion}
                                        </Typography>
                                        <Typography variant="body1" className="date">
                                            Fecha: {evento.Fecha}
                                        </Typography>
                                        <Typography variant="body1" className="location">
                                            Localización: {evento.Localizacion}
                                        </Typography>
                                        <Typography variant="body1" className="capacity">
                                            Aforo: {evento.Aforo}
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
                    Registrar Nuevo Evento
                </Button>
                <Modal
                    open={modalOpen}
                    onClose={handleModalClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                        <Typography variant="h6" id="modal-title">Registrar Nuevo Evento</Typography>
                        <TextField
                            label="Nombre"
                            name="Nombre"
                            value={nuevoEventoData.Nombre}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Descripción"
                            name="Descripcion"
                            value={nuevoEventoData.Descripcion}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Fecha"
                            name="Fecha"
                            type="date"
                            value={nuevoEventoData.Fecha}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Localización"
                            name="Localizacion"
                            value={nuevoEventoData.Localizacion}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Aforo"
                            name="Aforo"
                            type="number"
                            value={nuevoEventoData.Aforo}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={handleRegistrarNuevoEvento}>Registrar</Button>
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

export default PaginaEmpresaEvento;
