// Importaciones de React
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importaciones de Material UI
import { Paper, Alert, Snackbar, Typography } from '@mui/material';

// Importación de Axios
import axios from 'axios';


import { axiosConfig } from '../../constant/axiosConfig.constant';

//CSS

const body1 = {
  height: '100vh',
  width: '70%',
  margin: '0 auto',
  overflowX: 'hidden', 
  fontSize: '21px',
  textAlign: 'center',
  position: 'center'

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

    <div style={body1}>
      Bienvenido a ITJobFinder<br />
      ¿En qué nos especializamos?<br />
      Te presentamos una aplicación interactiva desarrollada por y para ingenieros del software, habilitando una serie de tags que te permitirán describir tu experiencia y ayudarte a encontrar oportunidades de trabajo que se adecuen a tus preferencias.
    </div>

  );

};