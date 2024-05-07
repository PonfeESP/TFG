import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, TextField, Chip, Box } from '@mui/material';
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
    const [userData, setUserData] = useState({});
    const [finishLoading, setFinishLoading] = useState(null);
    const [nuevoTag, setNuevoTag] = useState('');
    const [tags, setTags] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [disponible, setDisponible] = useState(false);

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
            url: `http://localhost:8000/oferta_empresa/${idOferta}`,
            method: 'GET'
        })
            .then(res => {
                setOferta(res.data);
                const formattedTags = res.data.Tags.map(tag => ({
                    nombre: tag.Lenguaje,
                    puntuacion: tag.Puntuacion
                }));
                setTags(formattedTags);
                setDescripcion(res.data.Descripcion);
                setDisponible(res.data.Disponible);
            })
            .catch(err => console.log(err));
    }, []);

    const handleModificar = () => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/oferta/${idOferta}`,
            method: 'PUT',
            data: { 
                Descripcion: descripcion,
                Disponible: disponible,
                Tags: tags.map(tag => ({ Lenguaje: tag.nombre, Puntuacion: tag.puntuacion }))
            }
        })
            .then(res => {
                console.log('Oferta modificada con éxito:', res.data);
            })
            .catch(err => console.log(err));
    };

    const handleNuevoTag = () => {
        setTags([...tags, { nombre: nuevoTag, puntuacion: 0 }]);
        setNuevoTag('');
    };

    const handleEliminarTag = (tag) => {
        setTags(tags.filter(t => t.nombre !== tag.nombre));
    };

    const handleModificarPuntuacion = (index, nuevaPuntuacion) => {
        const newTags = [...tags];
        newTags[index].puntuacion = nuevaPuntuacion;
        setTags(newTags);
    };

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            <style>{styles}</style>
            {oferta && (
                <>
                    <Typography variant="h4">{oferta.Nombre}</Typography>
                    <Typography variant="body1">Descripción: 
                        <TextField
                            multiline
                            variant="outlined"
                            fullWidth
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                    </Typography>
                    <Typography variant="body1">Empresa: {oferta.Nombre_Empresa}</Typography>
                    <Typography variant="body1">Disponible: 
                        <input
                            type="checkbox"
                            checked={disponible}
                            onChange={(e) => setDisponible(e.target.checked)}
                        />
                    </Typography>
                    <Typography variant="h5">Tags:</Typography>
                    <Box display="flex" flexDirection="column">
                        {tags.map((tag, index) => (
                            <Box key={index} display="flex" alignItems="center" mb={1}>
                                <Chip label={`${tag.nombre} (${tag.puntuacion})`} onDelete={() => handleEliminarTag(tag)} />
                                <TextField
                                    label="Puntuación"
                                    variant="outlined"
                                    type="number"
                                    value={tag.puntuacion}
                                    onChange={(e) => handleModificarPuntuacion(index, e.target.value)}
                                    style={{ marginLeft: '10px' }}
                                />
                            </Box>
                        ))}
                    </Box>
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
