import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Chip, Button } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';
import { Link } from 'react-router-dom';
import './PaginaDesempleadoOfertasInteres.css';

const styles = `
    .degradado-invertido {
        border: solid ;  
    }
`;

export const PaginaDesempleadoOfertasInteres = ({ userId }) => {

    const [ofertas, setOfertas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20; // Cantidad de ofertas por página

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/interesado_ofertas/${userId}`,
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
                        <Link to={`/oferta/${oferta._id}`} className="link">
                            <Card variant="outlined" className="card">
                                <CardContent>
                                    <Typography variant="h5" className="title">
                                        {oferta.Nombre}
                                    </Typography>
                                    <Typography variant="body1" className="tags">
                                        {oferta.Tags && oferta.Tags.map((tag, tagIndex) => (
                                            <Chip key={tagIndex} label={`${tag.Lenguaje}: ${tag.Puntuacion}`} variant="outlined" className="chip" />
                                        ))}
                                    </Typography>
                                    <Typography variant="body1" className="description">
                                        {oferta.Descripcion}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
            {/* Controles de paginación */}
            <div className="pagination">
                <Button onClick={prevPage} disabled={currentPage === 1}>Anterior</Button>
                <span className="page-info">Página {currentPage} de {totalPages}</span>
                <Button onClick={nextPage} disabled={currentPage === totalPages}>Siguiente</Button>
            </div>
        </div>
    );
}

export default PaginaDesempleadoOfertasInteres;
