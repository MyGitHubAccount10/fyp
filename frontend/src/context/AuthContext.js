import { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      // When a user logs in, we update the user state.
      // The state already has authIsReady: true from the initial check, so we don't need to change it.
      return { ...state, user: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('user');
      // On logout, we clear the user but keep authIsReady as true.
      return { ...state, user: null };
    // --- NEW CASE ---
    // This action is dispatched once on startup after checking localStorage.
    case 'AUTH_IS_READY':
      return {
        user: action.payload, // The user object (or null) found in storage
        authIsReady: true,    // The signal that the initial check is complete
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  // --- MODIFIED: Initial state now includes authIsReady ---
  const [state, dispatch] = useReducer(authReducer, { 
    user: null,
    authIsReady: false,
  });

  // This effect runs only once when the app starts.
  useEffect(() => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        
        // --- MODIFIED: Dispatch AUTH_IS_READY instead of LOGIN ---
        // This single dispatch tells our app "The initial check is done. Here's the user we found (if any)."
        dispatch({ type: 'AUTH_IS_READY', payload: user });

    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        // Even if there's an error, we signal that the check is done.
        dispatch({ type: 'AUTH_IS_READY', payload: null });
    }
  }, []); // Empty array ensures this runs only once on component mount

  console.log('AuthContext state:', state); // This is helpful for debugging

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {/* --- MODIFIED: Render children only when the auth check is complete --- */}
      {/* This prevents the race condition in all child components. */}
      { state.authIsReady && children }
    </AuthContext.Provider>
  );
};