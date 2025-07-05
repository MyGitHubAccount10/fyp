import { createContext, useReducer, useEffect } from 'react';

export const CartContext = createContext();

export const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        cartItems: action.payload
      };

    case 'ADD_TO_CART': {
      const existingItem = state.cartItems.find(item =>
        item.id === action.payload.id &&
        item.type === action.payload.type &&
        item.shape === action.payload.shape &&
        item.size === action.payload.size &&
        item.material === action.payload.material &&
        item.thickness === action.payload.thickness &&
        item.topImageFile === action.payload.topImageFile &&
        item.bottomImageFile === action.payload.bottomImageFile
      );

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id &&
            item.type === action.payload.type &&
            item.shape === action.payload.shape &&
            item.size === action.payload.size &&
            item.material === action.payload.material &&
            item.thickness === action.payload.thickness &&
            item.topImageFile === action.payload.topImageFile &&
            item.bottomImageFile === action.payload.bottomImageFile
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }

      return {
        ...state,
        cartItems: [...state.cartItems, action.payload]
      };
    }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.id &&
          item.type === action.payload.type &&
          item.shape === action.payload.shape &&
          item.size === action.payload.size &&
          item.material === action.payload.material &&
          item.thickness === action.payload.thickness &&
          item.topImageFile === action.payload.topImageFile &&
          item.bottomImageFile === action.payload.bottomImageFile
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item =>
          !(
            item.id === action.payload.id &&
            item.type === action.payload.type &&
            item.shape === action.payload.shape &&
            item.size === action.payload.size &&
            item.material === action.payload.material &&
            item.thickness === action.payload.thickness &&
            item.topImageFile === action.payload.topImageFile &&
            item.bottomImageFile === action.payload.bottomImageFile
          )
        )
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
    }, (initialState) => {
        // Lazy initializer: runs only on the first render
        // This function loads the cart from localStorage when the app starts
        try {
            const localData = localStorage.getItem('cart');
            return localData ? { cartItems: JSON.parse(localData) } : initialState;
        } catch (error) {
            console.error("Could not parse cart from localStorage", error);
            return initialState;
        }
    });

    // This effect runs whenever the cartItems state changes, saving it to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(state.cartItems));
            localStorage.setItem('cartUpdatedAt', new Date().toISOString());
        } catch (error) {
            console.error("Could not save cart to localStorage", error);
        }
    }, [state.cartItems]);

    return (
        <CartContext.Provider value={{ ...state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};