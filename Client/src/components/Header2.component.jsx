import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, IconButton, Menu, MenuItem,
    Paper, Button, Hidden, Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { axiosConfig } from '../constant/axiosConfig.constant';
import './Header.css';
import { Login } from './Login';
import { Register } from './Register';
import Fondo from '../Imagenes/HeaderDefinitivo2.jpg';
import Logo from '../Imagenes/LogoTransparente.png';

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
        backgroundColor: '#FFEB3B',
        color: 'black',
        '&:hover': {
            backgroundColor: '#FFD600',
        },
    },
    logo: {
        height: '100px',
        marginRight: 'auto',
    },
    iconButton: {
        color: 'white',
    },
    rightIconButton: {
        color: 'white',
    }
};

const Header = ({ onMostrarDesempleado, onMostrarPerfil, onMostrarEmpresa, onMostrarEvento, onMostrarUsuarios, onMostrarOfertas, onMostrarEventos }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDesempleado, setIsDesempleado] = useState(false);
    const [isEmpresa, setIsEmpresa] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
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
                setIsEmpresa(res.data.userType === 'Empresa');
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
                if (response.data.status === 'Ok') {
                    navigate('/');
                }
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

    const handleUserMenuOpen = (event) => {
        setUserMenuAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    return (
        <AppBar position="static" sx={styles.appBar}>
            <Toolbar>
                <img src={Logo} alt="Logo" style={styles.logo} />
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
                    {(isLoggedIn && isDesempleado) && (
                        <>
                            <Paper sx={styles.paper}>
                                <Button onClick={onMostrarDesempleado} sx={styles.mostrarButton}>Mostrar Ofertas</Button>
                            </Paper>
                            <Paper sx={styles.paper}>
                                <Button onClick={onMostrarEmpresa} sx={styles.mostrarButton}>Mostrar Empresas</Button>
                            </Paper>
                            <Paper sx={styles.paper}>
                                <Button onClick={onMostrarEvento} sx={styles.mostrarButton}>Mostrar Eventos</Button>
                            </Paper>
                        </>
                    )}
                    {(isLoggedIn && isEmpresa) && (
                        <>
                            <Paper sx={styles.paper}>
                                <Button onClick={onMostrarUsuarios} sx={styles.mostrarButton}>Usuarios</Button>
                            </Paper>
                            <Paper sx={styles.paper}>
                                <Button onClick={onMostrarOfertas} sx={styles.mostrarButton}>Ofertas</Button>
                            </Paper>
                            <Paper sx={styles.paper}>
                                <Button onClick={onMostrarEventos} sx={styles.mostrarButton}>Eventos</Button>
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
                        {(isLoggedIn && isDesempleado) && (
                            <>
                                <MenuItem onClick={onMostrarDesempleado}>Mostrar Ordenada</MenuItem>
                                <MenuItem onClick={onMostrarEmpresa}>Mostrar Empresas</MenuItem>
                                <MenuItem onClick={onMostrarEvento}>Mostrar Eventos</MenuItem>
                            </>
                        )}
                        {(isLoggedIn && isEmpresa) && (
                            <>
                                <MenuItem onClick={onMostrarUsuarios}>Usuarios</MenuItem>
                                <MenuItem onClick={onMostrarOfertas}>Ofertas</MenuItem>
                                <MenuItem onClick={onMostrarEventos}>Eventos</MenuItem>
                            </>
                        )}
                    </Menu>
                </Hidden>
                {isLoggedIn && (
                    <IconButton
                        aria-controls="user-menu"
                        aria-haspopup="true"
                        onClick={handleUserMenuOpen}
                        sx={styles.rightIconButton}
                    >
                        <PersonIcon />
                    </IconButton>
                )}
                <Menu
                    id="user-menu"
                    anchorEl={userMenuAnchorEl}
                    open={Boolean(userMenuAnchorEl)}
                    onClose={handleUserMenuClose}
                >
                    <MenuItem onClick={onMostrarPerfil}>Perfil</MenuItem>
                    <MenuItem onClick={performLogout}>Cerrar Sesión</MenuItem>
                </Menu>
            </Toolbar>
            <div className="header-margin" style={styles.appBarMargin}></div>
        </AppBar>
    );
};

export default Header;
