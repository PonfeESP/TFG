import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';
import { Link } from 'react-router-dom';

const styles = `
    .degradado-invertido {
        border: solid ;  
    }
    .tags-scroll {
        max-height: 100px;
        overflow-y: auto;
    }
`;

export const PaginaEmpresaUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/usuarios',
            method: 'GET'
        })
            .then(res => {
                setUsuarios(res.data);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <Grid container spacing={2}>
            {usuarios.map((usuario, index) => (
                <Grid key={usuario._id} item xs={12} sm={6} md={4} lg={3}>
                    <Link to={`${usuario._id}`} style={{ textDecoration: 'none' }}>
                        <Card variant="outlined" style={{ minHeight: '400px', maxHeight: '400px' }}>
                            <CardContent style={{ overflowY: 'auto' }}>
                                <Typography variant="h5" gutterBottom style={{ maxHeight: '70px', overflowY: 'auto' }}>
                                    {usuario.Nombre}
                                </Typography>
                                <Typography variant="body1" gutterBottom style={{ maxHeight: '70px', overflowY: 'auto' }}>
                                    {usuario.Descripcion}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Edad: {usuario.Edad}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Estudios: {usuario.Estudios}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Experiencia Laboral: {usuario.Experiencia_Laboral}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Tags:
                                </Typography>
                                <div className="tags-scroll" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                                    <TableContainer>
                                        <Table aria-label="tags table">
                                            <TableBody>
                                                {usuario.Tags && usuario.Tags.map((tag, tagIndex) => (
                                                    <TableRow key={tagIndex}>
                                                        <TableCell>
                                                            <Typography variant="body2">{tag.Lenguaje}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">{tag.Puntuacion}</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
            ))}
        </Grid>
    );
}

export default PaginaEmpresaUsuario;
