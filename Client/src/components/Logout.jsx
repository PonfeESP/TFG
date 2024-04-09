import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        axios({
            url: 'http://localhost:8000/logout',
            method: 'POST'
        })
        .then((response) => {
            if (response.data.status === 'Ok') {
                navigate('/');
            } else {
                console.error('Error en el cierre de sesión:', response.data.error);
            }
        })
        .catch((error) => {
            console.error('Error en el cierre de sesión:', error);
        });
    };

    return (
        <Button color="inherit" onClick={handleLogout}>
            Cerrar Sesión
        </Button>
    );
};

export default Logout;
