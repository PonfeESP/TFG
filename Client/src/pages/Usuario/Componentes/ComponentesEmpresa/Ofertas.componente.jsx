import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosConfig } from '../../../../constant/axiosConfig.constant';
import { Grid, FormControl, InputLabel, Select, Paper, Box, Card, CardContent, Typography, Chip, MenuItem, Button } from '@mui/material';
import OfferCard from '../../../../components/OfferCard.component';
import SearchComponent from '../../../../components/Search.component';

const SubComponenteOfertas = ({ userId, userType }) => {
    const [ofertas, setOfertas] = useState([]);
    const [ofertasOriginales, setOfertasOriginales] = useState([]);
    const [ofertasFiltradas, setOfertasFiltradas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 25;
    const [order, setOrder] = useState('newer');
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event) => {
        const orderValue = event.target.value;
        setOrder(orderValue);
        applyFilters(ofertasOriginales, orderValue);
    };

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

    const applyFilters = (ofertas, orderValue) => {
        console.log("asdasd offers:", ofertas);

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

    console.log("currenmt:", currentOfertas);


    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Ofertas
                </Typography>
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
                        <OfferCard props={oferta} userId={userId} userType={userType}/>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button variant="contained" onClick={prevPage} disabled={currentPage === 1}>Anterior</Button>
                <Typography variant="body1">Página {currentPage} de {totalPages}</Typography>
                <Button variant="contained" onClick={nextPage} disabled={currentPage === totalPages}>Siguiente</Button>
            </Box>
        </>
    );
};

export default SubComponenteOfertas
