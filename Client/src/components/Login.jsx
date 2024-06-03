import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for HTTP requests
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import theme from './Theme.js'
import { ThemeProvider } from '@mui/material/styles';
import Fondo from '../Imagenes/HeaderDefinitivo2.jpg';


export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [registroError, setRegistroError] = useState('');

    const navigate = useNavigate();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    };

    const validacionEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleEmailChange = (e) => {
        const newValue = e.target.value;
        setEmail(newValue);
        if (!validacionEmail(newValue)) {
            setRegistroError('Please enter a valid email address.');
        } else {
            setRegistroError('');
        }
    };

    const performLogin = (event) => {
        event.preventDefault();

        setError('');
        setRegistroError('');

        if (!email || !password) {
            setRegistroError('Todos los campos son OBLIGATORIOS. Inténtalo de nuevo.');
            return;
        } else if (!validacionEmail(email)) {
            setRegistroError('El email introducido no es valido');
            return;
        }

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
                    navigate('/usuario');
                } else {
                    setRegistroError('Error en el inicio de sesión');
                }
            })
            .catch((error) => {
                console.log('Error en el inicio de sesión:', error);
                setRegistroError('Error en el inicio de sesión. Inténtalo de nuevo, por favor.');
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <Button onClick={handleOpen}>Iniciar sesión</Button>
            <Dialog open={open} onClose={handleClose}>
                <Box
                    sx={{
                        backgroundImage: `url(${Fondo})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '90px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography variant="h5" color="white">
                        ITJobFinder
                    </Typography>
                </Box>
                <DialogContent sx={{ backgroundColor: '#302c2c', width: '100%'}}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: theme.spacing(1) }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Correo electrónico"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            sx={{ height: '50px' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div >
                        {registroError && (
                            <Typography variant="body2" color="error">
                                {registroError}
                            </Typography>
                        )}
                        </div>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Recuérdame"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: theme.spacing(3), mb: theme.spacing(2) }}
                            onClick={performLogin}
                        >
                            Iniciar sesión
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    );
};

export default Login;
