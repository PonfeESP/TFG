import React, { useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header.component';
import Logo from '../../Imagenes/LogoTransparente.png';
import Fond from '../../Imagenes/fond.jpg';
import { axiosConfig } from '../../constant/axiosConfig.constant';

const headerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 1000,
};

const paperStyle = {
  padding: '20px',
  minHeight: '500px', // Altura mínima de cada sección
  height: '100%', // El papel ocupa toda la altura de su contenedor
  backgroundColor: '#333', // Fondo negro
  color: 'white', // Texto blanco
};


const paperStyle2 = {
  padding: '20px',
  minHeight: '500px', // Altura mínima de cada sección
  height: '100%', // El papel ocupa toda la altura de su contenedor
};

const paperStyle3 = {
  padding: '20px',
  minHeight: '500px', // Altura mínima de cada sección
  height: '100%', // El papel ocupa toda la altura de su contenedor
};

export const Home = () => {
  const [userData, setUserData] = useState({});
  const [finishLoading, setFinishLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ITJobFinder";
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
    <>
      <Header style={headerStyle} />
      <img src={Logo} alt="Logo" />
      <div >
          <Paper style={paperStyle}>
            <Typography>Bienvenido a ITJobFinder</Typography> 
            <Typography>ITJobFinder es una aplicacion web de busqueda de empleo desarrollada por y para ingenieros informaticos</Typography> 
            <Typography>Contamos con la colaboracion de multiples empresas</Typography> 
          </Paper>
          <Paper style={paperStyle2}>
            {/* Contenido de la segunda sección */}
          </Paper>
          <Paper style={paperStyle3}>
            {/* Contenido de la tercera sección */}
          </Paper>
        </div>
    </>
  );
};

export default Home;
