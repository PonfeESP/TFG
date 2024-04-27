import React, { useState } from 'react';
import { CssBaseline, Paper } from '@mui/material';
import { Header } from './Header.component';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';
import { teal, pink, red } from '@mui/material/colors'; // Cambiamos el color principal a teal y el secundario a pink
import { useNavigate } from 'react-router-dom';


import { Home } from '../pages/Home/Home.page';
import { Admin } from '../pages/Admin/Admin.page';
import { Desempleado } from '../pages/Desempleado/Desempleado.page';
import { Empresa } from '../pages/Empresa/Empresa.page';
import { OfertaUnica } from '../pages/Oferta/OfertaUnica.page';
import { EventoUnico } from '../pages/Evento/EventoUnico.page';



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
        backgroundSize: 'cover', // or 'contain' based on your preference
        backgroundRepeat: 'no-repeat',
        zIndex: -1,
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
            <div style={backgroundStyle}></div>
                <div>
                    <Paper style={paperStyle}>
                        <Routes>
                            <Route exact path="/" element={<Home />} />
                            <Route path="/admin" element={<Admin />} />
                            <Route path="/desempleado" element={<Desempleado />} />
                            <Route path="/empresa" element={<Empresa />} />
                            <Route path="/oferta/:idOferta" element={<OfertaUnica />} />
                            <Route path="/evento/:idEvento" element={<EventoUnico />} />
                        </Routes>
                    </Paper>
                </div>
            </Router>
        </ThemeProvider>);
}
export default App;
