// Importaciones de React
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importación de Axios
import axios from 'axios';

// Importaciones de Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
//import { Typography } from '@mui/material'; COMPROBAR RECOGIDA DE TIPO DE USUARIO

// Importaciones de ICONS
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';


export const Login = () => {
    // Control de Inicio Sesión
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userError, setUserError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [registroError, setRegistroError] = useState('');

    // Control de Redirecciones
    const navigate = useNavigate();

    // Control del Dialog
    const [open, setOpen] = useState(false);

    const performLogin = (event) => {
        event.preventDefault();

        setUserError(false);
        setPasswordError(false);
        setRegistroError('');

        if (email === '') setUserError(true);
        if (password === '') setPasswordError(true);

        if (!!email && !!password) {
            axios({
                url: 'http://localhost:8000/login/usuario',
                method: 'POST',
                withCredentials: true,
                data: {
                    Email: email,
                    Contraseña: password,
                },
            })
                .then((response) => {
                    if (response.data.status === 'OK') {
                        const tipoUsuario = response.data.Rol;
                        console.log('log:', response.data);
                        if (tipoUsuario === 'Admin') {
                        navigate('/admin');
                        } else if (tipoUsuario === 'Desempleado') {
                            navigate('/desempleado');
                        } else if (tipoUsuario === 'Empresa') {
                            navigate('/empresa');
                        } else {
                            setRegistroError('Fallo al reconocer el tipo de usuario');
                        }
                    } else {
                        setRegistroError('Error en el inicio de sesión');
                    }
                })
                .catch((error) => {
                    console.log('Error en el inicio de sesión:', error);
                    setRegistroError('Error en el inicio de sesión. Inténtalo de nuevo, por favor.');
                });
        }
        else {
            setRegistroError('Todos los campos son OBLIGATORIOS. Inténtalo de nuevo, por favor.');
        }
    };

    // Abrir Dialog
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Cerrar Dialog
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button onClick={handleClickOpen}>Iniciar sesión</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Iniciar sesión</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        margin="dense"
                        id="email"
                        label="Correo"
                        type={"email"}
                        fullWidth
                        variant="standard"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        margin="dense"
                        id="password"
                        label="Contraseña"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                    <Box
                        noValidate
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'fit-content',
                        }}
                    >
                    </Box>


                    {registroError && <p>{registroError}</p>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>CANCELAR</Button>
                    <Button onClick={performLogin}>INICIAR SESIÓN</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};