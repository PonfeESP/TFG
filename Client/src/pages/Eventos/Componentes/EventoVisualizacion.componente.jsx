import React, { useState, useEffect } from 'react';
import {
    Typography, Box, Grid, Avatar, Dialog, DialogActions, DialogContent, DialogTitle, Chip, Card, CardContent, CardMedia, List, ListItem, ListItemText, CircularProgress, LinearProgress, Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import dayjs from 'dayjs';
import axios from 'axios';
import { axiosConfig } from '../../../constant/axiosConfig.constant';
import Fondo from '../../../Imagenes/HeaderDefinitivo2.jpg';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';


const EventoVisualizacion = ({ eventoId, userId, userType }) => {

    const [errors, setErrors] = useState({});
    const [eventoData, setEventoData] = useState(null);
    const [eventoData2, setEventoData2] = useState(null);
    const [showFloatingPanel, setShowFloatingPanel] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isInterested, setIsInterested] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [errorMessageOpen, setErrorMessageOpen] = useState(false);
    const [errorMessageContent, setErrorMessageContent] = useState('');
    const [datosUsuarios, setDatosUsuarios] = useState([]);

    useEffect(() => {
        const url =
            userType === 'Desempleado'
                ? `http://localhost:8000/eventoUnico/${eventoId}`
                : `http://localhost:8000/eventoUnicoEmpresa/${eventoId}`;
        axios({
            ...axiosConfig,
            url: url,
            method: 'GET'
        })
            .then(res => {
                if (userType === 'Desempleado') {
                    setIsInterested(res.data.Interesados.includes(userId));
                    setEventoData(res.data);
                } else if (userType === 'Empresa') {
                    setEventoData2(res.data);
                }
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setErrors('Error al cargar los datos de la Evento');
            });
    }, [userType, eventoId]);

    useEffect(() => {
        if (userType === 'Desempleado' && eventoData && eventoData.Registrados) {
            setIsRegistered(eventoData.Registrados.includes(userId));
        }
    }, [userType, eventoData, userId]);

    useEffect(() => {
        if (userType === 'Empresa' && eventoData2) {
            async function fetchData() {
                try {
                    const promesasDatosUsuarios = eventoData2.Registrados.map(async (idUsuario) => {
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
    }, [userType, eventoData2]);

    const handleShare = () => {
        const eventoid = eventoData._id;
        const shareUrl = `${window.location.origin}/evento/${eventoid}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Enlace copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar el enlace: ', err);
        });
    };

    const handleShare2 = () => {
        const eventoid = eventoData2._id;
        const shareUrl = `${window.location.origin}/evento/${eventoid}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Enlace copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar el enlace: ', err);
        });
    };

    const handleInterest = () => {
        const idEvento = eventoData._id;
        if (isInterested) {
            handleDisinterest();
        } else {
            axios({
                ...axiosConfig,
                url: 'http://localhost:8000/solicitud_evento',
                method: 'PUT',
                data: {
                    userId: userId,
                    eventId: idEvento
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

    const handleRegister = () => {
        const idEvento = eventoData._id;
        if (eventoData.Aforo - eventoData.Interesados.length > 0) {
            axios({
                ...axiosConfig,
                url: 'http://localhost:8000/solicitud_registro',
                method: 'PUT',
                data: {
                    userId: userId,
                    eventId: idEvento
                }
            })
                .then(res => {
                    console.log('Registro realizado con éxito');
                    setIsRegistered(true);
                })
                .catch(err => {
                    console.error(err);
                    if (err.response && err.response.status === 400) {
                        setErrorMessage(err.response.data.error);
                    } else {
                        setErrorMessage('Error al enviar la solicitud. Por favor, inténtelo de nuevo.');
                    }
                });
        } else {
            setErrorMessageContent('No hay plazas disponibles');
            setErrorMessageOpen(true);
        }
    };

    const handleCancelRegistration = () => {
        const idEvento = eventoData._id;
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/registro_evento/${idEvento}`,
            method: 'DELETE',
            data: {
                userId: userId,
            }
        })
            .then(res => {
                console.log('Cancelación de registro exitosa');
                setIsRegistered(false); // Actualizar el estado para reflejar la cancelación exitosa
            })
            .catch(err => {
                console.error(err);
                if (err.response && err.response.status === 400) {
                    setErrorMessage(err.response.data.error);
                } else {
                    setErrorMessage('Error al cancelar el registro. Por favor, inténtelo de nuevo.');
                }
            });
    };


    const handleDisinterest = () => {
        const idEvento = eventoData._id;
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/solicitud_evento/${idEvento}`,
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


    if (!eventoData && userType === 'Desempleado') return <div>Loading...</div>;
    if (!eventoData2 && userType === 'Empresa') return <div>Loading...</div>;

    if (userType === 'Desempleado') {
        return (
            <Box >
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
                                    {eventoData.Nombre}
                                </Typography>
                            </Box>
                        </Box>
                        <CardContent>
                            <div style={{ position: 'relative', textAlign: 'left' }}>
                                {isRegistered ? (
                                    <Button
                                        variant="contained"
                                        onClick={handleCancelRegistration}
                                        style={{ position: 'absolute', top: 0, left: 0 }}
                                    >
                                        Cancelar Registro
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={handleRegister}
                                        style={{ position: 'absolute', top: 0, left: 0 }}
                                    >
                                        Registrarse
                                    </Button>
                                )}
                            </div>
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
                                    onClick={eventoData.isInterested ? handleDisinterest : handleInterest}
                                    style={{ position: 'absolute', top: 0, right: 0 }}
                                >
                                    {isInterested ? <FavoriteIcon sx={{ mr: 1 }} /> : <FavoriteBorderIcon sx={{ mr: 1 }} />}
                                </Button>
                            </div>
                            <Typography variant="h4" gutterBottom align="center">
                                Detalles
                            </Typography>
                            <Grid item xs={12}>
                                <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto">
                                    <Typography variant="h5" gutterBottom align="center">
                                        Fecha
                                    </Typography>
                                    <Typography variant="body1" align="center">
                                        {dayjs(eventoData.Fecha).format("DD/MM/YYYY")}
                                    </Typography>
                                    <Typography variant="body1" align="center">
                                        {dayjs(eventoData.Fecha).format("HH:mm")}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid container spacing={2} marginTop={'4px'}>
                                <Grid item xs={12}>
                                    <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto" textAlign="center">
                                        <Typography variant="h5" gutterBottom align="center">
                                            Empresa Organizadora
                                        </Typography>
                                        <Link to={`/empresa/${eventoData.Empresa._id}`} underline="none" color="inherit">
                                            {eventoData.Empresa.Nombre}
                                        </Link>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} marginTop={'4px'}>
                                <Grid item xs={12}>
                                    <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto">
                                        <Typography variant="h5" gutterBottom align="center">
                                            Descripción
                                        </Typography>
                                        <Typography variant="body1" align="center">
                                            {eventoData.Descripcion}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} marginTop={'3px'}>
                                <Grid item xs={6}>
                                    <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto">
                                        <Typography variant="h5" gutterBottom align="center">
                                            Aforo
                                        </Typography>
                                        <Typography variant="body1" align="center">
                                            {eventoData.Aforo}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto">
                                        <Typography variant="h5" gutterBottom align="center">
                                            Plazas restantes
                                        </Typography>
                                        <Typography variant="body1" align="center">
                                            {eventoData.Aforo - eventoData.Registrados.length}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto">
                                        <Typography variant="h5" gutterBottom align="center">
                                            Localización
                                        </Typography>
                                        <Typography variant="body1" align="center">
                                            {eventoData.Localizacion}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Dialog open={errorMessageOpen} onClose={() => setErrorMessageOpen(false)}>
                        <DialogTitle>Error</DialogTitle>
                        <DialogContent dividers>
                            <Typography>{errorMessageContent}</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setErrorMessageOpen(false)}>Cerrar</Button>
                        </DialogActions>
                    </Dialog>

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
                                    width: '80%', // Ajusta esto según sea necesario
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
                                    {eventoData2.Nombre}
                                </Typography>
                            </Box>
                        </Box>
                        <CardContent>
                            <div style={{ position: 'relative', textAlign: 'right' }}>
                                <Button
                                    variant="contained"
                                    onClick={handleShare2}
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
                                            {eventoData2.Descripcion}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto">
                                    <Typography variant="h5" gutterBottom align="center">
                                        Fecha
                                    </Typography>
                                    <Typography variant="body1" align="center">
                                        {dayjs(eventoData2.Fecha).format("DD/MM/YYYY")}
                                    </Typography>
                                    <Typography variant="body1" align="center">
                                        {dayjs(eventoData2.Fecha).format("HH:mm")}
                                    </Typography>
                                </Box>
                            </Grid>
                                <Grid container spacing={2} marginTop={'3px'}>
                                    <Grid item xs={6}>
                                        <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto">
                                            <Typography variant="h5" gutterBottom align="center">
                                                Aforo
                                            </Typography>
                                            <Typography variant="body1" align="center">
                                                {eventoData2.Aforo}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto">
                                            <Typography variant="h5" gutterBottom align="center">
                                                Plazas restantes
                                            </Typography>
                                            <Typography variant="body1" align="center">
                                                {eventoData2.Aforo - eventoData2.Registrados.length}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto">
                                            <Typography variant="h5" gutterBottom align="center">
                                                Localización
                                            </Typography>
                                            <Typography variant="body1" align="center">
                                                {eventoData2.Localizacion}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h5" gutterBottom align="center">
                                        Usuarios registrados
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

export default EventoVisualizacion;
