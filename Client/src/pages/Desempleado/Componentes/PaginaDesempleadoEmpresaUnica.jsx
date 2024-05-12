import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Chip, Button } from '@mui/material';


export const PaginaDesempleadoEmpresaUnica = () => {
    const { idEmpresa } = useParams();
    const [data, setEmpresa] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/empresa_unica/${idEmpresa}`)
            .then(res => {
                setEmpresa(res.data);
            })
            .catch(err => console.log(err));
    }, [idEmpresa]);

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            <Grid container spacing={2}>
                {/* Datos de la empresa */}
                {data && (
                    <Grid item xs={12}>
                        <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '10px' }}>{data.empresa.Nombre}</Typography>
                        <Typography variant="body1" style={{ textAlign: 'center', marginBottom: '10px' }}>Email: {data.empresa.Email}</Typography>
                        <Typography variant="body1" style={{ textAlign: 'center', marginBottom: '10px' }}>Descripción: {data.empresa.Descripcion}</Typography>
                    </Grid>
                )}

                {/* Ofertas */}
                <Grid item xs={12} md={6}>
                    {data && data.ofertas.length > 0 && (

                        <div>
                            <Typography variant="h6" align='center'>Ofertas</Typography>
                        </div>
                    )}
                    <div style={{ maxHeight: '550px', overflowY: 'auto' }}>
                        {data && data.ofertas.map((oferta, index) => (
                            <Link key={oferta._id} to={`/oferta/${oferta._id}`} className="link">
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
                                        <Typography variant="body1" className="descripcion">
                                            {oferta.Descripcion}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </Grid>

                {/* Eventos */}
                <Grid item xs={12} md={6}>
                    {data && data.eventos.length > 0 && (
                        <div>
                            <Typography variant="h6" align='center'>Eventos</Typography>
                        </div>
                    )}
                    <div style={{ maxHeight: '550px', overflowY: 'auto' }}>
                        {data && data.eventos.map((evento, index) => (
                            <Link key={evento._id} to={`/evento/${evento._id}`} className="link">
                                <Card variant="outlined" className="card">
                                    <CardContent>
                                        <Typography variant="h5" className="title">
                                            {evento.Nombre}
                                        </Typography>
                                        <Typography variant="body1" className="dia">
                                            {evento.Dia}
                                        </Typography>
                                        <Typography variant="body1" className="hora">
                                            {evento.Hora}
                                        </Typography>
                                        <Typography variant="body1" className="aforo">
                                            {evento.Aforo}
                                        </Typography>
                                        <Typography variant="body1" className="localizacion">
                                            {evento.Localizacion}
                                        </Typography>
                                        <Typography variant="body1" className="descripcion">
                                            {evento.Descripcion}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};


export default PaginaDesempleadoEmpresaUnica;
