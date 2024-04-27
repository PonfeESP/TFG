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

export const PaginaEventoEmpresa = () => {
    const { idEvento } = useParams();
    const [evento, setEvento] = useState(null);
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
            url: `http://localhost:8000/eventos/${idEvento}`,
            method: 'GET'
        })
            .then(res => {
                setEvento(res.data);
                setTags(res.data.Tags.map(tag => tag.Lenguaje));
            })
            .catch(err => console.log(err));
    }, []);

    const handleModificar = () => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/evento/${idEvento}`,
            method: 'PUT',
            data: { /* Aquí pasa los datos actualizados de la Evento */ }
        })
            .then(res => {
                console.log('Evento modificada con éxito:', res.data);
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
            {evento && (
                <>
                    <Typography variant="h4">{evento.Nombre}</Typography>
                    <Typography variant="body1">Dsescripción: {evento.Descripcion}</Typography>
                    <Typography variant="body1">Fecha: {new Date(evento.Fecha).toLocaleDateString()}</Typography>
                    <Typography variant="body1">Hora: {evento.Hora}</Typography>
                    <Typography variant="body1">Aforo: {evento.Aforo}</Typography>
                    <Typography variant="h5">Interesados:</Typography>
                    <ul>
                        {evento.Interesados.map((interesado, index) => (
                            <li key={index}>{interesado}</li>
                        ))}
                    </ul>
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

export default PaginaEventoEmpresa;
