// Filename - Header.js

import * as React from "react";

// importing material UI components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Paper } from '@mui/material';

import { Login } from './Login';
import { Register } from './Register';

const styles = {
    paper: {
      margin: '0 10px', // Adjust the margin as needed
    },
  };

export const Header = () => {
    return (
        <AppBar position="static">
            <Toolbar>

                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                >
                    ITJobFinder
                </Typography>
                <Paper sx={styles.paper}>
                    <Register />
                </Paper>
                <Paper sx={styles.paper}>
                    <Login />
                </Paper>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
