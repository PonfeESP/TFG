import React, { useState } from 'react';
import { CssBaseline, Paper } from '@mui/material';
import { Header } from './Header.component';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';
import { teal, pink, red } from '@mui/material/colors'; // Cambiamos el color principal a teal y el secundario a pink
import { useNavigate } from 'react-router-dom';


import { Home } from '../pages/Home/Home.page';
import { Usuario } from '../pages/Usuario/Usuario.Page';
import { Oferta } from '../pages/Ofertas/Oferta.page';
import { Empresa } from '../pages/Usuario/Componentes/ComponentesDesempleado/SubComponenteEmpresa/Empresa.componente';
import { User } from '../pages/Usuario/Componentes/ComponentesEmpresa/SubComponenteUsuario/Usuario.componente';
import { Evento } from '../pages/Eventos/Evento.Page';



import Fondo from '../Imagenes/fondo.png';

const App = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(() => createTheme({
        palette: {
            primary: {
                main: "rgb(0, 0, 0)", // RGB format
            },
        },
        typography: {
            fontFamily: 'Roboto, sans-serif',
        },
        
    }));

    const backgroundStyle = {
        backgroundImage: `url(${Fondo})`,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundSize: 'cover', // or 'contain' based on your preference
        backgroundRepeat: 'no-repeat',
        zIndex: -1,
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/usuario" element={<Usuario />} />
                    <Route path="/empresa/:idEmpresa" element={<Empresa />} />
                    <Route path="/usuario/:idUsuario" element={<User />} />
                    <Route path="/oferta/:idOferta" element={<Oferta />} />
                    <Route path="/evento/:idEvento" element={<Evento />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
