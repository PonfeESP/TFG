import React, { useState, useEffect } from 'react';
import {
    Typography, Box, Grid, Chip, Card, CardContent, CardMedia, List, ListItem, ListItemText, CircularProgress, LinearProgress, Button
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import axios from 'axios';
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

    const handleShare = () => {
        const ofertaid = ofertaData.oferta._id;
        const shareUrl = `${window.location.origin}/oferta/${ofertaid}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Enlace copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar el enlace: ', err);
        });
    };

    const handleInterest = () => {
        const idOferta = ofertaData.oferta._id;
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
        const oferta = props;
        const idOferta = oferta._id;
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

    if (!ofertaData && userType === 'Desempleado') return <div>Loading...</div>;
    if (!ofertaData2 && userType === 'Empresa') return <div>Loading...</div>;

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
                            {ofertaData.isInterested ? (
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
                    height="80vh" // Ajusta la altura según sea necesario
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
                                    {ofertaData.oferta.Nombre}
                                </Typography>
                            </Box>
                        </Box>
                        <CardContent>
                            <Typography variant="h4" gutterBottom align="center">
                                Detalles de la Oferta
                            </Typography>
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
                                                            ofertaData.porcentajeConcordancia >= 80 ? "success" :
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
                    height="80vh" // Ajusta la altura según sea necesario
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
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        );
    }
};

export default OfertaVisualizacion;
