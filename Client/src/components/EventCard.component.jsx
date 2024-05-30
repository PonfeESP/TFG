import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { axiosConfig } from '../constant/axiosConfig.constant';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Tooltip, Menu, MenuItem, Paper, Box, Avatar, Stack, Button, Card,
  CardHeader, CardContent, CardActions, Collapse, Typography, IconButton
} from '@mui/material';
import dayjs from 'dayjs';
import { red, green, blue } from '@mui/material/colors';

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

const getRandomColor = () => {
  const colors = [red[500], green[500], blue[500]];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function EventCard({ event, userId, userType }) {
  const [expanded, setExpanded] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInterested, setIsInterested] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [aforoActual, setAforoActual] = useState();

  const avatarColor = getRandomColor();

  useEffect(() => {
    setIsInterested(event.Interesados?.includes(userId) || false);
  }, [event.Interesados, userId]);

  useEffect(() => {
    setAforoActual(event.Aforo - event.Interesados.length);
    console.log("aforo", event.Aforo - event.Interesados.length)
  }, [event.Aforo, event.Interesados]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/evento/${event._id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Enlace copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar el enlace: ', err);
    });
  };

  const handleInterest = () => {
    axios({
      ...axiosConfig,
      url: 'http://localhost:8000/solicitud_evento',
      method: 'PUT',
      data: {
        userId: userId,
        eventId: event._id
      }
    })
      .then(res => {
        console.log('Solicitud enviada con éxito');
        setIsRegistered(true);
        setIsInterested(true);
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
    axios({
      ...axiosConfig,
      url: `http://localhost:8000/solicitud_evento/${event._id}`,
      method: 'DELETE',
      data: {
        userId: userId,
      }
    })
      .then(res => {
        console.log('Usuario eliminado de la lista de interesados con éxito');
        setIsRegistered(false);
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
    setAnchorEl(event.currentTarget); // Fix here: use event.currentTarget instead of props.currentTarget
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (userType === 'Empresa') {
    return (
      <Card sx={{ maxWidth: 750 }}>
        <CardHeader
          avatar={
            <Avatar aria-label="business" sx={{ bgcolor: avatarColor }}>
              {`${event.Nombre.charAt(0).toUpperCase()}`}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          }
          title={event.Nombre}
          subheader={`Fecha: ${dayjs(event.Fecha).format("DD/MM/YYYY")}, Aforo: ${event.Aforo}, Localización: ${event.Localizacion}, Publicada el ${dayjs(event.Fecha_Creacion).format("DD/MM/YYYY")}`}
        />
        <Menu
          id="menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <Link to={`/evento/${event._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button variant="text" sx={{ width: '100%' }}>
                Explorar
              </Button>
            </Link>
          </MenuItem>
        </Menu>
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
            <Typography paragraph>{event.Descripcion}</Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
  if (userType === 'Desempleado') {
    return (
      <Card sx={{ maxWidth: 750 }}>
        <CardHeader
          avatar={
            <Avatar aria-label="business" sx={{ bgcolor: avatarColor }}>
              {`${event.Nombre.charAt(0).toUpperCase()}`}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          }
          title={event.Nombre}
          subheader={`Fecha: ${dayjs(event.Fecha).format("DD/MM/YYYY")}, Aforo: ${aforoActual}, Localización: ${event.Localizacion}, Publicada el ${dayjs(event.Fecha_Creacion).format("DD/MM/YYYY")} por ${event.Empresa.Nombre}`}
        />
        <Menu
          id="menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <Link to={`/evento/${event._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button variant="text" sx={{ width: '100%' }}>
                Explorar
              </Button>
            </Link>
          </MenuItem>
        </Menu>
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
            <Button variant="contained" onClick={handleInterest} disabled={aforoActual === 0}>
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
            <Typography paragraph>{event.Descripcion}</Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}
