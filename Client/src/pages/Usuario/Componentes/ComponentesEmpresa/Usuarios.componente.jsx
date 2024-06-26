import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosConfig } from '../../../../constant/axiosConfig.constant';
import { Grid, FormControl, InputLabel, Select, Paper, Box, Typography, MenuItem, Button } from '@mui/material';
import UsersCard from '../../../../components/UsersCard.component';
import SearchComponent from '../../../../components/Search.component';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const SubComponenteUsuarios = ({ userId }) => {
    const [usuariosOriginales, setUsuariosOriginales] = useState([]);
    const [usuariosFiltradas, setUsuariosFiltradas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 25;
    const [order, setOrder] = useState('newer');
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event) => {
        const orderValue = event.target.value;
        setOrder(orderValue);
        applyFilters(usuariosOriginales, orderValue);
    };

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

    const applyFilters = (usuarios, orderValue) => {
        let newUsuarios = [...usuarios];
        if (orderValue === 'newer') {
            newUsuarios.sort((a, b) => new Date(b.Fecha_Creacion) - new Date(a.Fecha_Creacion));
        }
        if (orderValue === 'older') {
            newUsuarios.sort((a, b) => new Date(a.Fecha_Creacion) - new Date(b.Fecha_Creacion));
        }
        if (orderValue === 'favorites') {
            newUsuarios = usuariosOriginales.filter(elem => elem.Interesados.includes(userId));
        }
        if (searchTerm) {
            newUsuarios = newUsuarios.filter(usuario =>
                usuario.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setUsuariosFiltradas(newUsuarios);
    };

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/usuarios`,
            method: 'GET'
        })
            .then(res => {
                setUsuariosOriginales(res.data);
                applyFilters(res.data, order);
            })
            .catch(err => console.error("Error fetching data:", err));
    }, [userId, order]);

    useEffect(() => {
        applyFilters(usuariosOriginales, order, searchTerm);
    }, [usuariosOriginales, order, searchTerm]);

    let totalPages = Math.ceil(usuariosFiltradas.length / pageSize);

    if (totalPages === 0){
        totalPages += 1;
    }

    const currentUsuarios = usuariosFiltradas.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
                    Usuarios
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', marginTop: 3, paddingBottom: 10, paddingLeft:3, paddingRight:3, width: '100%', justifyContent: 'space-between' }}>
                <SearchComponent handleSearch={handleSearch} sx={{ display: 'flex', justifyContent: 'left' }} />
                <FormControl sx={{ minWidth: 200, maxWidth: 200, display: 'flex', justifyContent: 'right' }}>
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
                {currentUsuarios.map((usuario, index) => (
                    <Grid item xs={3} sm={4} md={4} key={index}>
                        <UsersCard user={usuario} />
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ display: 'flex', paddingTop: 4, paddingLeft:3,  paddingRight:3, width: '100%', justifyContent: 'space-between' }}>
                <Button variant="contained" onClick={prevPage} disabled={currentPage === 1}>
                    <ArrowBackIcon />
                </Button>
                <Typography variant="body1">Página {currentPage} de {totalPages}</Typography>
                <Button variant="contained" onClick={nextPage} disabled={currentPage === totalPages}>
                    <ArrowForwardIcon />
                </Button>
            </Box>
        </>
    );
};

export default SubComponenteUsuarios;
