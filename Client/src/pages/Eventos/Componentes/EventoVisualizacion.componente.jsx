import React, { useState, useEffect } from 'react';
import {
    Typography, Box, Grid, Chip, Card, CardContent, CardMedia, List, ListItem, ListItemText, CircularProgress, LinearProgress, Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
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

    useEffect(() => {
        const url =
            userType === 'Desempleado'
                ? `http://localhost:8000/eventoUnicoDesempleado/${eventoId}`
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

    const handleShare = () => {
        const eventoid = eventoData._id;
        const shareUrl = `${window.location.origin}/evento/${eventoid}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Enlace copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar el enlace: ', err);
        });
    };

    const handleInterest = () => {
        const idEvento = eventoData._id;
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/solicitud_evento',
            method: 'PUT',
            data: {
                userId: userId,
                eventoId: idEvento
            }
        })
            .then(res => {
                console.log('Solicitud enviada con éxito');
                setIsRegistrado(true);
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
    };

    const handleDisinterest = () => {
        const evento = props;
        const idEvento = evento._id;
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
                setIsRegistrado(false);
                setIsInterested(false); // Actualizar el estado para reflejar el desinterés del usuario
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
            <Box>
                {userType === 'Desempleado' && window.innerWidth > 700 && (
                    <Box
                        sx={{
                            position: 'fixed',
                            top: '50%',
                            right: 0,
                            transform: 'translateY(-50%)',
                            backgroundColor: 'white',
                            padding: '10px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            zIndex: 999
                        }}
                    >
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Button variant="contained" onClick={handleShare}>
                                <ShareIcon sx={{ mr: 1 }} />
                                Compartir
                            </Button>
                            {eventoData.isInterested ? (
                                <Button variant="contained" onClick={handleDisinterest}>
                                    <FavoriteIcon sx={{ mr: 1 }} />
                                    No me interesa
                                </Button>
                            ) : (
                                <Button variant="contained" onClick={handleInterest}>
                                    <FavoriteIcon sx={{ mr: 1 }} />
                                    Me interesa
                                </Button>
                            )}
                        </Box>

                    </Box>
                )}
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="80vh" // Ajusta la altura según sea necesario
                    padding={2}
                >
                    <Card style={{ maxWidth: 800, width: '100%', backgroundColor: '#f5f5f5' }}>
                        <Grid>
                            <CardMedia
                                component="div"
                                image={Fondo}
                                alt="Imagen de cabecera"
                                sx={{
                                    position: 'relative',
                                    width: '100%', // Esto asegura que el CardMedia tome todo el ancho del contenedor padre
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        padding: '16px', // Agrega algo de padding para que el texto no toque los bordes
                                        textAlign: 'center',
                                        backgroundImage: `url(${Fondo})`, // Asegura que la imagen de fondo esté aplicada
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
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
                            </CardMedia>
                        </Grid>
                        <CardContent>
                            <Typography variant="h4" gutterBottom align="center">
                                Detalles de el Evento
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
                                        <Link to={`/evento/${eventoData.Empresa._id}`} underline="none" color="inherit">
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
                                            {eventoData.Aforo - eventoData.Interesados.length}
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
                </Box>
                {userType === 'Desempleado' && window.innerWidth < 700 && (
                    <Box
                        sx={{
                            position: 'fixed',
                            top: '50%',
                            right: 0,
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            zIndex: 999
                        }}
                        onClick={() => setShowFloatingPanel(!showFloatingPanel)}
                    >
                        <KeyboardArrowLeftIcon />
                    </Box>
                )}
            </Box>
        );
    } else if (userType === 'Empresa') {
        return (
            <Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="80vh"
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
                                            {eventoData2.Descripcion}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto">
                                        <Typography variant="h5" gutterBottom align="center">
                                            Tags
                                        </Typography>
                                        <Box display="flex" justifyContent="center" flexWrap="wrap">
                                            {eventoData2.Tags.map(tag => (
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
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        );
    }
};

export default EventoVisualizacion;
