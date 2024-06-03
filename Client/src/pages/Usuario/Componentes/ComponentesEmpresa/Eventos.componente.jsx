import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosConfig } from '../../../../constant/axiosConfig.constant';
import { Grid, FormControl, InputLabel, Select, Paper, Box, Card, CardContent, Typography, Chip, MenuItem, Button, Modal } from '@mui/material';
import EventCard from '../../../../components/EventCard.component';
import SearchComponent from '../../../../components/Search.component';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RegistroEvento from './NuevoEvento.componente';

const SubComponenteEventosEmpresa = ({ userId, userType }) => {
    const [eventosOriginales, setEventosOriginales] = useState([]);
    const [eventosFiltrados, setEventosFiltrados] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 25;
    const [order, setOrder] = useState('newer');
    const [searchTerm, setSearchTerm] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleChange = (event) => {
        const orderValue = event.target.value;
        setOrder(orderValue);
        applyFilters(eventosOriginales, orderValue);
    };

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

    const applyFilters = (eventos, orderValue) => {
        let newEventos = [...eventos];
        if (orderValue === 'newer') {
            newEventos.sort((a, b) => new Date(b.Fecha_Creacion) - new Date(a.Fecha_Creacion));
        }
        if (orderValue === 'older') {
            newEventos.sort((a, b) => new Date(a.Fecha_Creacion) - new Date(b.Fecha_Creacion));
        }
        if (searchTerm) {
            newEventos = newEventos.filter(evento =>
                evento.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setEventosFiltrados(newEventos);
    };

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/eventos_empresa/${userId}`,
            method: 'GET'
        })
            .then(res => {
                setEventosOriginales(res.data);
                applyFilters(res.data, order);
            })
            .catch(err => console.error("Error fetching data:", err));
    }, [userId, order]);

    useEffect(() => {
        applyFilters(eventosOriginales, order, searchTerm);
    }, [eventosOriginales, order, searchTerm]);

    const totalPages = Math.ceil(eventosFiltrados.length / pageSize);

    const currentEventos = eventosFiltrados.slice((currentPage - 1) * pageSize, currentPage * pageSize);


    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    return (
        <>
            <Box sx={{ display: 'flex', paddingTop: 4, width: '100%', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom>
                    Eventos
                </Typography>
                <Button variant="contained" onClick={handleOpenModal}>Nuevo Evento</Button>
            </Box>
            <Box sx={{ display: 'flex', marginTop: 3, paddingBottom: 10, width: '100%', justifyContent: 'space-between' }}>
                <SearchComponent handleSearch={handleSearch} sx={{ marginRight: 2 }} />
                <FormControl sx={{ minWidth: 200, maxWidth: 200 }}>
                    <InputLabel id="demo-simple-select-label">Ordenar por</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={order}
                        label="Ordenar por"
                        onChange={handleChange}
                    >
                        <MenuItem value={'newer'}>Más recientes</MenuItem>
                        <MenuItem value={'older'}>Más antiguos</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Grid container sx={{ pl: '1.5rem' }} spacing={{ xs: 3, md: 6 }} columns={{ xs: 1, sm: 6, md: 12 }} justifyContent="flex-start">

                {currentEventos.map((evento, index) => (
                    <Grid item xs={3} sm={4} md={4} key={index}>
                        <EventCard event={evento} userId={userId} userType={userType} />
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button variant="contained" onClick={prevPage} disabled={currentPage === 1}>
                    <ArrowBackIcon />
                </Button>
                <Typography variant="body1">Página {currentPage} de {totalPages}</Typography>
                <Button variant="contained" onClick={nextPage} disabled={currentPage === totalPages}>
                    <ArrowForwardIcon />
                </Button>
            </Box>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <RegistroEvento userId={userId} handleCloseModal={handleCloseModal} />
            </Modal>
        </>
    );
};

export default SubComponenteEventosEmpresa;
