import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, Button, TableHead, TableRow, Typography } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';

const styles = `
    .degradado-invertido {
        border: solid ;  
    }
`;

export const PaginaDesempleadoOrdenada = () => {

    const [ofertas, setOfertas] = useState([]);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/ofertas_ordenadas',
            method: 'GET'
        })
            .then(res => {
                setOfertas(res.data);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            <style>{styles}</style>
            {ofertas.length > 0 && !!ofertas[0]._id && (
                <Table aria-label="collapsible table" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', backgroundImage: 'linear-gradient(to right, red 0%, blue 100%)', backgroundOrigin: 'border-box', borderSpacing: '5px', border: '5px solid transparent' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>OFERTA</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>DESCRIPCION</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>EMPRESA</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>TAGs</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>PORCENTAJE</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ofertas.map((oferta, index) => (
                            <TableRow key={oferta._id}>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{oferta.Nombre}</Typography></TableCell>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{oferta.Descripcion}</Typography></TableCell>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{oferta.Empresa}</Typography></TableCell>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}>
                                    {oferta.Tags && oferta.Tags.map((tag, tagIndex) => (
                                        <Typography key={tagIndex} sx={{ fontWeight: 'bold', color: 'white' }}>{tag.Lenguaje}: {tag.Puntuacion}</Typography>
                                    ))}
                                </TableCell>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{oferta.PorcentajeConcordancia}</Typography></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}

export default PaginaDesempleadoOrdenada;
