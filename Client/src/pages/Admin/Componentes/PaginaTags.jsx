import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, Button } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';

const styles = `
    .degradado-invertido {
        border: solid ;  
    }
`;

export const PaginaTags = () => {

    const [tags, setTags] = useState([]);
    const [tagFiltro, setTagFiltro] = useState([]);
    const [tagNuevo, settagNuevo] = useState('');

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/tags',
            method: 'GET'
        })
            .then(res => {
                setTags(res.data);
                setTagFiltro(res.data); // Inicialmente mostrar todos los tags
            })
            .catch(err => console.log(err))
    }, []);

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filtered = tags.filter(tag => tag.Nombre.toLowerCase().includes(searchTerm));
        setTagFiltro(filtered);
    };

    const handleAddTag = () => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/tags',
            method: 'POST',
            data: { Nombre: tagNuevo }
        })
            .then(res => {
                setTags([...tags, res.data]);
                settagNuevo('');
            })
            .catch(err => console.log(err))
    };

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            <style>{styles}</style>
            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <TextField style={{ backgroundColor: 'white' }}
                    label="Buscar por nombre"
                    variant="outlined"
                    onChange={handleSearch}
                />
            </div>
            {tagFiltro.length > 0 && !!tagFiltro[0]._id && (
                <Table aria-label="collapsible table" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', backgroundImage: 'linear-gradient(to right, red 0%, blue 100%)', backgroundOrigin: 'border-box', borderSpacing: '5px', border: '5px solid transparent' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>NOMBRE</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tagFiltro.map((tag, index) => (
                            <TableRow key={index}>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{tag.Nombre}</Typography></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            <div style={{ marginTop: '20px' }}>
                <TextField
                    label="Nuevo Tag"
                    variant="outlined"
                    value={tagNuevo}
                    onChange={(e) => settagNuevo(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAddTag} style={{ marginLeft: '10px' }}>Añadir Tag</Button>
            </div>
        </div>
    );

}

export default PaginaTags;
