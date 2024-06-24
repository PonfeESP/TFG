import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { axiosConfig } from '../../constant/axiosConfig.constant';
import Header from '../../components/Header2.component';
import Logo from '../../Imagenes/LogoTransparente.png';
import Desempleado from '../../Imagenes/Desempleado.png';
import Empresa from '../../Imagenes/Empresa.png';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const headerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 1000,
};

const paperStyle = {
  padding: '20px',
  minHeight: '50px',
  backgroundColor: '#333',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: '20px',
  marginRight: '20px',
  marginBottom: '20px',
};

const paperStyle2 = {
  padding: '20px',
  minHeight: '50px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: '20px',
  marginRight: '20px',
  marginBottom: '20px',
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '20px',
  width: '100%',
  marginTop: '50px',
  flexWrap: 'wrap',
};

const paperStyle3 = {
  flex: '1',
  padding: '20px',
  minHeight: '50px',
  backgroundColor: '#333',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  marginLeft: '10px',
  marginRight: '10px'
};

const paperStyle4 = {
  flex: '1',
  padding: '20px',
  minHeight: '50px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  marginLeft: '10px',
  marginRight: '10px'
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const Home = () => {
  const [userData, setUserData] = useState({});
  const [userType, setUserType] = useState('');
  const [finishLoading, setFinishLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios({
      ...axiosConfig,
      url: 'http://localhost:8000/user',
      method: 'GET'
    })
      .then(res => {
        setUserData(res.data);
        if (res.data && res.data.userType) {
          // Verificar el userType permitido
          const allowedUserTypes = ['Desempleado', 'Empresa', 'Admin'];
          if (allowedUserTypes.includes(res.data.userType)) {
            setFinishLoading(false);
          } else {
            setFinishLoading(true);
            setShowSnackbar(true);
          }
        } else {
          setFinishLoading(true);
        }
      })
      .catch(err => {
        console.log(err);
        setFinishLoading(true);
        setShowSnackbar(true);
      });
  }, [navigate]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    !!finishLoading ?
      <>
        <Header style={headerStyle} />
        <div style={{ marginTop: '50px' }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Paper style={paperStyle}>
                <Typography variant="h5">¿Por qué usar ITJobFinder?</Typography>
                <Typography variant="body1">En el competitivo mercado laboral actual, encontrar la oportunidad perfecta puede ser un desafío. Las aplicaciones de búsqueda de empleo pueden ser una herramienta valiosa para agilizar su búsqueda y aumentar sus posibilidades de conseguir el trabajo de sus sueños. Éstos son algunos de los beneficios clave</Typography>
              </Paper>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Paper style={paperStyle2}>
                <Typography component="ul">
                  <ArrowRightIcon style={{ marginRight: '5px' }} /> Búsqueda de empleo más amplia: acceda a una gama más amplia de ofertas de trabajo de diversas empresas y subsectores de informática.</Typography>
                <Typography component="ul">
                  <ArrowRightIcon style={{ marginRight: '5px' }} /> Filtros de búsqueda específicos: utilice filtros para refinar su búsqueda según habilidades específicas, experiencia.</Typography>
                <Typography component="ul">
                  <ArrowRightIcon style={{ marginRight: '5px' }} /> Investigación de empresas: obtenga más información sobre posibles empleadores a través de perfiles.</Typography>
                <Typography component="ul">
                  <ArrowRightIcon style={{ marginRight: '5px' }} /> Proceso de solicitud simplificado: solicite empleo directamente a través de la aplicación, a menudo con sistemas simplificados.</Typography>
              </Paper>
            </motion.div>
            <motion.div variants={itemVariants} style={containerStyle}>
              <Paper style={paperStyle3}>
                <Typography variant="h5">Usuario</Typography>
                <Typography variant="body1">
                  En esta aplicación, cada usuario podrá gestionar su propio perfil de manera eficiente y personalizada. Desde la comodidad de tu dispositivo, tendrás la capacidad de configurar y actualizar tu información profesional de manera fácil, rápida y directa.</Typography>
                <Typography variant="body1">
                  Con esta herramienta, podrás destacar tus habilidades, experiencia laboral y logros relevantes para captar la atención de potenciales empleadores. Además, podrás explorar una amplia gama de oportunidades laborales específicas a tu campo de especialización.</Typography>
              </Paper>
              <Paper style={paperStyle3}>
                <Typography variant="h5">Empresa</Typography>
                <Typography variant="body1">
                  En esta aplicación, cada empresa podrá gestionar su propio perfil de manera eficiente y personalizada. Desde la comodidad de tu dispositivo, tendrás la capacidad de configurar y actualizar tu información de manera fácil, rápida y directa.</Typography>
                <Typography variant="body1">
                  Con esta herramienta, podrás destacar tus requisitos laborales y lo que buscas en un empleado, para facilitar el contacto con aquel individuo que más se ajuste a tus peticiones. Podrás gestionar ofertas y eventos y comprobar quiénes están interesados en todo momento.</Typography>
              </Paper>
            </motion.div>
            <motion.div variants={itemVariants} style={containerStyle}>
              <Paper style={paperStyle4}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px' }}>
                  <img src={Desempleado} alt="Logo" style={{ width: '40%' }} />
                </div>
              </Paper>
              <Paper style={paperStyle4}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px' }}>
                  <img src={Empresa} alt="Logo" style={{ width: '40%' }} />
                </div>
              </Paper>
            </motion.div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px' }}>
              <img src={Logo} alt="Logo" style={{ width: '40%' }} />
            </div>
          </motion.div>
        </div>
      </>
      :
      <Snackbar
        open={!finishLoading}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => !!userData ? navigate('/usuario') : navigate('/')}>
        <Alert severity="error">No tienes permiso para acceder a esta página</Alert></Snackbar>
  );
};

export default Home;
