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

export const PaginaEmpresaUsuario = () => {

    const [usuarios, setusuarios] = useState([]);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/usuarios',
            method: 'GET'
        })
            .then(res => {
                setusuarios(res.data);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            <style>{styles}</style>
            {usuarios.length > 0 && !!usuarios[0]._id && (
                <Table aria-label="collapsible table" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', backgroundImage: 'linear-gradient(to right, red 0%, blue 100%)', backgroundOrigin: 'border-box', borderSpacing: '5px', border: '5px solid transparent' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>USUARIO</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>DESCRIPCION</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>EDAD</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>ESTUDIOS</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>EXPERIENCIA</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>TAGs</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.map((usuario, index) => (
                            <TableRow key={usuario._id}>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}>
                                    <Link to={`/empresa/usuarios/${usuario._id}`}>
                                        <Typography sx={{ fontWeight: 'bold', color: 'white' }}>{usuario.Nombre}</Typography>
                                    </Link>
                                </TableCell>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{usuario.Descripcion}</Typography></TableCell>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{usuario.Edad}</Typography></TableCell>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{usuario.Estudios}</Typography></TableCell>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{usuario.Experiencia_Laboral}</Typography></TableCell>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}>
                                    {usuario.Tags && usuario.Tags.map((tag, tagIndex) => (
                                        <Typography key={tagIndex} sx={{ fontWeight: 'bold', color: 'white' }}>{tag.Lenguaje}: {tag.Puntuacion}</Typography>
                                    ))}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}

export default PaginaEmpresaUsuario;
