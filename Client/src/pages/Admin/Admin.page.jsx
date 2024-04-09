// Importaciones de React
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importación de Axios
import axios from 'axios';

// Importaciones de Material UI
import { Paper, Typography, Button, Alert, Snackbar } from '@mui/material';
// Importaciones de Componentes
import { PaginaAdmin } from './Componentes/PaginaAdmin';
import Header from '../../components/Header.component';

import { axiosConfig } from '../../constant/axiosConfig.constant';

const headerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%'
};

export const Admin = () => {
  const [logoutError, setLogoutError] = useState();
  const [userData, setUserData] = useState({});
  const [finishLoading, setFinishLoading] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {

    document.title = "ADMINISTRADOR";
    axios({
      ...axiosConfig,
      url: 'http://localhost:8000/user',
      method: 'GET'
    })
      .then(res => {
        setUserData(res.data);
        setFinishLoading(!!res.data && !!res.data.userType && res.data.userType === 'Admin');
      })
      .catch(err => console.log(err))
  }, []);

  return (
    !!finishLoading ?
    <><div>
    <Header style={headerStyle} />
    <div>
      <PaginaAdmin />
    </div>
    </div>
    </> :       
      <Snackbar
      open={!finishLoading}
      autoHideDuration={2000}
      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      onClose={() => !!userData ? userData.userType === 'empresa' ? navigate('/empresa') : userData.userType === 'desempleado' ? navigate('/desempleado') : navigate('/') : navigate('/')}>
      <Alert severity="error">No tienes permiso para acceder a esta página</Alert></Snackbar>
  );
};