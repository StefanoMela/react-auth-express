import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStorage from "../hooks/useStorage";
import axios from "../utils/axiosClient";

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const navigate = useNavigate();

    const [user, setUser] = useStorage(null, 'user');
    const isLoggedIn = user !== null;

    const login = async (payload) => {
        try{
            const { data: response } = await axios.post('/auth/login', payload);
            setUser(response.data);
            localStorage.setItem('accessToken', response.token);
            navigate('/');
        }catch(err){
            const { errors } = err.response.data;
            const error = new Error(errors ? 'Errore di Login' : err.response.data);
            error.errors = errors;
            throw error;
        }
    }

    const signup = async (payload) => {
        try{
            if(!payload.name) delete payload.name;
            if(!payload.profile_pic) delete payload.profile_pic;
            const { data: response } = await axios.post('/auth/register', payload, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setUser(response.data);
            localStorage.setItem('accessToken', response.token);
            navigate('/');
        }catch(err){
            const { errors } = err.response.data;
            const error = new Error(errors ? 'Errore di Signup' : err.response.data);
            error.errors = errors;
            throw error;
        }
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('accessToken');
        navigate('/login');
    }

    const value = {
        user,
        isLoggedIn,
        login,
        logout,
        signup
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const value = useContext(AuthContext);
    if(value === undefined){
        throw new Error('Non sei dentro al Auth Provider.');
    }
    return value;
}

export {AuthProvider, useAuth};