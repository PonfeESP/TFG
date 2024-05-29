// ActiveComponentContext.js
import React, { createContext, useState } from 'react';

const ActiveComponentContext = createContext();

export const ActiveComponentProvider = ({ children }) => {
    const [activeComponentContext, setActiveComponentContext] = useState('inicio');

    return (
        <ActiveComponentContext.Provider value={{ activeComponentContext, setActiveComponentContext }}>
            {children}
        </ActiveComponentContext.Provider>
    );
};

export default ActiveComponentContext;
