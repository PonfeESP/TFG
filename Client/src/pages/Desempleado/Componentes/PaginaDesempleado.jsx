import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Chip, Button } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';

export const PaginaDesempleado = ({ userId }) => {
    const [ofertas, setOfertas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20; // Cantidad de ofertas por página

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/noInteresado_ofertas/${userId}`,
            method: 'GET'
        })
            .then(res => {
                setOfertas(res.data);
            })
            .catch(err => console.log(err))
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

    return (
        <div>
            <Grid container spacing={2}>
                {currentOfertas.map((oferta, index) => (
                    <Grid key={oferta._id} item xs={12} sm={6} md={4} lg={3}>
                        <Link to={`/oferta/${oferta._id}`} style={{ textDecoration: 'none' }}>
                            <Card variant="outlined" style={{ cursor: 'pointer', maxHeight: 370, minHeight: 370, overflow: 'auto' }}>
                                <CardContent>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', minHeight: 100, maxHeight: 100, overflow: 'hidden' }}>
                                        {oferta.Nombre}
                                    </Typography>
                                    <Typography variant="body1" style={{ marginTop: '10px', marginBottom: '10px', minHeight: 120, maxHeight: 120, overflow: 'hidden'}}>
                                        {oferta.Tags && oferta.Tags.map((tag, tagIndex) => (
                                            <Chip key={tagIndex} label={`${tag.Lenguaje}: ${tag.Puntuacion}`} variant="outlined" style={{ marginRight: '5px', marginBottom: '5px' }} />
                                        ))}
                                    </Typography>
                                    <Typography variant="body1" style={{ marginTop: '5px', marginBottom: '10px', minHeight: 50, maxHeight: 100, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', fontWeight: 'bold', fontSize: '14px' }}>
                                        {oferta.Descripcion}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
            {/* Controles de paginación */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Button onClick={prevPage} disabled={currentPage === 1}>Anterior</Button>
                <span style={{ margin: '0 10px' }}>Página {currentPage} de {totalPages}</span>
                <Button onClick={nextPage} disabled={currentPage === totalPages}>Siguiente</Button>
            </div>
        </div>
    );
}

export default PaginaDesempleado;
