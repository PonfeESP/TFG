import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, Button, Alert, Snackbar } from '@mui/material';
import { PaginaDesempleado } from './Componentes/PaginaDesempleado';
import { PaginaDesempleadoOrdenada } from './Componentes/PaginaDesempleadoOrdenada';
import { axiosConfig } from '../../constant/axiosConfig.constant';

export const Desempleado = () => {
  const [logoutError, setLogoutError] = useState();
  const [userData, setUserData] = useState({});
  const [finishLoading, setFinishLoading] = useState(null);
  const [mostrarOrdenada, setMostrarOrdenada] = useState(false); // Nuevo estado para controlar la visualización de la página ordenada

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "DESEMPLEADO";
    axios({
      ...axiosConfig,
      url: 'http://localhost:8000/user',
      method: 'GET'
    })
      .then(res => {
        setUserData(res.data);
        setFinishLoading(!!res.data && !!res.data.userType && res.data.userType === 'Desempleado');
      })
      .catch(err => console.log(err))
  }, []);

  const handleToggleMostrarOrdenada = () => {
    setMostrarOrdenada(prevState => !prevState); // Cambiar el estado para mostrar u ocultar la página ordenada
  };

  return (
    !!finishLoading ?
      <div>
        <Paper>
          <Typography variant="h4" color="primary">DESEMPLEADO</Typography>
          <Button onClick={handleToggleMostrarOrdenada}>Mostrar Ordenada</Button> {/* Botón para mostrar u ocultar la página ordenada */}
          {!!logoutError && <Typography>{logoutError}</Typography>}
        </Paper>

        {mostrarOrdenada ? <PaginaDesempleadoOrdenada /> : <PaginaDesempleado />} {/* Mostrar la página correspondiente según el estado de mostrarOrdenada */}

      </div> :
      <Snackbar
        open={!finishLoading}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => !!userData ? userData.userType === 'empresa' ? navigate('/empresa') : userData.userType === 'desempleado' ? navigate('/desempleado') : navigate('/') : navigate('/')}>
        <Alert severity="error">No tienes permiso para acceder a esta página</Alert></Snackbar>
  );
};
