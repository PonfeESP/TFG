import React, { useState, useEffect } from 'react';
import { Container, TextField, Chip, Button, Card, CardContent, CardMedia, Typography, Grid, Box, Alert, Snackbar } from '@mui/material';
import { useParams } from 'react-router-dom';
import Header from '../../../../../components/Header2.component';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { axiosConfig } from '../../../../../constant/axiosConfig.constant';
import Fondo from '../../../../../Imagenes/HeaderDefinitivo2.jpg';
import ShareIcon from '@mui/icons-material/Share';

export const User = () => {
    const [open, setOpen] = useState(false);
    const { idUsuario } = useParams();
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: `http://localhost:8000/usuarios/${idUsuario}`,
            method: 'GET'
        })
            .then(res => {
                setUserData(res.data);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
            });
    }, [idUsuario]);


    const handleShare = () => {
        const shareUrl = `${window.location.origin}/usuario/${idUsuario}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            setOpen(true);
        }).catch(err => {
            console.error('Error al copiar el enlace: ', err);
        });
    };

    const handleClose2 = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    if (!userData) return <div>Loading...</div>;


    return (
        <>
            <Header
                onMostrarUsuarios={() => {
                    navigate('/usuario', { state: { valor: 'usuarios' } });
                }}
                onMostrarOfertas={() => {
                    navigate('/usuario', { state: { valor: 'ofertas' } });
                }}
                onMostrarEventos={() => {
                    navigate('/usuario', { state: { valor: 'eventos' } });
                }}
            />
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
                                {userData.Nombre}
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
                            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose2}>
                                <Alert onClose={handleClose2} severity="success" sx={{ width: '100%' }}>
                                    Enlace copiado al portapapeles.
                                </Alert>
                            </Snackbar>
                        </div>
                        <Typography variant="h4" gutterBottom align="center">
                            Perfil de Usuario
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box border={1} borderColor="grey.300" borderRadius={4} p={2}>
                                    <Typography variant="h5" gutterBottom align="center">
                                        Descripción
                                    </Typography>
                                    <Typography variant="body1" align="center">
                                        {userData.Descripcion}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box border={1} borderColor="grey.300" borderRadius={4} p={2}>
                                    <Typography variant="h5" gutterBottom align="center">
                                        Email de Contacto
                                    </Typography>
                                    <Typography variant="body1" align="center">
                                        {userData.Email}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto">
                                    <Typography variant="h5" gutterBottom align="center">
                                        Edad
                                    </Typography>
                                    <Typography variant="body1" align="center">
                                        {userData.Edad} años
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box border={1} borderColor="grey.300" borderRadius={4} p={2} overflow="auto">
                                    <Typography variant="h5" gutterBottom align="center">
                                        Experiencia Laboral
                                    </Typography>
                                    <Typography variant="body1" align="center">
                                        {userData.Experiencia_Laboral} años
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box border={1} borderColor="grey.300" borderRadius={4} p={2}>
                                    <Typography variant="h5" gutterBottom align="center">
                                        Tags
                                    </Typography>
                                    {userData.Tags.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={`${tag.Lenguaje}: ${tag.Puntuacion}`}
                                            variant="outlined"
                                            style={{ margin: '5px' }}
                                        />
                                    ))}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box border={1} borderColor="grey.300" borderRadius={4} p={2}>
                                    <Typography variant="h5" gutterBottom align="center">
                                        Curriculum
                                    </Typography>
                                    {userData.CurriculumPDF ? (
                                        <div style={{ marginTop: '40px', marginBottom: '20px', minWidth: '500px' }}>
                                            <iframe
                                                src={`http://localhost:8000/pdfs/${userData.CurriculumPDF}`}
                                                width="100%"
                                                height="500px"
                                                title="Curriculum PDF"
                                                onClick={() => window.open(`http://localhost:8000/pdfs/${userData.CurriculumPDF}`, '_blank')}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </div>
                                    ) : (
                                        <Typography variant="body1" align="center">
                                            El usuario no tiene un currículum.
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default User;
