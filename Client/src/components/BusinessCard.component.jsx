import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { axiosConfig } from '../constant/axiosConfig.constant';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem, Button, Card, CardHeader, CardContent, CardActions, Collapse, Avatar, IconButton, Typography } from '@mui/material';
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

export default function BusinessCard({ business, userId }) {
  const [expanded, setExpanded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const avatarColor = getRandomColor();


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/empresa/${business._id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Enlace copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar el enlace: ', err);
    });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  console.log("aaa", business.FotoPerfil)

  return (
    <Card sx={{ maxWidth: 750, minHeigh: 200}}>
      <CardHeader
        avatar={
          business.FotoPerfil ? (
            <Avatar aria-label="business" src={`http://localhost:8000/profileImages/${business.FotoPerfil}` } />
          ) : (
            <Avatar aria-label="business" sx={{ bgcolor: avatarColor }}>
              {`${business.Nombre.charAt(0).toUpperCase()}`}
            </Avatar>
          )
        }
        action={
          <IconButton aria-label="settings" onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        }
        title={business.Nombre}
      />
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <Link to={`/empresa/${business._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
          <Typography paragraph>{business.Descripcion}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
