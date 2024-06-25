import { createContext } from "react";
import { useState, useContext } from "react";

const AuthContext = createContext({})

const AuthProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = (payload, ) => {
        setIsLoggedIn(true);
    }

    const handleLogout = () => {
        setIsLoggedIn(false);
    }

    const value = {
        isLoggedIn,
        handleLogin,
        handleLogout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const value = useContext(AuthContext);
    if(value === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return value;
}

export { AuthProvider, useAuth };