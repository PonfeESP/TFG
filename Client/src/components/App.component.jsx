import React, { useState } from 'react';
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
import { OfertaUnica } from '../pages/Oferta/OfertaUnica.page';
import { EventoUnico } from '../pages/Evento/EventoUnico.page';
import { PaginaDesempleadoOfertasInteres } from '../pages/Desempleado/Componentes/PaginaDesempleadoOfertasInteres';
import { PaginaDesempleadoOrdenada } from '../pages/Desempleado/Componentes/PaginaDesempleadoOrdenada';
import { PaginaDesempleadoEmpresa } from '../pages/Desempleado/Componentes/PaginaDesempleadoEmpresa';
import { PaginaDesempleadoEvento } from '../pages/Desempleado/Componentes/PaginaDesempleadoEvento';
import { PaginaDesempleadoEventoInteres } from '../pages/Desempleado/Componentes/PaginaDesempleadoEventoInteres';
import { PaginaDesempleadoModificacion } from '../pages/Desempleado/Componentes/PaginaDesempleadoModificacion';
import { PaginaDesempleadoEmpresaUnica } from '../pages/Desempleado/Componentes/PaginaDesempleadoEmpresaUnica';
import { PaginaEmpresaUsuario } from '../pages/Empresa/Componentes/PaginaEmpresaUsuario';
import { PaginaEmpresaUsuarioUnico } from '../pages/Empresa/Componentes/PaginaEmpresaUsuarioUnico';
import { PaginaEmpresaEvento } from '../pages/Empresa/Componentes/PaginaEmpresaEvento';
import { PaginaEmpresaModificacion } from '../pages/Empresa/Componentes/PaginaEmpresaModificacion';



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
            <CssBaseline />
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/desempleado" element={<Desempleado />}>
                        <Route path="ofertas" element={<PaginaDesempleadoOrdenada />} />
                        <Route path="ofertas_Interesado" element={<PaginaDesempleadoOfertasInteres />} />
                        <Route path="ordenada" element={<PaginaDesempleadoOrdenada />} />
                        <Route path="empresas" element={<PaginaDesempleadoEmpresa />} />
                        <Route path="empresas/:idEmpresa" element={<PaginaDesempleadoEmpresaUnica />} />
                        <Route path="eventos" element={<PaginaDesempleadoEvento />} />
                        <Route path="eventos_Interesado" element={<PaginaDesempleadoEventoInteres />} />
                        <Route path="modificacion" element={<PaginaDesempleadoModificacion />} />
                    </Route>
                    <Route path="/empresa" element={<Empresa />} >
                        <Route path="usuarios" element={<PaginaEmpresaUsuario />} />
                        <Route path="usuarios/:idUsuario" element={<PaginaEmpresaUsuarioUnico />} />
                        <Route path="eventos" element={<PaginaEmpresaEvento />} />
                        <Route path="modificacion" element={<PaginaEmpresaModificacion />} />
                    </Route>
                    <Route path="/oferta/:idOferta" element={<OfertaUnica />} />
                    <Route path="/evento/:idEvento" element={<EventoUnico />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
