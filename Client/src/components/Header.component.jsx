import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Paper, Button, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { axiosConfig } from '../constant/axiosConfig.constant';
import { Login } from './Login';
import { Register } from './Register';
import './Header.css';

import Fondo from '../Imagenes/HeaderDefinitivo2.jpg';

const styles = {
    paper: {
        margin: '0 10px',
    },
    appBar: {
        position: 'relative',
        paddingTop: '20px',
        paddingBottom: '20px',
        backgroundImage: `url(${Fondo})`,
        backgroundSize: 'cover',
    },
    appBarMargin: {
        content: '',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 5,
        background: 'linear-gradient(90deg, #6A1B9A 17.5%, #FFEB3B 17.5% 35.6%, #B3E5FC 35.6% 100%)',
    },
    mostrarButton: {
        backgroundColor: '#FFEB3B', // Fondo amarillo
        color: 'black', // Letras blancas
        '&:hover': {
            backgroundColor: '#FFD600', // Cambio de color al pasar el cursor
        },
    },
};

export const Header = ({ onMostrarOrdenada, onMostrar, onMostrarEmpresa, onMostrarEvento, onModificarUsuario, onMostrarTags, onMostrarOfertas, onMostrarUsuario }) => {
    const [logoutError, setLogoutError] = useState('');
    const [userData, setUserData] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDesempleado, setIsDesempleado] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [OpenProfileDialog, setOpenProfileDialog] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/user',
            method: 'GET'
        })
            .then(res => {
                setUserData(res.data);
                setIsLoggedIn(true);
                setIsDesempleado(res.data.userType === 'Desempleado');
                setIsAdmin(res.data.userType === 'Admin');
            })
            .catch(err => console.log(err))
    }, []);

    const performLogout = (event) => {
        event.preventDefault();
        setLogoutError('');

        if (userData) {
            axios({
                ...axiosConfig,
                url: 'http://localhost:8000/logout',
                method: 'POST'
            })
                .then((response) => {
                    if (response.data.status === 'Ok')
                        navigate('/');
                    else
                        setLogoutError(response.data.error);
                })
                .catch(() => {
                    console.log('Error en el cierre de sesión');
                    setLogoutError('Error en el Cierre de Sesión. Inténtelo más tarde.');
                })
        }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOpenProfileDialog = () => {
        setOpenProfileDialog(true);
    };

    const handleCloseProfileDialog = () => {
        setOpenProfileDialog(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
                {isLoggedIn && isDesempleado && (
                    <>
                        <Paper sx={styles.paper}>
                            <Button onClick={onMostrarOrdenada} sx={styles.mostrarButton}>Mostrar Ordenada</Button>
                        </Paper>

                        <Paper sx={styles.paper}>
                            <Button onClick={onMostrar} sx={styles.mostrarButton}>Mostrar</Button>
                        </Paper>

                        <Paper sx={styles.paper}>
                            <Button onClick={onMostrarEmpresa} sx={styles.mostrarButton}>Mostrar Empresas</Button>
                        </Paper>

                        <Paper sx={styles.paper}>
                            <Button onClick={onMostrarEvento} sx={styles.mostrarButton}>Mostrar Eventos</Button>
                        </Paper>

                        <Paper sx={styles.paper}>
                            <Button onClick={onModificarUsuario} sx={styles.mostrarButton}>Modificar Usuario</Button>
                        </Paper>
                    </>
                )}

                {isLoggedIn && isAdmin && (
                    <Paper sx={styles.paper}>
                        <Button onClick={onMostrarTags} sx={styles.mostrarButton}>Tags</Button>
                    </Paper>
                )}

                {isLoggedIn && !isDesempleado && !isAdmin && (
                    <>
                        <Paper sx={styles.paper}>
                            <Button onClick={onMostrarOfertas} sx={styles.mostrarButton}>Mostrar Ofertas</Button>
                        </Paper>

                        <Paper sx={styles.paper}>
                            <Button onClick={onMostrarEvento} sx={styles.mostrarButton}>Mostrar Eventos</Button>
                        </Paper>

                        <Paper sx={styles.paper}>
                            <Button onClick={onMostrarUsuario} sx={styles.mostrarButton}>Mostrar Usuarios</Button>
                        </Paper>

                        <Paper sx={styles.paper}>
                            <Button onClick={onModificarUsuario} sx={styles.mostrarButton}>Modificar Usuario</Button>
                        </Paper>
                    </>
                )}

                {isLoggedIn ? (
                    <>
                        <div>
                            <IconButton
                                aria-controls="simple-menu"
                                aria-haspopup="true"
                                onClick={handleClick}
                                className="iconButton"
                            >
                                <EditIcon />
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={performLogout}>Cerrar Sesión</MenuItem>
                            </Menu>
                        </div>
                    </>
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
