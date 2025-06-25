import { createContext, useReducer } from 'react';

export const CustomiseContext = createContext();

export const customiseReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CUSTOMISE':
            return {
                customItem: action.payload
            };

        case 'CLEAR_CUSTOMISE':
            return {
                customItem: null
            };
        default:
            return state;
    }
};

export const CustomiseContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(customiseReducer, {
        customItem: null
    });

    return (
        <CustomiseContext.Provider value={{ ...state, dispatch }}>
            {children}
        </CustomiseContext.Provider>
    );
};