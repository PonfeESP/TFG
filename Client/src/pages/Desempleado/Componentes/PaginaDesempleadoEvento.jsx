import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Grid, Typography, Card, CardContent } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';

import './PaginaDesempleadoEvento.css';

export const PaginaDesempleadoEvento = ({ userId }) => {
    const [eventos, seteventos] = useState([]);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/noInteresado_eventos/${userId}`,
            method: 'GET'
        })
            .then(res => {
                seteventos(res.data);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div className="event-container">
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
        </div>
    );
}

export default PaginaDesempleadoEvento;
