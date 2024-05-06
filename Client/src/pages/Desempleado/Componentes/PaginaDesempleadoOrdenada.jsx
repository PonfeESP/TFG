import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material';
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

    const pageCount = Math.ceil((ofertas.length) / pageSize);
    const mostrarTabla = ofertas.length > 0;

    return (
        <div>
            {mostrarTabla && (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Empresa</TableCell>
                                <TableCell>Porcentaje</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ofertas.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((oferta, index) => (
                                <TableRow key={index}>
                                    <TableCell>{oferta.Nombre}</TableCell>
                                    <TableCell>{oferta.Descripcion}</TableCell>
                                    <TableCell>{oferta.Empresa.Nombre}</TableCell>
                                    <TableCell>{oferta.PorcentajeConcordancia}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {pageCount > 1 && (
                <div className="pagination" style={{ textAlign: 'center' }}>
                    {[...Array(pageCount)].map((_, index) => (
                        <button key={index} style={{ margin: '20px', fontSize: '14px' }} onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaginaDesempleadoOrdenada;
