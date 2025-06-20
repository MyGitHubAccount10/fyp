import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      // On login, we don't need to do anything with localStorage here,
      // because the component that calls LOGIN should have already set it.
      return { user: action.payload }
    case 'LOGOUT':
      // ✅ FIX: Remove the user from the browser's local storage.
      // This is the crucial step to prevent the "ghost" session on page reload.
      localStorage.removeItem('user')
      
      // Then, update the state to reflect that no user is logged in.
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null
  })

  // This effect runs once on initial load to check if a user session
  // was saved in localStorage from a previous visit.
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    // If a user was found, dispatch a LOGIN action to restore the session.
    // After our fix, this will correctly find 'null' after a logout/delete.
    if (user) {
      dispatch({ type: 'LOGIN', payload: user })
    }
  }, [])

  console.log('AuthContext state:', state) // This is helpful for debugging

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )
}