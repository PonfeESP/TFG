import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, Snackbar, Alert } from '@mui/material'; 
import { PaginaOfertaDesempleado } from './Componentes/PaginaOfertaDesempleado';
import { PaginaOfertaEmpresa } from './Componentes/PaginaOfertaEmpresa'; // Importa la página de oferta para empresas
import { axiosConfig } from '../../constant/axiosConfig.constant';
import Header from '../../components/Header.component';


export const OfertaUnica = () => {
  const [logoutError, setLogoutError] = useState('');
  const [userData, setUserData] = useState({});
  const [finishLoading, setFinishLoading] = useState(null);
  const [mostrarUsuario, setMostrarUsuario] = useState(false);
  const [mostrarEvento, setMostrarEvento] = useState(false); 
  const [mostrarModificacion, setMostrarModificacion] = useState(false); 
  const [mostrarOfertas, setMostrarOfertas] = useState(false);
  const [mostrarOrdenada, setMostrarOrdenada] = useState(false);
  const [mostrarEmpresa, setMostrarEmpresa] = useState(false);
  const [onMostrarInteresado, setMostrarInteresado] = useState(false);

  

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Oferta Única";
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
              navigate('/desempleado/ordenada'); // Navega a la ruta '/empresa'
              setMostrarOrdenada(true);
              setMostrarEmpresa(false);
              setMostrarEvento(false);
              setMostrarModificacion(false);
              setMostrarInteresado(false);
            }}
            onMostrar={() => {
              navigate('/desempleado/ofertas'); // Navega a la ruta '/empresa'
              setMostrarOrdenada(false);
              setMostrarEmpresa(false);
              setMostrarEvento(false);
              setMostrarModificacion(false);
              setMostrarInteresado(false);
            }}
            onMostrarEmpresa={() => {
              navigate('/desempleado/empresas'); // Navega a la ruta '/empresa'
              setMostrarOrdenada(false);
              setMostrarEmpresa(true);
              setMostrarEvento(false);
              setMostrarModificacion(false);
              setMostrarInteresado(false);
            }}
            onMostrarEvento={() => {
              navigate('/desempleado/eventos'); // Navega a la ruta '/empresa'
              setMostrarOrdenada(false);
              setMostrarEmpresa(false);
              setMostrarEvento(true);
              setMostrarModificacion(false);
              setMostrarInteresado(false);
            }}
            onModificarUsuario={() => {
              navigate('/desempleado/modificacion'); // Navega a la ruta '/empresa'
              setMostrarOrdenada(false);
              setMostrarEmpresa(false);
              setMostrarEvento(false);
              setMostrarModificacion(true);
              setMostrarInteresado(false);
            }}
            onMostrarOfertas={() => {
              navigate('/desempleado/ofertas_Interesado'); // Navega a la ruta '/empresa'
              setMostrarOrdenada(false);
              setMostrarEmpresa(false);
              setMostrarEvento(false);
              setMostrarModificacion(false);
              setMostrarInteresado(true);
            }}
            onMostrarInteresado={() => {
              navigate('/desempleado/eventos_Interesado'); // Navega a la ruta '/empresa'
              setMostrarOrdenada(false);
              setMostrarEmpresa(false);
              setMostrarEvento(false);
              setMostrarModificacion(false);
              setMostrarInteresado(true);
            }}/>
          </div>
          <div style={{ marginTop: '70px', padding: '20px' }}>
            <Paper>
             <PaginaOfertaDesempleado />
            </Paper>
          </div>
        </>
      ) : userData.userType === 'Empresa' ? (
        <>
          <div style={{ position: 'relative' }}>
            <Header onMostrarUsuario={() => {
              navigate('/empresa/usuarios'); 
              setMostrarUsuario(true);
              setMostrarOfertas(false);
              setMostrarEvento(false);
              setMostrarModificacion(false);
            }}
              onMostrarOfertas={() => {
                navigate('/empresa'); 
                setMostrarUsuario(false);
                setMostrarOfertas(true);
                setMostrarEvento(false);
                setMostrarModificacion(false);
              }}
              onMostrarEvento={() => {
                navigate('/empresa/eventos'); 
                setMostrarUsuario(false);
                setMostrarOfertas(false);
                setMostrarEvento(true);
                setMostrarModificacion(false);
              }}
              onModificarUsuario={() => {
                navigate('/empresa/modificacion'); 
                setMostrarUsuario(false);
                setMostrarOfertas(false);
                setMostrarEvento(false);
                setMostrarModificacion(true);
              }} />
          </div>
          <div style={{ marginTop: '70px', padding: '20px' }}>
            <Paper>
              <PaginaOfertaEmpresa/>
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

export default OfertaUnica;
