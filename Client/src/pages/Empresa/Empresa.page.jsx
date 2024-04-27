import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, Snackbar, Alert } from '@mui/material'; 
import { PaginaEmpresa } from './Componentes/PaginaEmpresa';
import { PaginaEmpresaModificacion } from './Componentes/PaginaEmpresaModificacion';
import { PaginaEmpresaUsuario } from './Componentes/PaginaEmpresaUsuario';
import { PaginaEmpresaEvento } from './Componentes/PaginaEmpresaEvento';
import { axiosConfig } from '../../constant/axiosConfig.constant';
import Header from '../../components/Header.component';

export const Empresa = () => {
  const [logoutError, setLogoutError] = useState('');
  const [userData, setUserData] = useState({});
  const [finishLoading, setFinishLoading] = useState(null);
  const [mostrarUsuario, setMostrarUsuario] = useState(false);
  const [mostrarEvento, setMostrarEvento] = useState(false); 
  const [mostrarModificacion, setMostrarModificacion] = useState(false); 
  const [mostrarOfertas, setMostrarOfertas] = useState(false); 

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "EMPRESA";
    axios({
      ...axiosConfig,
      url: 'http://localhost:8000/user',
      method: 'GET'
    })
      .then(res => {
        setUserData(res.data);
        setFinishLoading(!!res.data && !!res.data.userType && res.data.userType === 'Empresa');
      })
      .catch(err => console.log(err))
  }, []);

  return (
    !!finishLoading ?
      <>
        <div style={{ position: 'relative' }}>
          <Header 
            onMostrarUsuario={() => {
              setMostrarUsuario(true);
              setMostrarOfertas(false);
              setMostrarEvento(false);
              setMostrarModificacion(false);
            }}
            onMostrar={() => {
              setMostrarUsuario(false);
              setMostrarOfertas(false);
              setMostrarEvento(false);
              setMostrarModificacion(false);
            }}
            onMostrarOfertas={() => {
              setMostrarUsuario(false);
              setMostrarOfertas(true);
              setMostrarEvento(false);
              setMostrarModificacion(false);
            }}
            onMostrarEvento={() => {
              setMostrarUsuario(false);
              setMostrarOfertas(false);
              setMostrarEvento(true);
              setMostrarModificacion(false);
            }}
            onModificarUsuario={() => {
              setMostrarUsuario(false);
              setMostrarOfertas(false);
              setMostrarEvento(false);
              setMostrarModificacion(true);
            }}
          />
        </div>
        <div style={{ marginTop: '70px', padding: '20px' }}>
          <Paper>
            <Typography variant="h4" color="primary">EMPRESA</Typography>
            {mostrarEvento ? <PaginaEmpresaEvento userId={userData.id}/> : mostrarModificacion ? <PaginaEmpresaModificacion userId={userData.id}/> : mostrarUsuario ? <PaginaEmpresaUsuario/> : <PaginaEmpresa userId={userData.id}/>}
          </Paper>
        </div>
      </> :
      <Snackbar
        open={!finishLoading}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => !!userData ? userData.userType === 'Desempleado' ? navigate('/desempleado') : userData.userType === 'Admin' ? navigate('/admin') : navigate('/') : navigate('/')}>
        <Alert severity="error">No tienes permiso para acceder a esta página</Alert>
      </Snackbar>
  );
};

export default Empresa;