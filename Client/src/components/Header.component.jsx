// Importaciones de React
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Paper, Button, Typography, Hidden } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { axiosConfig } from '../constant/axiosConfig.constant';
import { Login } from './Login';
import { Register } from './Register';
import './Header.css';

import Fondo from '../Imagenes/HeaderDefinitivo2.jpg';
import Logo from '../Imagenes/LogoTransparente.png'; // Importa la ruta de tu logo

const styles = {
    paper: {
        margin: '0 10px',
    },
    appBar: {
        position: 'relative',
        paddingTop: '10px',
        paddingBottom: '10px',
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
    logo: {
        height: '100px', // Ajusta el tamaño del logo según sea necesario
        marginRight: 'auto', // Alinea el logo a la izquierda
    },
    iconButton: {
        color: 'white', /* Cambia el color del icono a rojo */
    }
};

export const Header = ({ onMostrarOrdenada, onMostrar, onMostrarInteresado, onMostrarEmpresa, onMostrarEvento, onModificarUsuario, onMostrarTags, onMostrarOfertas, onMostrarUsuario }) => {
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
                <img src={Logo} alt="Logo" style={styles.logo} /> {/* Reemplaza "ITJobFinder" por el logo */}

                {!isLoggedIn && (
                    <>
                        <Paper sx={styles.paper}>
                            <Login />
                        </Paper>
                        <Paper sx={styles.paper}>
                            <Register />
                        </Paper>
                    </>
                )}

                <Hidden mdDown>
                    {isLoggedIn && isDesempleado && (
                        <>
                            <Paper sx={styles.paper}>
                                <Button onClick={onMostrarOrdenada} sx={styles.mostrarButton}>Mostrar Ordenada</Button>
                            </Paper>

                            <Paper sx={styles.paper}>
                                <Button onClick={onMostrar} sx={styles.mostrarButton}>Mostrar Ofertas</Button>
                            </Paper>

                            <Paper sx={styles.paper}>
                                <Button onClick={onMostrarOfertas} sx={styles.mostrarButton}>Tus Ofertas</Button>
                            </Paper>

                            <Paper sx={styles.paper}>
                                <Button onClick={onMostrarEmpresa} sx={styles.mostrarButton}>Mostrar Empresas</Button>
                            </Paper>

                            <Paper sx={styles.paper}>
                                <Button onClick={onMostrarEvento} sx={styles.mostrarButton}>Mostrar Eventos</Button>
                            </Paper>

                            <Paper sx={styles.paper}>
                                <Button onClick={onMostrarInteresado} sx={styles.mostrarButton}>Tus Eventos</Button>
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
                        </>
                    )}

                    {isLoggedIn && (
                        <>
                            <div>
                                <IconButton
                                    aria-controls="simple-menu"
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                    sx={styles.iconButton}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={onModificarUsuario}>Modificar Usuario</MenuItem>
                                    <MenuItem onClick={performLogout}>Cerrar Sesión</MenuItem>
                                </Menu>
                            </div>
                        </>
                    )}
                </Hidden>

                <Hidden lgUp>
                    <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                        className="iconButton"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        {isLoggedIn && isDesempleado && (
                            <>
                                <MenuItem onClick={onMostrarOrdenada}>Mostrar Ordenada</MenuItem>
                                <MenuItem onClick={onMostrar}>Mostrar Ofertas</MenuItem>
                                <MenuItem onClick={onMostrarOfertas}>Tus Ofertas</MenuItem>
                                <MenuItem onClick={onMostrarEmpresa}>Mostrar Empresas</MenuItem>
                                <MenuItem onClick={onMostrarEvento}>Mostrar Eventos</MenuItem>
                                <MenuItem onClick={onMostrarInteresado} >Tus Eventos</MenuItem>
                            </>
                        )}

                        {isLoggedIn && isAdmin && (
                            <MenuItem onClick={onMostrarTags}>Tags</MenuItem>
                        )}

                        {isLoggedIn && !isDesempleado && !isAdmin && (
                            <>
                                <MenuItem onClick={onMostrarOfertas}>Mostrar Ofertas</MenuItem>
                                <MenuItem onClick={onMostrarEvento}>Mostrar Eventos</MenuItem>
                                <MenuItem onClick={onMostrarUsuario}>Mostrar Usuarios</MenuItem>
                            </>
                        )}

                        {isLoggedIn && (
                            <>
                                <MenuItem onClick={onModificarUsuario}>Modificar Usuario</MenuItem>
                                <MenuItem onClick={performLogout}>Cerrar Sesión</MenuItem>
                            </>
                        )}

                    </Menu>
                </Hidden>
            </Toolbar>
            {logoutError && <div>{logoutError}</div>}
            <div className="header-margin" style={styles.appBarMargin}></div>

        </AppBar>
    );
}

export default Header;
