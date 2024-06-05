import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#4caf50', // Cambia el color principal
        },
        secondary: {
            main: '#dc004e', // Cambia el color secundario
        },
        background: {
            default: '#f5f5f5',
            paper: '#fff',
        },
        grey: {
            300: '#e0e0e0',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    color: '#000', // Cambia el color del texto del botón
                    backgroundColor: '#047E32', // Cambia el color de fondo del botón
                    '&:hover': {
                        backgroundColor: '#bbb', // Cambia el color de fondo del botón al pasar el ratón
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#ccc', // Cambia el color del borde del campo de texto
                        },
                        '&:hover fieldset': {
                            borderColor: '#bbb', // Cambia el color del borde al pasar el ratón sobre el campo
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#4caf50', // Cambia el color del borde cuando el campo está enfocado
                        },
                    },
                    '& .MuiInputBase-root': {
                        color: '#FFFFFF', // Cambia el color del texto de los campos de texto
                    },
                    '& .MuiOutlinedInput-input': {
                        height: '35%',
                        backgroundColor: '#818181', // Cambia el color de fondo del campo de texto
                        '&:focus': {
                            backgroundColor: '#A6C0B4', // Cambia el color de fondo cuando el campo está enfocado
                        },
                    },
                    '& .MuiInputLabel-outlined': {
                        color: '#FFFFFF', // Cambia el color de la etiqueta del campo de texto
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ccc', // Cambia el color del borde de los campos de texto
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#bbb', // Cambia el color del borde de los campos de texto al pasar el ratón
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4caf50', // Cambia el borde a verde cuando está enfocado
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        color: '#FFFFFF', // Cambia el color del texto de los campos de texto
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FFFFFF', // Cambia el color del borde de los campos de texto
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#047E32', // Cambia el color del borde de los campos de texto al pasar el ratón
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4caf50', // Cambia el borde a verde cuando está enfocado
                        borderWidth: '2px', // Cambia el ancho del borde a 2px
                    },
                },
            },
        },MuiFormControl: {
            styleOverrides: {
                root: {
                    height: '100%',
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    height: '100%',
                },
            },
        },
    },
    typography: {
        h5: {
            fontWeight: 600,
        },
    },
});

export default theme;
