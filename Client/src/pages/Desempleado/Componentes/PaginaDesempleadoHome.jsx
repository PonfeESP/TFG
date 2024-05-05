import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography } from '@mui/material';
import { axiosConfig } from '../../../constant/axiosConfig.constant';
import PaginaDesempleadoOrdenada from './PaginaDesempleadoOrdenada'; // Importa el componente

const paperStyle = {
    padding: '20px',
    minHeight: '500px', // Altura mínima de cada sección
    height: '100%', // El papel ocupa toda la altura de su contenedor
    backgroundColor: 'white', // Fondo negro
    color: 'white', // Texto blanco
};

export const PaginaDesempleadoHome = ({ userId }) => {
    const [ofertas, setOfertas] = useState([]);

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/ofertas',
            method: 'GET'
        })
            .then(res => {
                setOfertas(res.data);
            })
            .catch(err => console.log(err))
    }, []);

    // Función para obtener las 5 ofertas con mayor puntuación
    const getTopFiveOfertas = () => {
        return ofertas.slice(0, 3); // Obtener solo las primeras 5 ofertas
    }

    return (
        <div>
            <Paper style={paperStyle}>
                <PaginaDesempleadoOrdenada userId={userId} maxOfertas={3} /> {/* Renderiza el componente con las 5 ofertas */}
            </Paper>
            <Paper style={{...paperStyle, backgroundColor: '#393'}}>
                {/* Contenido de la segunda sección */}
            </Paper>
            <Paper style={{...paperStyle, backgroundColor: '#933'}}>
                {/* Contenido de la tercera sección */}
            </Paper>
        </div>
    );
}

export default PaginaDesempleadoHome;