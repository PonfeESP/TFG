import React, { useState, useEffect } from 'react';
import {
    Typography, Box, Grid, Chip, Avatar, Card, CardContent, CardMedia, SpeedDial, SpeedDialAction, List, ListItem, ListItemText, CircularProgress, LinearProgress, Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import axios from 'axios';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { axiosConfig } from '../../../constant/axiosConfig.constant';
import Fondo from '../../../Imagenes/HeaderDefinitivo2.jpg';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';


const OfertaVisualizacion = ({ ofertaId, userId, userType }) => {

    const [errors, setErrors] = useState({});
    const [ofertaData, setOfertaData] = useState(null);
    const [ofertaData2, setOfertaData2] = useState(null);
    const [showFloatingPanel, setShowFloatingPanel] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isInterested, setIsInterested] = useState(false);
    const [datosUsuarios, setDatosUsuarios] = useState([]);

    useEffect(() => {
        const url =
            userType === 'Desempleado'
                ? `http://localhost:8000/ofertaUnicaDesempleado/${ofertaId}`
                : `http://localhost:8000/ofertaUnicaEmpresa/${ofertaId}`;

        axios({
            ...axiosConfig,
            url: url,
            method: 'GET'
        })
            .then(res => {
                if (userType === 'Desempleado') {
                    setIsInterested(res.data.oferta.Interesados.includes(userId));
                    setOfertaData(res.data);
                } else if (userType === 'Empresa') {
                    setOfertaData2(res.data);
                }
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setErrors('Error al cargar los datos de la oferta');
            });
    }, [userType, ofertaId]);

    useEffect(() => {
        if (userType === 'Empresa' && ofertaData2) {
            async function fetchData() {
                try {
                    const promesasDatosUsuarios = ofertaData2.Interesados.map(async (idUsuario) => {
                        const respuesta = await axios({
                            ...axiosConfig,
                            url: `http://localhost:8000/usuarios/${idUsuario}`,
                            method: 'GET'
                        });
                        return respuesta.data;
                    });

                    const arregloDatosUsuarios = await Promise.all(promesasDatosUsuarios);
                    setDatosUsuarios(arregloDatosUsuarios);
                } catch (error) {
                    console.error('Error al obtener los datos de usuario:', error);
                    setErrors('Error al cargar los datos de la oferta');
                }
            }

            fetchData();
        }
    }, [userType, ofertaData2]);

    const handleInterest = () => {
        const idOferta = ofertaData.oferta._id;
        if (isInterested) {
            handleDisinterest();
        } else {
            axios({
                ...axiosConfig,
                url: 'http://localhost:8000/solicitud_oferta',
                method: 'PUT',
                data: {
                    userId: userId,
                    ofertaId: idOferta
                }
            })
                .then(res => {
                    console.log('Solicitud enviada con éxito');
                    setIsInterested(true);
                })
                .catch(err => {
                    console.log(err);
                    if (err.response && err.response.status === 400) {
                        setErrorMessage(err.response.data.error);
                    } else {
                        setErrorMessage('Error al enviar la solicitud. Por favor, inténtelo de nuevo.');
                    }
                });
        }
    };

    const handleDisinterest = () => {
        const idOferta = ofertaData.oferta._id;
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/solicitud_oferta/${idOferta}`,
            method: 'DELETE',
            data: {
                userId: userId,
            }
        })
            .then(res => {
                console.log('Usuario eliminado de la lista de interesados con éxito');
                setIsInterested(false);
            })
            .catch(err => {
                console.error(err);
                if (err.response && err.response.status === 400) {
                    setErrorMessage(err.response.data.error);
                } else {
                    setErrorMessage('Error al enviar la solicitud. Por favor, inténtelo de nuevo.');
                }
            });
    };

    const handleShare = () => {
        if (userType === 'Desempleado'){
        const shareUrl = `${window.location.origin}/oferta/${ofertaData._id}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Enlace copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar el enlace: ', err);
        });
    }else if (userType === 'Empresa'){
        const shareUrl = `${window.location.origin}/oferta/${ofertaData2._id}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Enlace copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar el enlace: ', err);
        });
    }
    };

    if (!ofertaData && userType === 'Desempleado') return <div>Loading...</div>;
    if (!ofertaData2 && userType === 'Empresa') return <div>Loading...</div>;

    if (userType === 'Desempleado') {
        return (
            <Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    padding={2}
                >
                    <Card style={{ maxWidth: 800, width: '100%', backgroundColor: '#f5f5f5' }}>
                        <Box position="relative">
                            <CardMedia
                                component="img"
                                height="150"
                                image={Fondo}
                                alt="Imagen de cabecera"
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '80%',
                                    textAlign: 'center',
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: 'white',
                                        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                                        wordWrap: 'break-word',
                                    }}
                                >
                                    {ofertaData.oferta.Nombre}
                                </Typography>
                            </Box>
                        </Box>
                        <CardContent>
                            <div style={{ position: 'relative', textAlign: 'right' }}>
                                <Button
                                    variant="contained"
                                    onClick={handleShare}
                                    style={{ position: 'absolute', top: 0, right: 0 }}
                                >
                                    <ShareIcon sx={{ mr: 1 }} />
                                </Button>
                                <Button
                                    sx={{ marginRight: 9 }}
                                    variant="contained"
                                    onClick={ofertaData.isInterested ? handleDisinterest : handleInterest}
                                    style={{ position: 'absolute', top: 0, right: 0 }}
                                >
                                    {isInterested ? <FavoriteIcon sx={{ mr: 1 }} /> : <FavoriteBorderIcon sx={{ mr: 1 }} />}
                                </Button>
                            </div>
                            <Typography variant="h4" gutterBottom align="center">
                                Detalles
                            </Typography>
                            <Grid container spacing={2} marginTop={'4px'}>
                                <Grid item xs={12}>
                                    <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto" textAlign="center">
                                        <Typography variant="h5" gutterBottom align="center">
                                            Empresa Organizadora
                                        </Typography>
                                        <Link to={`/empresa/${ofertaData.oferta.Empresa._id}`} underline="none" color="inherit">
                                            {ofertaData.oferta.Empresa.Nombre}
                                        </Link>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto">
                                        <Typography variant="h5" gutterBottom align="center">
                                            Descripción
                                        </Typography>
                                        <Typography variant="body1" align="center">
                                            {ofertaData.oferta.Descripcion}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto">
                                        <Typography variant="h5" gutterBottom align="center">
                                            Tags
                                        </Typography>
                                        <Box display="flex" justifyContent="center" flexWrap="wrap">
                                            {ofertaData.oferta.Tags.map(tag => (
                                                <Chip
                                                    key={tag.Lenguaje}
                                                    label={`${tag.Lenguaje} (${tag.Puntuacion})`}
                                                    color="primary"
                                                    variant="outlined"
                                                    style={{ margin: '5px' }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box border={1} borderColor="grey.300" borderRadius={4} p={2}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box
                                                width="30%"
                                                display="flex"
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <Box position="relative" textAlign="center">
                                                    <CircularProgress
                                                        variant="determinate"
                                                        value={Math.min(ofertaData.porcentajeConcordancia, 100)}
                                                        color={
                                                            ofertaData.porcentajeConcordancia >= 70 ? "success" :
                                                                ofertaData.porcentajeConcordancia >= 50 ? "warning" : "error"
                                                        }
                                                        size={120}
                                                    />
                                                    <Typography
                                                        variant="h5"
                                                        component="div"
                                                        position="absolute"
                                                        top="34%"
                                                        left="30%"
                                                        transform="translate(-50%, -50%)"
                                                        style={{ color: 'black' }}
                                                    >
                                                        {Math.round(Math.min(ofertaData.porcentajeConcordancia, 100))}%
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box width="60%">
                                                {ofertaData.porcentajeCoincidenciaPorTag &&
                                                    Object.entries(ofertaData.porcentajeCoincidenciaPorTag).map(([lenguaje, porcentaje]) => (
                                                        <Box key={lenguaje} marginBottom={2}>
                                                            <Typography variant="body1">{lenguaje}</Typography>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={Math.min(porcentaje, 100)}
                                                                color={
                                                                    porcentaje >= 80 ? "success" :
                                                                        porcentaje >= 50 ? "warning" : "error"
                                                                }
                                                            />
                                                        </Box>
                                                    ))}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        );
    } else if (userType === 'Empresa') {
        return (
            <Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    padding={2}
                >
                    <Card style={{ maxWidth: 800, width: '100%', backgroundColor: '#f5f5f5' }}>
                        <Box position="relative">
                            <CardMedia
                                component="img"
                                height="150"
                                image={Fondo}
                                alt="Imagen de cabecera"
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '80%',
                                    textAlign: 'center',
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: 'white',
                                        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                                        wordWrap: 'break-word',
                                    }}
                                >
                                    {ofertaData2.Nombre}
                                </Typography>
                            </Box>
                        </Box>
                        <CardContent>
                            <div style={{ position: 'relative', textAlign: 'right' }}>
                                <Button
                                    variant="contained"
                                    onClick={handleShare}
                                    style={{ position: 'absolute', top: 0, right: 0 }}
                                >
                                    <ShareIcon sx={{ mr: 1 }} />
                                </Button>
                            </div>
                            <Typography variant="h4" gutterBottom align="center">
                                Detalles
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto">
                                        <Typography variant="h5" gutterBottom align="center">
                                            Descripción
                                        </Typography>
                                        <Typography variant="body1" align="center">
                                            {ofertaData2.Descripcion}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto">
                                        <Typography variant="h5" gutterBottom align="center">
                                            Tags
                                        </Typography>
                                        <Box display="flex" justifyContent="center" flexWrap="wrap">
                                            {ofertaData2.Tags.map(tag => (
                                                <Chip
                                                    key={tag.Lenguaje}
                                                    label={`${tag.Lenguaje} (${tag.Puntuacion})`}
                                                    color="primary"
                                                    variant="outlined"
                                                    style={{ margin: '5px' }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h5" gutterBottom align="center">
                                        Usuarios interesados
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {datosUsuarios.map((usuario, index) => (
                                            <Grid item xs={12} sm={6} key={index}>
                                                <Box display="flex" alignItems="center" border={1} borderColor="grey.300" borderRadius={4} p={2} mb={2}>
                                                    {usuario.FotoPerfil ? (
                                                        <Avatar aria-label="business" src={`http://localhost:8000/profileImages/${usuario.FotoPerfil}`} />
                                                    ) : (
                                                        <Avatar aria-label="business">
                                                            {`${usuario.Nombre.charAt(0).toUpperCase()}`}
                                                        </Avatar>
                                                    )}
                                                    <Box ml={2}>
                                                        <Typography variant="h6" gutterBottom>
                                                            <Link to={`/usuario/${usuario._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                {usuario.Nombre}
                                                            </Link>
                                                        </Typography>
                                                        <Typography variant="body2" mt={1}>
                                                            Tags:
                                                            {usuario.Tags.map((tag, index) => (
                                                                <Chip key={index} label={`${tag.Lenguaje}: ${tag.Puntuacion}`} style={{ marginLeft: '5px' }} />
                                                            ))}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        );
    }
};

export default OfertaVisualizacion;
