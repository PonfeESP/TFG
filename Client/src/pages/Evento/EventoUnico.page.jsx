import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, Snackbar, Alert } from '@mui/material';
import { PaginaEventoDesempleado } from './Componentes/PaginaEventoDesempleado';
import { PaginaEventoEmpresa } from './Componentes/PaginaEventoEmpresa'; // Importa la página de Evento para empresas
import { axiosConfig } from '../../constant/axiosConfig.constant';
import Header from '../../components/Header.component';

import { PaginaEmpresa } from '../Empresa/Componentes/PaginaEmpresa';
import { PaginaEmpresaModificacion } from '../Empresa/Componentes/PaginaEmpresaModificacion';
import { PaginaEmpresaUsuario } from '../Empresa/Componentes/PaginaEmpresaUsuario';
import { PaginaEmpresaEvento } from '../Empresa/Componentes/PaginaEmpresaEvento';
import { PaginaDesempleado } from '../Desempleado/Componentes/PaginaDesempleado';
import { PaginaDesempleadoOrdenada } from '../Desempleado/Componentes/PaginaDesempleadoOrdenada';
import { PaginaDesempleadoEmpresa } from '../Desempleado/Componentes/PaginaDesempleadoEmpresa';
import { PaginaDesempleadoEvento } from '../Desempleado/Componentes/PaginaDesempleadoEvento';
import { PaginaDesempleadoModificacion } from '../Desempleado/Componentes/PaginaDesempleadoModificacion';

export const EventoUnico = () => {
  const [logoutError, setLogoutError] = useState('');
  const [userData, setUserData] = useState({});
  const [finishLoading, setFinishLoading] = useState(null);
  const [mostrarUsuario, setMostrarUsuario] = useState(false);
  const [mostrarEvento, setMostrarEvento] = useState(false); 
  const [mostrarModificacion, setMostrarModificacion] = useState(false); 
  const [mostrarOfertas, setMostrarOfertas] = useState(false); 
  const [mostrarOrdenada, setMostrarOrdenada] = useState(false);
  const [mostrarEmpresa, setMostrarEmpresa] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Evento Única";
    axios({
      ...axiosConfig,
      url: 'http://localhost:8000/user',
      method: 'GET'
    })
      .then(res => {
        setUserData(res.data);
        setFinishLoading(!!res.data && !!res.data.userType);
      })
      .catch(err => console.log(err))
  }, []);

  return (
    finishLoading ? (
      userData.userType === 'Desempleado' ? (
        <>
          <div style={{ position: 'relative' }}>
            <Header onMostrarOrdenada={() => {
              navigate('/desempleado'); // Navega a la ruta '/empresa'
              setMostrarOrdenada(true);
              setMostrarEmpresa(false);
              setMostrarEvento(false);
              setMostrarModificacion(false);
            }}
            onMostrar={() => {
              navigate('/desempleado'); // Navega a la ruta '/empresa'
              setMostrarOrdenada(false);
              setMostrarEmpresa(false);
              setMostrarEvento(false);
              setMostrarModificacion(false);
            }}
            onMostrarEmpresa={() => {
              navigate('/desempleado'); // Navega a la ruta '/empresa'
              setMostrarOrdenada(false);
              setMostrarEmpresa(true);
              setMostrarEvento(false);
              setMostrarModificacion(false);
            }}
            onMostrarEvento={() => {
              navigate('/desempleado'); // Navega a la ruta '/empresa'
              setMostrarOrdenada(false);
              setMostrarEmpresa(false);
              setMostrarEvento(true);
              setMostrarModificacion(false);
            }}
            onModificarUsuario={() => {
              navigate('/desempleado'); // Navega a la ruta '/empresa'
              setMostrarOrdenada(false);
              setMostrarEmpresa(false);
              setMostrarEvento(false);
              setMostrarModificacion(true);
            }}/>
          </div>
          <div style={{ marginTop: '70px', padding: '20px' }}>
            <Paper>
              <Typography variant="h4" color="primary">DESEMPLEADO</Typography>
              {mostrarOrdenada ? <PaginaDesempleadoOrdenada /> : mostrarEmpresa ? <PaginaDesempleadoEmpresa /> : mostrarEvento ? <PaginaDesempleadoEvento /> : mostrarModificacion ? <PaginaDesempleadoModificacion userId={userData.id}/> : <PaginaEventoDesempleado />}
            </Paper>
          </div>
        </>
      ) : userData.userType === 'Empresa' ? (
        <>
          <div style={{ position: 'relative' }}>
            <Header onMostrarUsuario={() => {
              setMostrarUsuario(true);
              setMostrarOfertas(false);
              setMostrarEvento(false);
              setMostrarModificacion(false);
              navigate('/empresa'); // Navega a la ruta '/empresa'
            }}
              onMostrar={() => {
                setMostrarUsuario(false);
                setMostrarOfertas(false);
                setMostrarEvento(false);
                setMostrarModificacion(false);
                navigate('/empresa'); // Navega a la ruta '/empresa'
              }}
              onMostrarOfertas={() => {
                setMostrarUsuario(false);
                setMostrarOfertas(true);
                setMostrarEvento(false);
                setMostrarModificacion(false);
                navigate('/empresa'); // Navega a la ruta '/empresa'
              }}
              onMostrarEvento={() => {
                setMostrarUsuario(false);
                setMostrarOfertas(false);
                setMostrarEvento(true);
                setMostrarModificacion(false);
                navigate('/empresa'); // Navega a la ruta '/empresa'
              }}
              onModificarUsuario={() => {
                setMostrarUsuario(false);
                setMostrarOfertas(false);
                setMostrarEvento(false);
                setMostrarModificacion(true);
                navigate('/empresa'); // Navega a la ruta '/empresa'
              }} />
          </div>
          <div style={{ marginTop: '70px', padding: '20px' }}>
            <Paper>
              <Typography variant="h4" color="primary">EMPRESA</Typography>
              {mostrarEvento ? <PaginaEmpresaEvento userId={userData.id}/> : mostrarModificacion ? <PaginaEmpresaModificacion userId={userData.id}/> : mostrarUsuario ? <PaginaEmpresaUsuario/> : <PaginaEventoEmpresa/>}
            </Paper>
          </div>
        </>
      ) : (
        <Snackbar
          open={true}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={() => navigate('/')}>
          <Alert severity="error">No tienes permiso para acceder a esta página</Alert>
        </Snackbar>
      )
    ) : null
  );
};

export default EventoUnico;
