import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, Button, Alert, Snackbar } from '@mui/material';
import { axiosConfig } from '../../constant/axiosConfig.constant';

import { PaginaOfertaUnica } from './Componentes/PaginaOfertaUnica';


export const OfertaUnica = () => {
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

  const performLogout = (event) => {
    event.preventDefault();
    setLogoutError('');

    if (!!userData) {
      axios({
        ...axiosConfig,
        url: 'http://localhost:8000/logout',
        method: 'POST'

      }).then((response) => {
        if (response.data.status === 'Ok')
          navigate('/'); // Navega a la página de Inicio
        else
          setLogoutError(response.data.error);
      })
      .catch((error) => {
        console.log('Error en el cierre de sesión');
        setLogoutError('Error en el Cierre de Sesión. Inténtelo más tarde.');
      })
    }
  };

  return (
    <div>
      <Paper>
        <Typography variant="h4" color="primary">DESEMPLEADO</Typography>
        <Button onClick={e => performLogout(e)}>CERRAR SESION</Button>
        {!!logoutError && <Typography>{logoutError}</Typography>}
      </Paper>
            
      <PaginaOfertaUnica />
    </div>
  );
};
