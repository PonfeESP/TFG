import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';
import { Link } from 'react-router-dom';
import './PaginaDesempleadoEmpresa.css';


export const PaginaDesempleadoEmpresa = () => {

    const [empresas, setempresas] = useState([]);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/empresas',
            method: 'GET'
        })
            .then(res => {
                setempresas(res.data);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            <Grid container spacing={2}>
                {empresas.map((empresa, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                        <Link to={`/desempleado/empresas/${empresa._id}`} style={{ textDecoration: 'none' }}>
                            <Card className="card" variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" className="nombre">
                                        {empresa.Nombre}
                                    </Typography>
                                    <Typography variant="body2" className="descripcion">
                                        {empresa.Descripcion}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default PaginaDesempleadoEmpresa;
