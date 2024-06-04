import React from 'react';
import { Paper, Typography } from '@mui/material';
import Header from '../../components/Header2.component';
import Logo from '../../Imagenes/LogoTransparente.png';

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
  marginRight: '20px'
};

const paperStyle2 = {
  padding: '20px',
  minHeight: '50px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: '20px',
  marginRight: '20px'
};

export const Home = () => {
  return (
    <>
      <Header style={headerStyle} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px' }}>
        <img src={Logo} alt="Logo" />
      </div>
      <div style={{ marginTop: '50px' }}>
        <Paper style={paperStyle}>
          <Typography variant="h5">¿Por que usar ITJobFinder?</Typography>
        </Paper>
        <Paper style={paperStyle2}>
          <Typography variant="body1">
            En el competitivo mercado laboral actual, encontrar la oportunidad perfecta puede ser un desafío. Las aplicaciones de búsqueda de empleo pueden ser una herramienta valiosa para agilizar su búsqueda y aumentar sus posibilidades de conseguir el trabajo de sus sueños. Éstos son algunos de los beneficios clave:
          </Typography>
          <Typography>
            <ul>
              <li>Búsqueda de empleo más amplia: acceda a una gama más amplia de ofertas de trabajo de diversas empresas y subsectores de informatica.</li>
              <li>Filtros de búsqueda específicos: utilice filtros para refinar su búsqueda según habilidades específicas, experiencia.</li>
              <li>Investigación de empresas: obtenga más información sobre posibles empleadores a través de perfiles</li>
              <li>Proceso de solicitud simplificado: solicite empleo directamente a través de la aplicación, a menudo con sistemas simplificados.</li>
            </ul>
          </Typography>
        </Paper >
      </div >
    </>
  );
};

export default Home;

