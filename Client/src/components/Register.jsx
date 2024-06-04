import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Stack, Snackbar, Typography, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { useNavigate } from 'react-router-dom';
import { axiosConfig } from '../constant/axiosConfig.constant';
import Fondo from '../Imagenes/HeaderDefinitivo2.jpg';
import theme from './Theme.js'
import { ThemeProvider } from '@mui/material/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [rol, setRol] = useState('Desempleado');
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [edad, setEdad] = useState("");
    const [experiencia_Laboral, setExperienciaLaboral] = useState("");
    const [estudios, setEstudios] = useState("");
    const [tags, setTags] = useState([]);
    const [tagsExperience, setTagsExperience] = useState({});
    const [userError, setUserError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [nombreError, setNombreError] = useState(false);
    const [descripcionError, setDescripcionError] = useState(false);
    const [edadError, setEdadError] = useState(false);
    const [experienciaError, setExperienciaError] = useState(false);
    const [estudiosError, setEstudiosError] = useState(false);
    const [tagsError, setTagsError] = useState(false);
    const [registroError, setRegistroError] = useState("");
    const [open, setOpen] = useState(false);
    const [programmingLanguages, setProgrammingLanguages] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [registroErrorMessage, setRegistroErrorMessage] = useState("");
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [registrationFailure, setRegistrationFailure] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState({ failure: false, success: false });
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        edad: "",
        experiencia_Laboral: "",
        estudios: "",
        tags: [],
        tagsExperience: {},
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [formErrors, setFormErrors] = useState({
        nombreError: false,
        descripcionError: false,
        edadError: false,
        experienciaError: false,
        estudiosError: false,
        tagsError: false,
        userError: false,
        emailError: false,
        passwordError: false,
        confirmPasswordError: false,
        registroError: ""
    });
    const [duplicateTagError, setDuplicateTagError] = useState(false);



    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/tags',
            method: 'GET'
        })
            .then(res => {
                setProgrammingLanguages(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    const handleNextStep = () => {
        setRegistroErrorMessage("");
        switch (currentStep) {
            case 1:
                if (nombre === '' || descripcion === '' || edad === '' || experiencia_Laboral === '' || estudios === '') {
                    setNombreError(nombre === '');
                    setDescripcionError(descripcion === '');
                    setEdadError(edad === '');
                    setExperienciaError(experiencia_Laboral === '');
                    setEstudiosError(estudios === '');
                    return;
                }
                break;
            case 2:
                if (tags.length === 0) {
                    setTagsError(tags.length === 0);
                    return;
                }
                break;
            default:
                break;
        }
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTagsChange = (event, value) => {
        const uniqueTags = [...new Set(value.map(tag => tag.label))].map(label => {
            return value.find(tag => tag.label === label);
        });
        setTags(uniqueTags);
    };


    const handleExperienceChange = (event, value, tag) => {
        setTagsExperience({ ...tagsExperience, [tag]: value });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const registerEmpresa = () => {
        setUserError(false);
        setEmailError(false);
        setPasswordError(false);
        setRegistroError('');
        setNombreError(false);
        setDescripcionError(false);

        if (email === '') setUserError(true);
        if (password === '') setPasswordError(true);
        if (descripcion === '') setDescripcionError(true);
        if (nombre === '') setNombreError(true);
        setConfirmPasswordError(confirmPassword === '' || confirmPassword !== password);


        if (!!nombre && !!email && !!password && !!descripcion) {
            const userData = {
                Nombre: nombre,
                Email: email,
                Contraseña: password,
                Rol: 'Empresa',
                Descripcion: descripcion
            };

            axios({
                url: 'http://localhost:8000/registro/usuario/empresa',
                method: 'POST',
                withCredentials: true,
                data: userData,
            })
                .then((response) => {
                    console.log('Registro exitoso:', response.data);
                    setRegistrationSuccess(true);
                    setOpen(false);
                    setNombre("");
                    setDescripcion("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setCurrentStep(1);
                })
                .catch((error) => {
                    console.error('Error en el registro:', error);
                    if (error.response && error.response.status === 400 && error.response.data.error === 'Este Email ya está registrado') {
                        setEmailError(true);
                        setRegistroError('El correo electrónico ya está registrado.');
                        setRegistrationFailure(true);
                        setRegistrationStatus({ failure: true, success: true });
                    } else {
                        setRegistroError('Error en el registro. Inténtalo de nuevo, por favor.');
                        setRegistrationFailure(true);
                        setRegistrationStatus({ failure: true, success: false });
                    }
                });
        }
    };

    const registerDesempleado = () => {
        switch (currentStep) {
            case 1:
                if (nombre === '' || descripcion === '' || edad === '' || experiencia_Laboral === '' || estudios === '') {
                    setNombreError(nombre === '');
                    setDescripcionError(descripcion === '');
                    setEdadError(edad === '');
                    setExperienciaError(experiencia_Laboral === '');
                    setEstudiosError(estudios === '');
                    return;
                }
                break;
            case 2:
                if (tags.length === 0) {
                    setTagsError(tags.length === 0);
                    return;
                }
                break;
            case 3:
                if (email === '' || password === '' || confirmPassword === '') {
                    setUserError(email === '');
                    setPasswordError(password === '');
                    setConfirmPasswordError(confirmPassword === '' || confirmPassword !== password);
                    console.log("WHY", confirmPasswordError)
                    return;
                }
                break;
            default:
                break;
        }

        const tagLabels = tags.map(tag => tag.label);
        const hasDuplicates = new Set(tagLabels).size !== tagLabels.length;

        if (hasDuplicates) {
            setDuplicateTagError(true);
            return;
        } else {
            setDuplicateTagError(false);
        }

        if (!!nombre && !!email && !!password && !!confirmPassword && !!descripcion && !!edad && !!experiencia_Laboral && !!estudios && !!tags.length) {
            if (password !== confirmPassword) {
                setConfirmPasswordError(true);
            } else {
                const tagsWithExperience = tags.map(tag => ({
                    Lenguaje: tag.label,
                    Puntuacion: tagsExperience[tag.value] || 0
                }));

                const userData = {
                    Nombre: nombre,
                    Email: email,
                    Contraseña: password,
                    Rol: 'Desempleado',
                    Descripcion: descripcion,
                    Edad: parseInt(edad),
                    Experiencia_Laboral: parseInt(experiencia_Laboral),
                    Estudios: estudios,
                    Tags: tagsWithExperience,
                };

                axios({
                    url: 'http://localhost:8000/registro/usuario/desempleado',
                    method: 'POST',
                    withCredentials: true,
                    data: userData,
                })
                    .then((response) => {
                        console.log('Registro exitoso:', response.data);
                        setRegistrationSuccess(true);
                        setOpen(false);
                        setNombre("");
                        setDescripcion("");
                        setEmail("");
                        setPassword("");
                        setConfirmPassword("");
                        setEdad("");
                        setExperienciaLaboral("");
                        setEstudios("");
                        setTags([]);
                        setTagsExperience({});
                        setCurrentStep(1);
                    })
                    .catch((error) => {
                        console.error('Error en el registro:', error);
                        if (error.response && error.response.status === 400 && error.response.data.error === 'Este Email ya está registrado') {
                            setRegistrationFailure(true);
                            setRegistrationStatus({ failure: true, success: true });
                            setEmailError(true);
                            setRegistroError('El correo electrónico ya está registrado.');
                        } else {
                            setRegistrationFailure(true);
                            setRegistrationStatus({ failure: true, success: false });
                            setRegistroError('Error en el registro. Inténtalo de nuevo, por favor.');
                        }
                    });
            }
        }

    };

    const performRegister = () => {
        if (rol === 'Empresa') {
            registerEmpresa();
        } else if (rol === 'Desempleado') {
            registerDesempleado();
        }
    };

    return (
        <ThemeProvider theme={theme}>

            <Button onClick={handleClickOpen}>Registrarse</Button>
            <Dialog open={open} onClose={handleClose}>
                <Box sx={{ width: '100%', minWidth: '500px', maxWidth: '500px', maxHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                    <Box
                        sx={{
                            backgroundImage: `url(${Fondo})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography variant="h5" color="white">
                            ITJobFinder
                        </Typography>
                    </Box>
                    <DialogContent sx={{ backgroundColor: '#302c2c', width: '100%' }}>

                        <Box
                            noValidate
                            component="form"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                m: 'auto',
                                width: 'fit-content',
                            }}
                        >
                            <FormControl sx={{ mt: 2, minWidth: 120, marginBottom: '15px' }}>
                                <InputLabel htmlFor="user-type" style={{ color: '#FFFFFF' }}>Usuario</InputLabel>
                                <Select
                                    autoFocus
                                    value={rol}
                                    onChange={(e) => setRol(e.target.value)}
                                    label="rol"
                                    inputProps={{
                                        name: 'user-type',
                                        id: 'user-type',
                                    }}
                                    style={{ color: '#FFFFFF' }} // Cambia el color de la letra aquí
                                >
                                    <MenuItem value="Empresa">Empresa</MenuItem>
                                    <MenuItem value="Desempleado">Desempleado</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {rol === 'Empresa' && (
                            <div>
                                <TextField
                                    required
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    margin="dense"
                                    id="nombre"
                                    label="Nombre"
                                    fullWidth
                                    variant="outlined"
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '];
                                        const isLetter = /^[a-zA-Z\s]$/;
                                        if (!isLetter.test(e.key) && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    error={nombreError}
                                    helperText={nombreError && 'Por favor, ingrese un nombre.'}
                                />
                                <TextField
                                    required
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    margin="dense"
                                    id="descripcion"
                                    label="Descripcion de la Empresa"
                                    fullWidth
                                    variant="outlined"
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '];
                                        const isLetter = /^[a-zA-Z]$/;
                                        const isDotOrComma = /^[.,]$/;
                                        if (!isLetter.test(e.key) && !isDotOrComma.test(e.key) && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    error={descripcionError}
                                    helperText={descripcionError && 'Por favor, ingrese una descripción.'}
                                />
                                <TextField
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    margin="dense"
                                    id="email"
                                    label="Correo"
                                    fullWidth
                                    variant="outlined"
                                    error={userError}
                                    helperText={userError && 'Por favor, ingrese un correo válido.'}
                                />
                                <TextField
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    margin="dense"
                                    id="password"
                                    label="Contraseña"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                    error={passwordError}
                                    helperText={passwordError && 'Por favor, ingrese una contraseña.'}
                                />
                                <TextField
                                    required
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    margin="dense"
                                    id="confirm-password"
                                    label="Confirmar Contraseña"
                                    type="password"
                                    fullWidth
                                    variant="outlined"
                                    error={confirmPasswordError}
                                    helperText={confirmPasswordError && 'Las contraseñas no coinciden'}
                                />
                                <DialogActions>
                                    <Button onClick={handleClose}
                                        variant="contained"
                                        sx={{ mt: theme.spacing(3), mb: theme.spacing(2), width: '50%' }}>
                                        CANCELAR
                                    </Button>
                                    <Button
                                        onClick={performRegister}
                                        variant="contained"
                                        sx={{ mt: theme.spacing(3), mb: theme.spacing(2), width: '50%' }}>
                                        REGISTRARSE
                                    </Button>
                                </DialogActions>
                            </div>
                        )}
                        {rol === 'Desempleado' && (
                            <div>
                                {currentStep === 1 && (
                                    <div>
                                        <TextField
                                            required
                                            onChange={(e) => setNombre(e.target.value)}
                                            margin="dense"
                                            id="nombre"
                                            label="Nombre"
                                            fullWidth
                                            variant="outlined"
                                            onKeyDown={(e) => {
                                                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '];
                                                const isLetter = /^[a-zA-Z]$/;
                                                if (!isLetter.test(e.key) && !allowedKeys.includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            error={nombreError}
                                            helperText={nombreError && 'Por favor, ingrese un nombre.'}
                                        />
                                        <TextField
                                            required
                                            onChange={(e) => setDescripcion(e.target.value)}
                                            margin="dense"
                                            id="descripcion"
                                            label="Descripcion"
                                            fullWidth
                                            variant="outlined"
                                            onKeyDown={(e) => {
                                                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '];
                                                const isLetter = /^[a-zA-Z]$/;
                                                const isDotOrComma = /^[.,]$/;
                                                if (!isLetter.test(e.key) && !isDotOrComma.test(e.key) && !allowedKeys.includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            inputProps={{ maxLength: 500 }}
                                            error={descripcionError}
                                            helperText={descripcionError && 'Por favor, ingrese una descripción.'}
                                        />
                                        <TextField
                                            required
                                            onChange={(e) => setEdad(e.target.value)}
                                            margin="dense"
                                            id="edad"
                                            label="Edad"
                                            fullWidth
                                            variant="outlined"
                                            inputProps={{ maxLength: 2 }}
                                            onKeyDown={(e) => {
                                                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                                                const isNumber = /^[0-9]$/;
                                                if (!isNumber.test(e.key) && !allowedKeys.includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            error={edadError}
                                            helperText={edadError && 'Indique su edad, por favor.'}
                                        />
                                        <TextField
                                            required
                                            onChange={(e) => setExperienciaLaboral(e.target.value)}
                                            margin="dense"
                                            id="experienciaLaboral"
                                            label="Años trabajados"
                                            fullWidth
                                            variant="outlined"
                                            onKeyDown={(e) => {
                                                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                                                const isNumber = /^[0-9]$/;
                                                if (!isNumber.test(e.key) && !allowedKeys.includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            inputProps={{ maxLength: 2 }}
                                            error={experienciaError}
                                            helperText={experienciaError && 'Indique su Experiencia Laboral, por favor.'}
                                        />
                                        <TextField
                                            required
                                            onChange={(e) => setEstudios(e.target.value)}
                                            margin="dense"
                                            id="estudios"
                                            label="Estudios"
                                            fullWidth
                                            variant="outlined"
                                            onKeyDown={(e) => {
                                                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '];
                                                const isLetter = /^[a-zA-Z]$/;
                                                const isDotOrComma = /^[.,]$/;
                                                if (!isLetter.test(e.key) && !isDotOrComma.test(e.key) && !allowedKeys.includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            error={estudiosError}
                                            helperText={estudiosError && 'Indique sus Estudios, por favor.'}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>

                                            <Button
                                                onClick={handleNextStep}
                                                variant="contained"
                                                aria-label="Siguiente"
                                                sx={{ mt: theme.spacing(3), mb: theme.spacing(2), width: '20%' }}>
                                                <ArrowForwardIosIcon />
                                            </Button>
                                        </Box>
                                    </div>
                                )}
                                {currentStep === 2 && (
                                    <div style={{ width: '100%' }}>
                                        <Autocomplete
                                            multiple
                                            options={programmingLanguages.map(language => ({ label: language.Nombre, value: language._id }))}
                                            getOptionLabel={option => option.label}
                                            value={tags}
                                            sx={{ width: '100%' }}
                                            onChange={handleTagsChange}
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    variant="standard"
                                                    label="Tags (Programming Languages)"
                                                    placeholder="Select tags"
                                                    fullWidth
                                                    error={tagsError}
                                                    helperText={tagsError && 'Por favor, seleccione al menos un tag.'}
                                                />
                                            )}
                                        />
                                        {tags.map(tag => (
                                            <Box key={tag.value}>
                                                <span>{tag.label}</span>
                                                <Rating
                                                    name={tag.value}
                                                    value={tagsExperience[tag.value] || 0}
                                                    onChange={(event, value) => handleExperienceChange(event, value, tag.value)}
                                                />
                                            </Box>
                                        ))}
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                            <Button
                                                onClick={handlePreviousStep}
                                                variant="contained"
                                                aria-label="Anterior"
                                                sx={{ minWidth: '130px', width: '45%', marginLeft: '15px', marginRight: '15px', marginTop: '10px' }}
                                            >
                                                <ArrowBackIosIcon />
                                            </Button>
                                            <Button
                                                onClick={handleNextStep}
                                                variant="contained"
                                                aria-label="Siguiente"
                                                sx={{ minWidth: '130px', width: '45%', marginLeft: '15px', marginRight: '15px', marginTop: '10px' }}                                            >
                                                <ArrowForwardIosIcon />
                                            </Button>
                                        </Box>
                                    </div>
                                )}
                                {currentStep === 3 && (
                                    <div style={{ width: '100%' }}>
                                        <TextField
                                            required
                                            onChange={(e) => setEmail(e.target.value)}
                                            margin="dense"
                                            id="email"
                                            label="Correo"
                                            fullWidth
                                            variant="outlined"
                                            error={userError}
                                            helperText={userError && 'Por favor, ingrese un correo válido.'}
                                        />
                                        <TextField
                                            required
                                            onChange={(e) => setPassword(e.target.value)}
                                            margin="dense"
                                            id="password"
                                            label="Contraseña"
                                            type="password"
                                            fullWidth
                                            variant="outlined"
                                            error={passwordError}
                                            helperText={passwordError && 'Por favor, ingrese una contraseña.'}
                                        />
                                        <TextField
                                            required
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            margin="dense"
                                            id="confirm-password"
                                            label="Confirmar Contraseña"
                                            type="password"
                                            fullWidth
                                            variant="outlined"
                                            error={confirmPasswordError}
                                            helperText={confirmPasswordError && 'Las contraseñas no coinciden'}
                                        />
                                        <Button
                                            onClick={handlePreviousStep}
                                            variant="contained"
                                            aria-label="Anterior"
                                            sx={{ mt: theme.spacing(3), mb: theme.spacing(2), width: '40%', marginLeft: '5%', marginRight: '10%' }}>
                                            <ArrowBackIosIcon />
                                        </Button>
                                        <Button onClick={performRegister}
                                            variant="contained"
                                            sx={{ mt: theme.spacing(3), mb: theme.spacing(2), width: '40%', marginRight: '5%' }}>
                                            Registrarse
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Box>
            </Dialog>
            <Snackbar open={registrationSuccess} autoHideDuration={6000} onClose={() => setRegistrationSuccess(false)}>
                <Alert onClose={() => setRegistrationSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    El usuario se ha registrado exitosamente.
                </Alert>
            </Snackbar>

            <Snackbar open={registrationFailure && (registrationStatus.failure && registrationStatus.success)} autoHideDuration={6000} onClose={() => { setRegistrationSuccess(false); setRegistrationStatus({ failure: false, success: false }); }}>
                <Alert onClose={() => { setRegistrationSuccess(false); setRegistrationStatus({ failure: false, success: false }); }} severity="error" sx={{ width: '100%' }}>
                    Este Email ya esta registrado
                </Alert>
            </Snackbar>

            <Snackbar open={registrationFailure && (registrationStatus.failure && !registrationStatus.success)} autoHideDuration={6000} onClose={() => { setRegistrationSuccess(false); setRegistrationStatus({ failure: false, success: false }); }}>
                <Alert onClose={() => { setRegistrationSuccess(false); setRegistrationStatus({ failure: false, success: false }); }} severity="error" sx={{ width: '100%' }}>
                    Error en el registro. Inténtalo de nuevo, por favor.
                </Alert>
            </Snackbar>

            <Snackbar
                open={duplicateTagError}
                autoHideDuration={6000}
                onClose={() => setDuplicateTagError(false)}
            >
                <Alert onClose={() => setDuplicateTagError(false)} severity="error">
                    No se pueden añadir etiquetas duplicadas.
                </Alert>
            </Snackbar>


        </ThemeProvider>

    );
};