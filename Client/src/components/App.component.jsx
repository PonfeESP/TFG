import React from 'react';
import { CssBaseline, Paper } from '@mui/material';
import { Header } from './Header.component';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';
import { teal, pink, red } from '@mui/material/colors'; // Cambiamos el color principal a teal y el secundario a pink
import { useNavigate } from 'react-router-dom';


import { Home } from '../pages/Home/Home.page';
import { Admin } from '../pages/Admin/Admin.page';
import { Desempleado } from '../pages/Desempleado/Desempleado.page';
import { Empresa } from '../pages/Empresa/Empresa.page';


import Logo from '../Imagenes/LogoTransparente.png';
import Fondo from '../Imagenes/fondo.png';

const App = () => {
    // Preferencia por el modo oscuro
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)'); // Leer el modo del sistema

    // Tema personalizado con color principal naranja
    const theme = React.useMemo(() => createTheme({
        palette: {
            primary: {
                main: red[500], // Cambiamos el color principal a teal
            },
            secondary: {
                main: pink[500], // Cambiamos el color secundario a pink
            },
        },
        typography: {
            fontFamily: 'Roboto, sans-serif', // Cambiamos la fuente a Roboto
        },
    }));

    //CSS por el momento aqui

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    };

    const paperStyle = {
        padding: '20px',
        textAlign: 'center',
        backgroundColor: 'transparent',
        height: '100%',
    };

    const backgroundStyle = {
        backgroundImage: `url(${Fondo})`,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    };


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Header />
                <div style={backgroundStyle}></div>
                <div style={containerStyle}>
                    <Paper style={paperStyle}>
                        <img src={Logo} alt="Logo" />
                        <Routes>
                            <Route exact path="/" element={<Home />} />
                            <Route path="/admin" element={<Admin />} />
                            <Route path="/desempleado" element={<Desempleado />} />
                            <Route path="/empresa" element={<Empresa />} />
                        </Routes>
                    </Paper>
                </div>
            </Router>
        </ThemeProvider>);
}
export default App;
