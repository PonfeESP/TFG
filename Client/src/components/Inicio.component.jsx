import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosConfig } from '../constant/axiosConfig.constant';
import { Typography, Grid, Button } from '@mui/material';
import oferta from '../Imagenes/ofertas.jpg';
import empresa from '../Imagenes/empresas.jpg';
import evento from '../Imagenes/eventos.jpg';

const Inicio = ({ userId, userType }) => {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await axios({
                    ...axiosConfig,
                    url: `http://localhost:8000/usuarios/${userId}`,
                    method: 'GET'
                });
                setUserName(response.data.Nombre);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserName();
    }, [userId]);

    if (loading) {
        return <Typography>Cargando...</Typography>;
    }


    return (
        <div>
            <Typography variant="h4" textAlign={'center'} marginBottom={'20px'} marginTop={'20px'}>¡Bienvenido de nuevo {userName}!</Typography>

            {/* Sección de Ofertas */}
            {userType === 'Desempleado' && (
                <div style={{ textAlign: 'center' }}>
                    <Grid container spacing={2} marginTop={'10px'}>
                        <Grid item xs={12} md={6}>
                            <div>
                                <Typography variant="subtitle1">¡Descubre las oportunidades que te esperan en nuestra plataforma de búsqueda de empleo! Desde puestos de trabajo a tiempo completo hasta opciones flexibles de medio tiempo, tenemos una amplia variedad de roles disponibles en una variedad de industrias. Ya sea que estés buscando dar el próximo paso en tu carrera o explorar nuevas oportunidades, estamos aquí para ayudarte a encontrar el trabajo perfecto que se ajuste a tus habilidades y aspiraciones. Únete a nosotros y comienza tu viaje hacia el éxito profesional hoy mismo.
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6} style={{ backgroundImage: `url(${oferta})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px' }}>
                        </Grid>
                    </Grid>
                </div>
            )}


            {userType === 'Desempleado' && (
                <div style={{ textAlign: 'center' }}>
                    <Grid container spacing={2} marginTop={'10px'}>
                        <Grid item xs={12} md={6} style={{ backgroundImage: `url(${empresa})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px' }}>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div>
                                <Typography variant="subtitle1">¡Únete a las empresas líderes que están transformando el panorama laboral! Desde startups innovadoras hasta corporaciones multinacionales, nuestra plataforma te conecta con empleadores que valoran el talento y están comprometidos con el crecimiento profesional de sus empleados. Descubre las empresas que están haciendo una diferencia en sus industrias, explora sus culturas corporativas y encuentra el lugar perfecto para dar forma a tu carrera. Con oportunidades de crecimiento, beneficios competitivos y un ambiente de trabajo estimulante, estas empresas te ofrecen el escenario ideal para alcanzar tus metas profesionales.</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            )}

            {userType === 'Desempleado' && (
                <div style={{ textAlign: 'center' }}>
                    <Grid container spacing={2} marginTop={'10px'}>
                        <Grid item xs={12} md={6}>
                            <div>
                                <Typography variant="subtitle1">¡No te pierdas los eventos exclusivos diseñados para impulsar tu carrera! Desde ferias de empleo hasta talleres de desarrollo profesional, nuestra plataforma te mantiene al tanto de todas las oportunidades para expandir tu red y mejorar tus habilidades. Conéctate con líderes de la industria, aprende de expertos y descubre nuevas tendencias en el mundo laboral. Ya sea que estés buscando inspiración, consejos de carrera o simplemente hacer conexiones significativas, nuestros eventos te brindarán la ventaja que necesitas para destacar en tu campo.
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6} style={{ backgroundImage: `url(${evento})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px' }}>
                        </Grid>
                    </Grid>
                </div>
            )}
            {userType === 'Empresa' && (
                <div style={{ textAlign: 'center' }}>
                    <Grid container spacing={2} marginTop={'10px'}>
                        <Grid item xs={12} md={6}>
                            <div>
                                <Typography variant="subtitle1">¡Encuentra el talento que necesitas en nuestra plataforma de búsqueda de empleo! Ofrecemos una solución eficiente y efectiva para conectar a las empresas con candidatos calificados en una variedad de industrias. Ya sea que estés buscando cubrir puestos a tiempo completo, medio tiempo o proyectos flexibles, nuestra plataforma te proporciona acceso a una amplia base de datos de profesionales talentosos y motivados.
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6} style={{ backgroundImage: `url(${oferta})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px' }}>
                        </Grid>
                    </Grid>
                </div>
            )}


            {userType === 'Empresa' && (
                <div style={{ textAlign: 'center' }}>
                    <Grid container spacing={2} marginTop={'10px'}>
                        <Grid item xs={12} md={6} style={{ backgroundImage: `url(${empresa})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px' }}>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div>
                                <Typography variant="subtitle1">Facilitamos el proceso de contratación con herramientas avanzadas de filtrado y evaluación, asegurando que encuentres el candidato ideal que se ajuste a tus necesidades y objetivos empresariales. Únete a nosotros y optimiza tu proceso de selección para encontrar el talento perfecto que impulsará el éxito de tu empresa.</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            )}

            {userType === 'Empresa' && (
                <div style={{ textAlign: 'center' }}>
                    <Grid container spacing={2} marginTop={'10px'}>
                        <Grid item xs={12} md={6}>
                            <div>
                                <Typography variant="subtitle1">¡Organiza eventos exitosos con nuestra plataforma de gestión de eventos! Ofrecemos una solución integral para planificar, promover y ejecutar eventos de cualquier tamaño y tipo. Desde conferencias a seminarios, nuestra plataforma está diseñada para ayudarte a gestionar todos los aspectos de tu evento de manera eficiente y efectiva. Puedes manejar inscripciones, coordinar la logística y analizar el aforo del evento en tiempo real. Nuestra interfaz intuitiva y amigable te permitirá ahorrar tiempo y reducir el estrés asociado con la organización de eventos.
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6} style={{ backgroundImage: `url(${evento})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px' }}>
                        </Grid>
                    </Grid>
                </div>
            )}
        </div>
    );
};

export default Inicio;
