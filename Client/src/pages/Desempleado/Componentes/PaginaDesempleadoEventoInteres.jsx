import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, Grid, Typography, Button } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';
import './PaginaDesempleadoEventoInteres.css';

export const PaginaDesempleadoEventoInteres = ({ userId }) => {
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/interesado_evento/${userId}`,
            method: 'GET'
        })
            .then(res => {
                setEventos(res.data);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div className="event-container">
            {eventos.length > 0 && !!eventos[0]._id && (
                <Grid container spacing={2}>
                    {eventos.map((evento, index) => (
                        <Grid key={evento._id} item xs={12} sm={6} md={4} lg={3}>
                            <Link to={`/evento/${evento._id}`} className="event-link">
                                <Card className="event-card">
                                    <CardContent>
                                        <Typography variant="h5" className="event-name">{evento.Nombre}</Typography>
                                        <Typography variant="body1" className="event-description">{evento.Descripcion}</Typography>
                                        <Typography variant="body1" className="event-company">{evento.Empresa.Nombre}</Typography>
                                        <Typography variant="body1" className="event-details">{evento.Dia} | {evento.Hora} | {evento.Localizacion}</Typography>
                                        <Typography variant="body1" className="event-capacity">Aforo: {evento.Aforo} | Restante: {evento.aforo_restante}</Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
}

export default PaginaDesempleadoEventoInteres;
