import React, { useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header2.component';
import Logo from '../../Imagenes/LogoTransparente.png';
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
  minHeight: '500px',
  height: '100%',
  backgroundColor: '#333',
  color: 'white',
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '100px',
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

  const lines = [
    '<span style="color: purple;">if</span>( !<span style="color: green;">user.isRegistered </span> ) <span style="color: blue;">{</span>',
    '  <span style="color: yellow;">console.log </span>("Bienvenido a ITJobFinder");',
    '  <span style="color: yellow;">console.log </span>("ITJobFinder es una aplicación web de búsqueda de empleo desarrollada por y para ingenieros informáticos.");',
    '  <span style="color: yellow;">console.log </span>("Contamos con la colaboración de múltiples empresas que ofrecen oportunidades laborales en el sector tecnológico.");',
    '  <span style="color: yellow;">console.log </span>("Regístrate para descubrir oportunidades laborales y conectar con empresas innovadoras.");',
    '<span style="color: blue;">}</span>'
  ];

  return (
    <>
      <Header style={headerStyle} />
      <div style={containerStyle}>
        <img src={Logo} alt="Logo" />
      </div>
      <div>
        <Paper style={paperStyle}>
          <Typography component="div">
            {lines.map((line, index) => (
              <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
            ))}
          </Typography>
        </Paper>
      </div>
    </>
  );
};

export default Home;
