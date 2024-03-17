import {useEffect} from 'react';
import * as React from 'react';
import {AppBar, Paper, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem} from '@mui/material';

export const Empresa = () => {
    useEffect(() => {
      document.title = "No has iniciado sesión";
    }, []);
    return (
        <Paper>
            <Typography>No has iniciado sesión</Typography>

        </Paper>
    );
  };