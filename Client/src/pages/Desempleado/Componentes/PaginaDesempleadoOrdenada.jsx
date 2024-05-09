import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Chip, Button } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';
import './PaginaDesempleadoOrdenada.css';

export const PaginaDesempleadoOrdenada = ({ userId, maxOfertas }) => {
    const [ofertas, setOfertas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 25;

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

};

export default PaginaDesempleadoOrdenada;
