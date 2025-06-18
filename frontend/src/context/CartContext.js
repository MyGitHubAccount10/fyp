import { createContext, useReducer } from 'react';

export const CartContext = createContext();

export const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return {
                ...state,
                cartItems: action.payload
            };
        case 'ADD_TO_CART':
            const existingItem = state.cartItems.find(item => item.id === action.payload.id && item.size === action.payload.size);
            if (existingItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(item =>
                        item.id === action.payload.id && item.size === action.payload.size
                            ? { ...item, quantity: item.quantity + action.payload.quantity }
                            : item
                    )
                };
            }
            return {
                ...state,
                cartItems: [...state.cartItems, action.payload]
            };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item.id === action.payload.id && item.size === action.payload.size
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item.id !== action.payload.id || item.size !== action.payload.size)
            };
        case 'CLEAR_CART':
            return {
                ...state,
                cartItems: []
            };
        default:
            return state;
    }
};

export const CartContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        cartItems: []
    });

    return (
        <CartContext.Provider value={{ ...state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};
