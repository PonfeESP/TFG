import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';

export const PaginaAdmin = () => {

    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/empresas',
            method: 'GET'
        })
            .then(res => {
                setEmpresas(res.data);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div>
            {empresas.length > 0 && !!empresas[0]._id && (
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography sx={{ fontWeight: 'bold' }}>EMPRESA</Typography></TableCell>
                            <TableCell><Typography sx={{ fontWeight: 'bold' }}>EMAIL</Typography></TableCell>
                            <TableCell><Typography sx={{ fontWeight: 'bold' }}>DESCRIPCION</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {empresas.map((empresa, index) => (
                            <TableRow key={empresa._id}>
                                <TableCell><Typography sx={{ fontWeight: 'bold' }}>{empresa.Nombre}</Typography></TableCell>
                                <TableCell><Typography sx={{ fontWeight: 'bold' }}>{empresa.Email}</Typography></TableCell>
                                <TableCell><Typography sx={{ fontWeight: 'bold' }}>{empresa.Descripcion}</Typography></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}

export default PaginaAdmin;
