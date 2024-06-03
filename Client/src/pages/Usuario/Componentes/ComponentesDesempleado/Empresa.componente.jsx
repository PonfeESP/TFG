import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosConfig } from '../../../../constant/axiosConfig.constant';
import { Grid, FormControl, InputLabel, Select, Paper, Box, Typography, MenuItem, Button } from '@mui/material';
import BusinessCard from '../../../../components/BusinessCard.component';
import SearchComponent from '../../../../components/Search.component';

const SubComponenteEmpresas = ({ userId }) => {
    const [empresasOriginales, setEmpresasOriginales] = useState([]);
    const [empresasFiltradas, setEmpresasFiltradas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 25;
    const [order, setOrder] = useState('newer');
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event) => {
        const orderValue = event.target.value;
        setOrder(orderValue);
        applyFilters(empresasOriginales, orderValue);
    };

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

    const applyFilters = (empresas, orderValue) => {
        let newEmpresas = [...empresas];
        if (orderValue === 'newer') {
            newEmpresas.sort((a, b) => new Date(b.Fecha_Creacion) - new Date(a.Fecha_Creacion));
        }
        if (orderValue === 'older') {
            newEmpresas.sort((a, b) => new Date(a.Fecha_Creacion) - new Date(b.Fecha_Creacion));
        }
        if (orderValue === 'favorites') {
            newEmpresas = empresasOriginales.filter(elem => elem.Interesados.includes(userId));
        }
        if (searchTerm) {
            newEmpresas = newEmpresas.filter(empresa =>
                empresa.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setEmpresasFiltradas(newEmpresas);
    };

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/empresas`,
            method: 'GET'
        })
            .then(res => {
                setEmpresasOriginales(res.data);
                applyFilters(res.data, order);
            })
            .catch(err => console.error("Error fetching data:", err));
    }, [userId, order]);

    useEffect(() => {
        applyFilters(empresasOriginales, order, searchTerm);
    }, [empresasOriginales, order, searchTerm]);

    const totalPages = Math.ceil(empresasFiltradas.length / pageSize);

    const currentEmpresas = empresasFiltradas.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
            <Box sx={{ display: 'flex', paddingTop: 4, paddingLeft:3,  paddingRight:3, width: '100%', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom>
                    Empresas
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', marginTop: 3, paddingBottom: 10, paddingLeft:3, paddingRight:3, width: '100%', justifyContent: 'space-between' }}>
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
                {currentEmpresas.map((empresa, index) => (
                    <Grid item xs={3} sm={4} md={4} key={index}>
                        <BusinessCard business={empresa} userId={userId} />
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ display: 'flex', paddingTop: 4, paddingLeft:3,  paddingRight:3, width: '100%', justifyContent: 'space-between' }}>
                <Button variant="contained" onClick={prevPage} disabled={currentPage === 1}>Anterior</Button>
                <Typography variant="body1">Página {currentPage} de {totalPages}</Typography>
                <Button variant="contained" onClick={nextPage} disabled={currentPage === totalPages}>Siguiente</Button>
            </Box>
        </>
    );
};

export default SubComponenteEmpresas;
