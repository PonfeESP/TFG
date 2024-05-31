import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Card, CardContent, CardMedia, Typography, Grid, Box, List } from '@mui/material';
import { useParams } from 'react-router-dom';
import Header from '../../../../../components/Header2.component';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { axiosConfig } from '../../../../../constant/axiosConfig.constant';
import Fondo from '../../../../../Imagenes/HeaderDefinitivo2.jpg';
import ShareIcon from '@mui/icons-material/Share';

export const User = () => {
    const { idUsuario } = useParams();
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    console.log("dAD", idUsuario)

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
        const shareUrl = `${window.location.origin}/empresa/${idUsuario}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Enlace copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar el enlace: ', err);
        });
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
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default User;
