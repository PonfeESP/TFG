import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, Modal, TextField } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';
import { Link } from 'react-router-dom';

const styles = `
    .degradado-invertido {
        border: solid ;  
    }
`;

export const PaginaEmpresaEvento = ({ userId }) => {
    const [eventos, setEventos] = useState([]);
    const [nuevoEventoData, setNuevoEventoData] = useState({
        Nombre: '',
        Descripcion: '',
        Fecha: '',
        Aforo: ''
    });
    const [modalOpen, setModalOpen] = useState(false);

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
        axios.post(`http://localhost:8000/registro_evento/${userId}`, nuevoEventoData)
            .then(res => {
                console.log('Evento registrado con éxito:', res.data);
                // Actualizar la lista de eventos después de agregar uno nuevo
                setEventos(prevEventos => [...prevEventos, res.data]);
                // Cerrar el modal
                handleModalClose();
            })
            .catch(err => {
                console.error('Error al registrar el evento:', err);
                // Puedes mostrar un mensaje de error al usuario si la solicitud falla
            });
    };

    return (
        <div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <style>{styles}</style>
                {eventos.length > 0 && !!eventos[0]._id && (
                    <Table aria-label="collapsible table" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', backgroundImage: 'linear-gradient(to right, red 0%, blue 100%)', backgroundOrigin: 'border-box', borderSpacing: '5px', border: '5px solid transparent' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>EVENTO</Typography></TableCell>
                                <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>DESCRIPCION</Typography></TableCell>
                                <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>FECHA</Typography></TableCell>
                                <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>AFORO</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {eventos.map((evento, index) => (
                                <TableRow key={evento._id}>
                                    <TableCell className="degradado-invertido" style={{ background: 'transparent' }}>
                                        <Link to={`/evento/${evento._id}`}>
                                            <Typography sx={{ fontWeight: 'bold', color: 'white' }}>{evento.Nombre}</Typography>
                                        </Link>
                                    </TableCell>                                
                                    <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{evento.Descripcion}</Typography></TableCell>
                                    <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{evento.Fecha}</Typography></TableCell>
                                    <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{evento.Aforo}</Typography></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
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
    );
}

export default PaginaEmpresaEvento;
