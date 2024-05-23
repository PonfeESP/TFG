import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { Grid, FormControl, InputLabel, Select, Paper, Box, Card, CardContent, Typography, Chip, MenuItem, Button, TextField } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';
import './PaginaDesempleadoOrdenada.css';
import OfferCard from '../../../components/OfferCard.component';
import SearchComponent from '../../../components/Search.component';

export const PaginaDesempleadoOrdenada = ({ userId, maxOfertas }) => {
    const [ofertas, setOfertas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 25;
    const [order, setAge] = React.useState('newer');

    const handleChange = (event) => {
        setAge(event.target.value);
        console.log(event.target.value);
        if (event.target.value === 'newer') {
            const newOfertas = ofertas.sort((a, b) => a["Fecha_Creacion"] < b["Fecha_Creacion"] ? 1 : -1);
            setOfertas(newOfertas);
        }
        if (event.target.value === 'older') {
            setOfertas(ofertas.sort((a, b) => a["Fecha_Creacion"] < b["Fecha_Creacion"] ? -1 : 1));
        }
        if (event.target.value === 'concordance-up') {
            setOfertas(ofertas.sort((a, b) => Number(a.PorcentajeCorcondancia) > Number(b.PorcentajeCorcondancia) ? 1 : -1));
        }
        if (event.target.value === 'concordance-up') {
            setOfertas(ofertas.sort((a, b) => Number(a.PorcentajeCorcondancia) > Number(b.PorcentajeCorcondancia) ? -1 : 1));    
        }
        if (event.target.value === 'favourites') {
            // ! ARREGLAR !!!
            setOfertas(ofertas.filter(elem => elem.Interesados.length > 0));    
        }
    };
  
  
    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/ofertas_ordenadas/${userId}`,
            method: 'GET'
        })
            .then(res => {
                const data = maxOfertas ? res.data.slice(0, maxOfertas) : res.data;
                setOfertas(data);
                setSelectedOferta(res.data[0]);
            })
            .catch(err => console.error("Error fetching data:", err))
    }, []);

    const totalPages = Math.ceil(ofertas.length / pageSize);

    const currentOfertas = ofertas.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    console.log(ofertas);
    return (
        <>
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant="h4" gutterBottom>
        Ofertas
      </Typography>
      <FormControl sx={{minWidth: 200, maxWidth: 200, mb: 4}}>
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

    <MenuItem value={'concordance-down'}>Por concordancia (creciente)</MenuItem>
    <MenuItem value={'concordance-up'}>Por concordancia (descendiente)</MenuItem>
    
    <MenuItem value={'favorites'}>Solo añadidas a Favoritos</MenuItem>
  </Select>
</FormControl>  
        </Box>
        <Grid container sx={{pl: '1.5rem'}} spacing={{ xs: 3, md: 6 }} columns={{ xs: 1, sm: 6, md: 12 }} justifyContent="center">
        {ofertas.map((oferta, index) => (<Grid item xs={3} sm={4} md={4} key={index}><OfferCard props={oferta} />
        </Grid>))}
        </Grid></>
    )
    /** 
    return (
        <div className="ofertas-wrapper">
            <div className="card-wrapper">
                <Grid container spacing={2}>
                    {ofertas.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((oferta, index) => (
                        <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                            <Link to={`/oferta/${oferta._id}`} style={{ textDecoration: 'none' }}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h5" className="nombre">
                                            {oferta.Nombre}
                                        </Typography>
                                        <Typography variant="body1" className="tags">
                                            {oferta.Tags && oferta.Tags.map((tag, tagIndex) => (
                                                <Chip key={tagIndex} label={`${tag.Lenguaje}: ${tag.Puntuacion}`} variant="outlined" className="tag-chip" />
                                            ))} 
                                        </Typography>
                                        <Typography variant="h5" className="porcentage">
                                            {oferta.PorcentajeConcordancia} %
                                        </Typography>
                                        <Typography variant="body1" className="descripcion">
                                            {oferta.Descripcion}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </div>

            <div className="pagination">
                <Button onClick={prevPage} disabled={currentPage === 1}>Anterior</Button>
                <span className="page-info">Página {currentPage} de {totalPages}</span>
                <Button onClick={nextPage} disabled={currentPage === totalPages}>Siguiente</Button>
            </div>
        </div>
    );
    **/
};

export default PaginaDesempleadoOrdenada;
 