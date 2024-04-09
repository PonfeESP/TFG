import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';

const styles = `
    .degradado-invertido {
        border: solid ;  
    }
`;

export const PaginaAdmin = () => {

    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/Mostrar/Empresas',
            method: 'GET'
        })
            .then(res => {
                setEmpresas(res.data);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            <style>{styles}</style>
            {empresas.length > 0 && !!empresas[0]._id && (
                <Table aria-label="collapsible table" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', backgroundImage: 'linear-gradient(to right, red 0%, blue 100%)', backgroundOrigin: 'border-box', borderSpacing: '5px', border: '5px solid transparent' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>EMPRESA</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>EMAIL</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>DESCRIPCION</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {empresas.map((empresa, index) => (
                            <TableRow key={empresa._id}>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{empresa.Nombre}</Typography></TableCell>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{empresa.Email}</Typography></TableCell>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{empresa.Descripcion}</Typography></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );

}

export default PaginaAdmin;
