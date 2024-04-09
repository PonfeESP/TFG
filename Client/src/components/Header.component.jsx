import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Paper, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { axiosConfig } from '../constant/axiosConfig.constant';
import { Login } from './Login'; // Importa el componente Login si ya lo tienes implementado
import { Register } from './Register'; // Importa el componente Register si ya lo tienes implementado

import Fondo from '../Imagenes/HeaderDefinitivo2.jpg';

const styles = {
    paper: {
        margin: '0 10px',
    },
    appBar: {
        position: 'relative',
        paddingTop: '20px',
        paddingBottom: '20px',
        backgroundImage: `url(${Fondo})`, // Aplica imagen de fondo
        backgroundSize: 'cover', // Asegura que la imagen cubra todo el encabezado
    },
    appBarMargin: {
        content: '',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 5,
        background: 'linear-gradient(90deg, #6A1B9A 17.5%, #FFEB3B 17.5% 35.6%, #B3E5FC 35.6% 100%)', // Aplica gradiente
    },
};

export const Header = () => {
    const [logoutError, setLogoutError] = useState();
    const [userData, setUserData] = useState({});
    const [finishLoading, setFinishLoading] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/user',
            method: 'GET'
        })
            .then(res => {
                setUserData(res.data);
                setFinishLoading(!!res.data && !!res.data.userType);
                setIsLoggedIn(true)
            })
            .catch(err => console.log(err))
    }, []);

    const performLogout = (event) => {
        event.preventDefault();
        setLogoutError('');

        if (!!userData) {
            axios({
                ...axiosConfig,
                url: 'http://localhost:8000/logout',
                method: 'POST'

            }).then((response) => {
                if (response.data.status === 'Ok')
                    navigate('/'); // Navega a la página de Inicio
                else
                    setLogoutError(response.data.error);
            })
                .catch((error) => {
                    console.log('Error en el cierre de sesión');
                    setLogoutError('Error en el Cierre de Sesión. Inténtelo más tarde.');
                })
        }
    };

    return (
        <AppBar position="static" sx={styles.appBar}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    ITJobFinder
                </Typography>
                {/* Mostrar el botón de cierre de sesión si el usuario está autenticado, de lo contrario, mostrar los botones de inicio de sesión */}
                {isLoggedIn ? (
                    <Paper sx={styles.paper}>
                        <Button onClick={e => performLogout(e)}>CERRAR SESION</Button>
                    </Paper>
                ) : (
                    <>
                        <Paper sx={styles.paper}>
                            <Login />
                        </Paper>
                        <Paper sx={styles.paper}>
                            <Register />
                        </Paper>
                    </>
                )}
            </Toolbar>
            {logoutError && <div>{logoutError}</div>}
            <div className="header-margin" style={styles.appBarMargin}></div>
        </AppBar>
    );
}

export default Header;
