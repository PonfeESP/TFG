import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosConfig } from '../../../../constant/axiosConfig.constant';
import { Grid, FormControl, InputLabel, Select, Paper, Box, Card, CardContent, Typography, Chip, MenuItem, Button, Modal } from '@mui/material';
import OfferCard from '../../../../components/OfferCard.component';
import SearchComponent from '../../../../components/Search.component';
import RegistroOferta from './NuevaOferta.componente';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SubComponenteOfertas = ({ userId, userType }) => {
    const [ofertas, setOfertas] = useState([]);
    const [ofertasOriginales, setOfertasOriginales] = useState([]);
    const [ofertasFiltradas, setOfertasFiltradas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 25;
    const [order, setOrder] = useState('newer');
    const [searchTerm, setSearchTerm] = useState('');
    const [openModal, setOpenModal] = useState(false); // Estado para controlar la apertura/cierre de la ventana emergente

    // Función para abrir la ventana emergente
    const handleOpenModal = () => {
        setOpenModal(true);
    };

    // Función para cerrar la ventana emergente
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleChange = (event) => {
        const orderValue = event.target.value;
        setOrder(orderValue);
        applyFilters(ofertasOriginales, orderValue);
    };

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

    const applyFilters = (ofertas, orderValue) => {

        let newOfertas = [...ofertas];
        if (orderValue === 'newer') {
            newOfertas.sort((a, b) => new Date(b.Fecha_Creacion) - new Date(a.Fecha_Creacion));
        }
        if (orderValue === 'older') {
            newOfertas.sort((a, b) => new Date(a.Fecha_Creacion) - new Date(b.Fecha_Creacion));
        }
        if (orderValue === 'concordance-down') {
            newOfertas.sort((a, b) => Number(a.PorcentajeConcordancia) - Number(b.PorcentajeConcordancia));
        }
        if (orderValue === 'concordance-up') {
            newOfertas.sort((a, b) => Number(b.PorcentajeConcordancia) - Number(a.PorcentajeConcordancia));
        }
        if (orderValue === 'favorites') {
            newOfertas = ofertasOriginales.filter(elem => elem.Interesados.includes(userId));
        }
        if (searchTerm) {
            newOfertas = newOfertas.filter(oferta =>
                oferta.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setOfertasFiltradas(newOfertas);
    };

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/ofertas_empresa/${userId}`,
            method: 'GET'
        })
            .then(res => {
                setOfertas(res.data);
                setOfertasOriginales(res.data);
                applyFilters(res.data, order);
            })
            .catch(err => console.error("Error fetching data:", err));
    }, [userId, order]);

    useEffect(() => {
        applyFilters(ofertasOriginales, order, searchTerm);
    }, [ofertasOriginales, order, searchTerm]);

    const totalPages = Math.ceil(ofertasFiltradas.length / pageSize);

    const currentOfertas = ofertasFiltradas.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Ofertas
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button variant="contained" onClick={handleOpenModal}>Registrar Nueva Oferta</Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2, paddingBottom: 2 }}>
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
                        <MenuItem value={'older'}>Más antiguas</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Grid container sx={{ pl: '1.5rem' }} spacing={{ xs: 3, md: 6 }} columns={{ xs: 1, sm: 6, md: 12 }} justifyContent="center">
                {currentOfertas.map((oferta, index) => (
                    <Grid item xs={3} sm={4} md={4} key={index}>
                        <OfferCard props={oferta} userId={userId} userType={userType} />
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
                <RegistroOferta userId={userId} handleCloseModal={handleCloseModal} />
            </Modal>
        </>
    );

};

export default SubComponenteOfertas
