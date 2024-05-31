import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { axiosConfig } from '../constant/axiosConfig.constant';
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Tooltip, Menu, MenuItem, Paper, Box, CircularProgress, LinearProgress, Stack, Badge, Chip, Button, Card, CardHeader, CardContent, CardActions, Collapse, Avatar, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { blueGrey } from '@mui/material/colors';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function OfferCard({ props, userId, userType }) {
  const [expanded, setExpanded] = useState(false);
  const [isRegistrado, setIsRegistrado] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInterested, setIsInterested] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // Add anchorEl state


  const color = blueGrey[200];

  useEffect(() => {
    // Verificar si el userId está presente en el array Interesados de la oferta
    setIsInterested(props.Interesados.includes(userId));
  }, [props.Interesados, userId]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleShare = () => {
    const oferta = props;
    const shareUrl = `${window.location.origin}/oferta/${oferta._id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Enlace copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar el enlace: ', err);
    });
  };

  const handleInterest = () => {
    const oferta = props;
    const idOferta = oferta._id;
    axios({
      ...axiosConfig,
      url: 'http://localhost:8000/solicitud_oferta',
      method: 'PUT',
      data: {
        userId: userId,
        ofertaId: idOferta
      }
    })
      .then(res => {
        console.log('Solicitud enviada con éxito');
        setIsRegistrado(true);
        setIsInterested(true); // Actualizar el estado para reflejar el interés del usuario
      })
      .catch(err => {
        console.log(err);
        if (err.response && err.response.status === 400) {
          setErrorMessage(err.response.data.error);
        } else {
          setErrorMessage('Error al enviar la solicitud. Por favor, inténtelo de nuevo.');
        }
      });
  };

  const handleDisinterest = () => {
    const oferta = props;
    const idOferta = oferta._id;
    axios({
      ...axiosConfig,
      url: `http://localhost:8000/solicitud_oferta/${idOferta}`,
      method: 'DELETE',
      data: {
        userId: userId,
      }
    })
      .then(res => {
        console.log('Usuario eliminado de la lista de interesados con éxito');
        setIsRegistrado(false);
        setIsInterested(false); // Actualizar el estado para reflejar el desinterés del usuario
      })
      .catch(err => {
        console.error(err);
        if (err.response && err.response.status === 400) {
          setErrorMessage(err.response.data.error);
        } else {
          setErrorMessage('Error al enviar la solicitud. Por favor, inténtelo de nuevo.');
        }
      });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const oferta = props;
  let affinityPercentage = Number(oferta.PorcentajeConcordancia);

  if (isNaN(affinityPercentage)) affinityPercentage = 0;

  return (
    <>
      {userType === 'Desempleado' && (
        <Card sx={{ maxWidth: 750 }}>
          <CardHeader
            avatar={
              <Paper elevation={10} sx={{ position: 'relative', display: 'inline-flex', borderRadius: 50, backgroundColor: color }}>
                <CircularProgress size="3rem" color="success" thickness={5} variant="determinate" value={affinityPercentage} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="text-body2" component="div" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                    {`${Math.round(affinityPercentage)}%`}
                  </Typography>
                </Box>
              </Paper>
            }
            action={
              <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
            }
            title={oferta.Nombre}
            subheader={`Publicada el ${dayjs(oferta["Fecha_Creacion"]).format("DD/MM/YYYY")} por ${oferta.Empresa.Nombre}`}
          />
          <Menu
            id="menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Link to={`/oferta/${oferta._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Button variant="text" sx={{ width: '100%' }}>
                  Explorar
                </Button>
              </Link>
            </MenuItem>
          </Menu>
          <CardContent>
            <Stack direction="row" spacing={1}>
              {oferta.Tags.map((tag, index) => (
                <Chip key={`${tag.Lenguaje}-${oferta._id}-${index}`} label={`${tag.Lenguaje}: ${tag.Puntuacion}`} color="primary" variant="outlined" sx={{ margin: 7 }} />
              ))}
            </Stack>
          </CardContent>
          <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button variant="text" onClick={handleShare}>
              <ShareIcon sx={{ mr: 1 }} />
              Compartir
            </Button>
            {isInterested ? (
              <Button variant="contained" onClick={handleDisinterest}>
                <FavoriteIcon sx={{ mr: 1 }} />
                No me interesa
              </Button>
            ) : (
              <Button variant="contained" onClick={handleInterest}>
                <FavoriteIcon sx={{ mr: 1 }} />
                Me interesa
              </Button>
            )}

            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>{oferta.Descripcion}</Typography>
            </CardContent>
          </Collapse>
        </Card>
      )}

      {userType === 'Empresa' && (
        <Card sx={{ maxWidth: 750 }}>
          <CardHeader
            avatar={
              <Avatar aria-label="oferta" sx={{ bgcolor: red[500] }}>
                {props.Nombre.charAt(0)}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
            }
            title={props.Nombre}
            subheader={`Publicada el ${dayjs(props["Fecha_Creacion"]).format("DD/MM/YYYY")} por ${props.Empresa.Nombre}`}
          />
          <Menu
            id="menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Link to={`/oferta/${oferta._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Button variant="text" sx={{ width: '100%' }}>
                  Explorar
                </Button>
              </Link>
            </MenuItem>
          </Menu>
          <CardContent>
            <Stack direction="row" spacing={1}>
              {oferta.Tags.map(tag => (
                <Chip key={tag.Lenguaje} label={`${tag.Lenguaje}: ${tag.Puntuacion}`} color="primary" variant="outlined" sx={{ margin: 7 }} />
              ))}
            </Stack>
          </CardContent>
          <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button variant="text" onClick={handleShare}>
              <ShareIcon sx={{ mr: 1 }} />
              Compartir
            </Button>

            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>{oferta.Descripcion}</Typography>
            </CardContent>
          </Collapse>
        </Card>
      )}
    </>
  );
}
