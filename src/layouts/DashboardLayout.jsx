import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function (){

    const {isLoggedIn} = useAuth();

    if(!isLoggedIn) return <Navigate to="/login"/>

    return (<>
        <Navbar/>
        <Outlet/>
        <footer>
            Sito figo 2024
        </footer>
    </>)
}