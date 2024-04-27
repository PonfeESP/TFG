import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Modal, Box, TextField, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams } from 'react-router-dom';
import { axiosConfig } from '../../../constant/axiosConfig.constant';

const styles = `
    .degradado-invertido {
        border: solid ;  
    }
`;

export const PaginaOfertaEmpresa = () => {
    const { idOferta } = useParams();
    const [oferta, setOferta] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userData, setUserData] = useState({});
    const [finishLoading, setFinishLoading] = useState(null);
    const [nuevoTag, setNuevoTag] = useState('');
    const [tags, setTags] = useState([]);
    const [tagSeleccionado, setTagSeleccionado] = useState('');

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/user',
            method: 'GET'
        })
            .then(res => {
                setUserData(res.data);
                setFinishLoading(!!res.data && !!res.data.userType && res.data.userType === 'Empresa');
            })
            .catch(err => console.log(err))
    }, []);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/ofertas/${idOferta}`,
            method: 'GET'
        })
            .then(res => {
                setOferta(res.data);
                setTags(res.data.Tags.map(tag => tag.Lenguaje));
            })
            .catch(err => console.log(err));
    }, []);

    const handleModificar = () => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/oferta/${idOferta}`,
            method: 'PUT',
            data: { /* Aquí pasa los datos actualizados de la oferta */ }
        })
            .then(res => {
                console.log('Oferta modificada con éxito:', res.data);
            })
            .catch(err => console.log(err));
    };

    const handleNuevoTag = () => {
        setTags([...tags, nuevoTag]);
        setNuevoTag('');
    };

    const handleEliminarTag = (tag) => {
        setTags(tags.filter(t => t !== tag));
    };

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            <style>{styles}</style>
            {oferta && (
                <>
                    <Typography variant="h4">{oferta.Nombre}</Typography>
                    <Typography variant="body1">Descripción: {oferta.Descripcion}</Typography>
                    <Typography variant="body1">Empresa: {oferta.Empresa}</Typography>
                    <Typography variant="body1">Disponible: {oferta.Disponible ? 'Sí' : 'No'}</Typography>
                    <Typography variant="h5">Tags:</Typography>
                    <div>
                        {tags.map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag}
                                onDelete={() => handleEliminarTag(tag)}
                            />
                        ))}
                    </div>
                    <div>
                        <TextField
                            label="Nuevo Tag"
                            variant="outlined"
                            value={nuevoTag}
                            onChange={(e) => setNuevoTag(e.target.value)}
                        />
                        <Button variant="contained" color="primary" onClick={handleNuevoTag}>Añadir Tag</Button>
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleModificar}
                    >
                        Modificar
                    </Button>
                </>
            )}
        </div>
    );
};

export default PaginaOfertaEmpresa;
