import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, Alert, Snackbar } from '@mui/material';
import { PaginaAdmin } from './Componentes/PaginaAdmin';
import { PaginaTags } from './Componentes/PaginaTags';
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
  const [mostrarTags, setMostrarTags] = useState(false); // Nuevo estado
  const [mostrarEmpresas, setMostrarEmpresas] = useState(true); // Nuevo estado

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
      .catch(err => console.log(err));
  }, []);

  return (
    !!finishLoading ? (
      <div>
        <Header
          onMostrarEmpresas={() => {
            setMostrarEmpresas(true);
            setMostrarTags(false);
          }}
          onMostrarTags={() => {
            setMostrarEmpresas(false);
            setMostrarTags(true);
          }}
        />
        <div>
          {mostrarEmpresas ? <PaginaAdmin /> : <PaginaTags />}
        </div>
      </div>
    ) : (
      <Snackbar
        open={!finishLoading}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => !!userData ? userData.userType === 'empresa' ? navigate('/empresa') : userData.userType === 'desempleado' ? navigate('/desempleado') : navigate('/') : navigate('/')}
      >
        <Alert severity="error">No tienes permiso para acceder a esta página</Alert>
      </Snackbar>
    )
  );
};
