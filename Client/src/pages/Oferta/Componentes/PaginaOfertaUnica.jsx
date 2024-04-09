import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { axiosConfig } from '../../../constant/axiosConfig.constant';

const styles = `
    .degradado-invertido {
        border: solid ;  
    }
`;

export const PaginaOfertaUnica = () => {
    const { idOferta } = useParams();
    const [oferta, setOferta] = useState(null);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/Mostrar/Oferta/Unica?idOferta=${idOferta}`,
            method: 'GET'
        })
            .then(res => {
                setOferta(res.data);
            })
            .catch(err => console.log(err));
    }, [idOferta]);

    if (!oferta) {
        return <div>Cargando...</div>;
    }

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            <style>{styles}</style>
            <Typography variant="h4">{oferta.Nombre}</Typography>
            <Typography variant="body1">Descripción: {oferta.Descripcion}</Typography>
            <Typography variant="body1">Empresa: {oferta.Empresa}</Typography>
            <Typography variant="body1">Disponible: {oferta.Disponible ? 'Sí' : 'No'}</Typography>
            <Typography variant="h5">Tags:</Typography>
            <ul>
                {oferta.Tags.map((tag, index) => (
                    <li key={index}>{tag.Lenguaje}: {tag.Puntuacion}</li>
                ))}
            </ul>
            <Button variant="contained" color="primary">Interesado</Button>
        </div>
    );
};

export default PaginaOfertaUnica;
