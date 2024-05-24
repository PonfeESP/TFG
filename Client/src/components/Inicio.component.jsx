import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosConfig } from '../constant/axiosConfig.constant';
import { Typography } from '@mui/material';

const Inicio = ({ userId }) => {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await axios({
                    ...axiosConfig,
                    url: `http://localhost:8000/usuarios/${userId}`,
                    method: 'GET'
                });
                setUserName(response.data.Nombre);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserName();
    }, [userId]);

    if (loading) {
        return <Typography>Cargando...</Typography>;
    }

    return (
        <div>
            <Typography variant="h4">¡Bienvenido, {userName}!</Typography>
            <Typography variant="body1">Estás en la página de inicio.</Typography>
        </div>
    );
};

export default Inicio;
