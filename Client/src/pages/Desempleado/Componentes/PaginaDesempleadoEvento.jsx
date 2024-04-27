import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, Button, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';
import { Link } from 'react-router-dom';


const styles = `
    .degradado-invertido {
        border: solid ;  
    }
`;

export const PaginaDesempleadoEvento = () => {

    const [eventos, seteventos] = useState([]);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/eventos',
            method: 'GET'
        })
            .then(res => {
                seteventos(res.data);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            <style>{styles}</style>
            {eventos.length > 0 && !!eventos[0]._id && (
                <Table aria-label="collapsible table" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', backgroundImage: 'linear-gradient(to right, red 0%, blue 100%)', backgroundOrigin: 'border-box', borderSpacing: '5px', border: '5px solid transparent' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>EVENTO</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>DESCRIPCION</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>EMPRESA</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>FECHA</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>AFORO</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {eventos.map((evento, index) => (
                            <TableRow key={evento._id}>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}>
                                    <Link to={`/evento/${evento._id}`}>
                                        <Typography sx={{ fontWeight: 'bold', color: 'white' }}>{evento.Nombre}</Typography>
                                    </Link>
                                </TableCell>                                
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{evento.Descripcion}</Typography></TableCell>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{evento.Empresa}</Typography></TableCell>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{evento.Fecha}</Typography></TableCell>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{evento.Aforo}</Typography></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}

export default PaginaDesempleadoEvento;
