import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, Snackbar, Alert } from '@mui/material'; 
import { PaginaDesempleado } from './Componentes/PaginaDesempleado';
import { PaginaDesempleadoOrdenada } from './Componentes/PaginaDesempleadoOrdenada';
import { PaginaDesempleadoEmpresa } from './Componentes/PaginaDesempleadoEmpresa';
import { PaginaDesempleadoEvento } from './Componentes/PaginaDesempleadoEvento';
import { PaginaDesempleadoModificacion } from './Componentes/PaginaDesempleadoModificacion';
import { axiosConfig } from '../../constant/axiosConfig.constant';
import Header from '../../components/Header.component';

export const Desempleado = () => {
  const [logoutError, setLogoutError] = useState('');
  const [userData, setUserData] = useState({});
  const [finishLoading, setFinishLoading] = useState(null);
  const [mostrarOrdenada, setMostrarOrdenada] = useState(false);
  const [mostrarEmpresa, setMostrarEmpresa] = useState(false);
  const [mostrarEvento, setMostrarEvento] = useState(false); 
  const [mostrarModificacion, setMostrarModificacion] = useState(false); 

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

  return (
    !!finishLoading ?
      <>
        <div style={{ position: 'relative' }}>
          <Header 
            onMostrarOrdenada={() => {
              setMostrarOrdenada(true);
              setMostrarEmpresa(false);
              setMostrarEvento(false);
              setMostrarModificacion(false);
            }}
            onMostrar={() => {
              setMostrarOrdenada(false);
              setMostrarEmpresa(false);
              setMostrarEvento(false);
              setMostrarModificacion(false);
            }}
            onMostrarEmpresa={() => {
              setMostrarOrdenada(false);
              setMostrarEmpresa(true);
              setMostrarEvento(false);
              setMostrarModificacion(false);
            }}
            onMostrarEvento={() => {
              setMostrarOrdenada(false);
              setMostrarEmpresa(false);
              setMostrarEvento(true);
              setMostrarModificacion(false);
            }}
            onModificarUsuario={() => {
              setMostrarOrdenada(false);
              setMostrarEmpresa(false);
              setMostrarEvento(false);
              setMostrarModificacion(true);
            }}
          />
        </div>
        <div style={{ marginTop: '70px', padding: '20px' }}>
          <Paper>
            <Typography variant="h4" color="primary">DESEMPLEADO</Typography>
            {mostrarOrdenada ? <PaginaDesempleadoOrdenada /> : mostrarEmpresa ? <PaginaDesempleadoEmpresa /> : mostrarEvento ? <PaginaDesempleadoEvento /> : mostrarModificacion ? <PaginaDesempleadoModificacion userId={userData.id}/> : <PaginaDesempleado />}
          </Paper>
        </div>
      </> :
      <Snackbar
        open={!finishLoading}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => !!userData ? userData.userType === 'Empresa' ? navigate('/empresa') : userData.userType === 'Admin' ? navigate('/admin') : navigate('/') : navigate('/')}>
        <Alert severity="error">No tienes permiso para acceder a esta página</Alert>
      </Snackbar>
  );
};

export default Desempleado;
