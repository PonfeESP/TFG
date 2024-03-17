import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const NavigateButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/admin');
    };

    return (
        <Button variant="contained" onClick={handleClick}>
            Go to Admin
        </Button>
    );
};

export default NavigateButton;
