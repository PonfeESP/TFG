import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, Button, TableContainer, TableHead, TableRow, Typography, Modal, TextField, Autocomplete, Box, Rating } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';
import { Link } from 'react-router-dom';

const styles = `
    .degradado-invertido {
        border: solid ;  
    }
`;

export const PaginaEmpresa = ({ userId }) => {
    const [ofertas, setOfertas] = useState([]);
    const [nuevaOfertaData, setNuevaOfertaData] = useState({
        Nombre: '',
        Descripcion: '',
        Tags: [],
        Disponible: true,
        Empresa: userId,
        Interesados: []
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [tags, setTags] = useState([]);
    const [tagsExperience, setTagsExperience] = useState({});
    const [programmingLanguages, setProgrammingLanguages] = useState([]);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/ofertas_empresa/${userId}`,
            method: 'GET'
        })
            .then(res => {
                setOfertas(res.data);
            })
            .catch(err => console.log(err))
    }, [userId]);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/tags',
            method: 'GET'
        })
            .then(res => {
                setProgrammingLanguages(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevaOfertaData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleTagsChange = (event, value) => {
        setTags(value);
    };

    const handleExperienceChange = (event, value, tag) => {
        setTagsExperience({ ...tagsExperience, [tag]: value });
    };

    const handleRegistrarNuevaOferta = () => {
        const tagsData = tags.map(tag => ({ Lenguaje: tag.label, Puntuacion: tagsExperience[tag.value] || 0 }));
        setNuevaOfertaData(prevData => ({ ...prevData, Tags: tagsData }));
    };

    useEffect(() => {
        if (nuevaOfertaData.Tags.length > 0) {
            axios.post(`http://localhost:8000/registro_oferta/${userId}`, nuevaOfertaData)
                .then(res => {
                    console.log('Oferta registrada con éxito:', res.data);
                    setOfertas(prevOfertas => [...prevOfertas, res.data]);
                    handleModalClose();
                    // Resetear la información de la nueva oferta después del registro exitoso
                    setNuevaOfertaData({
                        Nombre: '',
                        Descripcion: '',
                        Tags: [],
                        Disponible: true,
                        Empresa: userId,
                        Interesados: []
                    });
                })
                .catch(err => {
                    console.error('Error al registrar la oferta:', err);
                });
        }
    }, [nuevaOfertaData.Tags.length]);

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            <style>{styles}</style>
            {ofertas.length > 0 && !!ofertas[0]._id && (
                <Table aria-label="collapsible table" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', backgroundImage: 'linear-gradient(to right, red 0%, blue 100%)', backgroundOrigin: 'border-box', borderSpacing: '5px', border: '5px solid transparent' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>OFERTA</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>DESCRIPCION</Typography></TableCell>
                            <TableCell className="degradado-invertido"><Typography sx={{ fontWeight: 'bold', color: 'white' }}>TAGs</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ofertas.map((oferta, index) => (
                            <TableRow key={oferta._id}>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}>
                                    <Link to={`/oferta/${oferta._id}`}>
                                        <Typography sx={{ fontWeight: 'bold', color: 'white' }}>{oferta.Nombre}</Typography>
                                    </Link>
                                </TableCell>                                
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}><Typography sx={{ fontWeight: 'bold', color: 'white' }}>{oferta.Descripcion}</Typography></TableCell>
                                <TableCell className="degradado-invertido" style={{ background: 'transparent' }}>
                                    {oferta.Tags && oferta.Tags.map((tag, tagIndex) => (
                                        <Typography key={tagIndex} sx={{ fontWeight: 'bold', color: 'white' }}>{tag.Lenguaje}: {tag.Puntuacion}</Typography>
                                    ))}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            <Button variant="contained" color="primary" onClick={handleModalOpen}>
                Registrar Nueva Oferta
            </Button>
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <Typography variant="h6" id="modal-title">Registrar Nueva Oferta</Typography>
                    <TextField
                        label="Nombre"
                        name="Nombre"
                        value={nuevaOfertaData.Nombre}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Descripción"
                        name="Descripcion"
                        value={nuevaOfertaData.Descripcion}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Autocomplete
                        multiple
                        options={programmingLanguages.map(language => ({ label: language.Nombre, value: language._id }))}
                        getOptionLabel={option => option.label}
                        value={tags}
                        onChange={handleTagsChange}
                        renderInput={params => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Tags (Programming Languages)"
                                placeholder="Select tags"
                            />
                        )}
                    />
                    {tags.map(tag => (
                        <Box key={tag.value}>
                            <span>{tag.label}</span>
                            <Rating
                                name={tag.value}
                                value={tagsExperience[tag.value] || 0}
                                onChange={(event, value) => handleExperienceChange(event, value, tag.value)}
                            />
                        </Box>
                    ))}
                    <Button variant="contained" color="primary" onClick={handleRegistrarNuevaOferta}>Registrar</Button>
                </div>
            </Modal>
        </div>
    );
}

export default PaginaEmpresa;
