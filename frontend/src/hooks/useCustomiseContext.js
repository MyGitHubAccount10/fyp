import { useContext } from 'react';
import { CustomiseContext } from '../context/CustomiseContext';

export const useCustomiseContext = () => {
    const context = useContext(CustomiseContext);
    if (!context) {
        throw Error('useCustomiseContext must be used inside a CustomiseContextProvider');
    }
    return context;
};