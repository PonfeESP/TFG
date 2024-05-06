import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, Snackbar, Alert } from '@mui/material';
import Header from '../../components/Header.component';

import PaginaDesempleado from './Componentes/PaginaDesempleado';
import PaginaDesempleadoOfertasInteres from './Componentes/PaginaDesempleadoOfertasInteres';
import PaginaDesempleadoHome from './Componentes/PaginaDesempleadoHome';
import PaginaDesempleadoOrdenada from './Componentes/PaginaDesempleadoOrdenada';
import PaginaDesempleadoEmpresa from './Componentes/PaginaDesempleadoEmpresa';
import PaginaDesempleadoEvento from './Componentes/PaginaDesempleadoEvento';
import PaginaDesempleadoEventoInteres from './Componentes/PaginaDesempleadoEventoInteres';
import PaginaDesempleadoModificacion from './Componentes/PaginaDesempleadoModificacion';
import PaginaDesempleadoEmpresaUnica from './Componentes/PaginaDesempleadoEmpresaUnica';


import { axiosConfig } from '../../constant/axiosConfig.constant';

export const Desempleado = () => {
  const [logoutError, setLogoutError] = useState('');
  const [userData, setUserData] = useState({});
  const [finishLoading, setFinishLoading] = useState(null);
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
            onMostrarOrdenada={() => navigate('/desempleado/ordenada')}
            onMostrar={() => navigate('/desempleado/ofertas')}
            onMostrarOfertas={() => navigate('/desempleado/ofertas_Interesado')}
            onMostrarEmpresa={() => navigate('/desempleado/empresas')}
            onMostrarEvento={() => navigate('/desempleado/eventos')}
            onMostrarInteresado={() => navigate('/desempleado/eventos_Interesado')}
            onModificarUsuario={() => navigate('/desempleado/modificacion')} 
/>
        </div>
        <div style={{ marginTop: '70px', padding: '20px' }}>
          <Paper>
            <Typography variant="h4" color="primary">DESEMPLEADO</Typography>
            <Routes>
              <Route path="/" element={<PaginaDesempleadoHome userId={userData.id}/>} />
              <Route path="/ofertas" element={<PaginaDesempleado userId={userData.id}/>} />
              <Route path="/ofertas_Interesado" element={<PaginaDesempleadoOfertasInteres userId={userData.id}/>} />
              <Route path="/ordenada" element={<PaginaDesempleadoOrdenada userId={userData.id}/>} />
              <Route path="/empresas" element={<PaginaDesempleadoEmpresa />} />
              <Route path="/empresas/:idEmpresa" element={<PaginaDesempleadoEmpresaUnica />} />
              <Route path="/eventos" element={<PaginaDesempleadoEvento userId={userData.id}/>} />
              <Route path="/eventos_Interesado" element={<PaginaDesempleadoEventoInteres userId={userData.id}/>} />
              <Route path="/modificacion" element={<PaginaDesempleadoModificacion userId={userData.id}/>} />
            </Routes>
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