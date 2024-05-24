import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Paper, Button, Typography, Hidden } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { axiosConfig } from '../constant/axiosConfig.constant';
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
        color: 'black', // Letras negras
        '&:hover': {
            backgroundColor: '#FFD600', // Cambio de color al pasar el cursor
        },
    },
    logo: {
        height: '100px', // Ajusta el tamaño del logo según sea necesario
        marginRight: 'auto', // Alinea el logo a la izquierda
    },
    iconButton: {
        color: 'white', // Cambia el color del icono a blanco
    }
};

const Header = ({ onMostrarOrdenada, onMostrarEmpresa, onMostrarEvento }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDesempleado, setIsDesempleado] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/user',
            method: 'GET'
        })
            .then(res => {
                setIsLoggedIn(true);
                setIsDesempleado(res.data.userType === 'Desempleado');
            })
            .catch(err => console.log(err));
    }, []);

    const performLogout = (event) => {
        event.preventDefault();

        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/logout',
            method: 'POST'
        })
            .then((response) => {
                if (response.data.status === 'Ok')
                    navigate('/');
            })
            .catch(() => {
                console.log('Error en el cierre de sesión');
            });
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" sx={styles.appBar}>
            <Toolbar>
                <img src={Logo} alt="Logo" style={styles.logo} />

                <Hidden mdDown>
                    {isLoggedIn && isDesempleado && (
                        <>
                            <Paper sx={styles.paper}>
                                <Button onClick={onMostrarOrdenada} sx={styles.mostrarButton}>Mostrar Ordenada</Button>
                            </Paper>

                            <Paper sx={styles.paper}>
                                <Button onClick={onMostrarEmpresa} sx={styles.mostrarButton}>Mostrar Empresas</Button>
                            </Paper>

                            <Paper sx={styles.paper}>
                                <Button onClick={onMostrarEvento} sx={styles.mostrarButton}>Mostrar Eventos</Button>
                            </Paper>
                        </>
                    )}
                </Hidden>

                <Hidden lgUp>
                    <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                        sx={styles.iconButton}
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
                                <MenuItem onClick={onMostrarEmpresa}>Mostrar Empresas</MenuItem>
                                <MenuItem onClick={onMostrarEvento}>Mostrar Eventos</MenuItem>
                            </>
                        )}
                        {isLoggedIn && (
                            <MenuItem onClick={performLogout}>Cerrar Sesión</MenuItem>
                        )}
                    </Menu>
                </Hidden>
            </Toolbar>
            <div className="header-margin" style={styles.appBarMargin}></div>
        </AppBar>
    );
};

export default Header;
