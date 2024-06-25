import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function(){

    const { login } = useAuth();

    const baseData = {
        email: '',
        password: ''
    };
    const [formData, setFormData] = useState(baseData);

    const [loginError, setLoginError] = useState(null);

    const changeData = (key, value) => {
        setFormData(curr => ({
            ...curr,
            [key]: value
        }));
    }

    const handleSubmit = async e => {
        e.preventDefault();
        try{
            await login(formData);
            setFormData(baseData);
        }catch(err){
            setLoginError(err);
        }
    }

    return(<>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder="Email" 
                value={formData.email}
                onChange={e => changeData('email', e.target.value)}
            />
            <input 
                type="password"
                placeholder="Password" 
                value={formData.password}
                onChange={e => changeData('password', e.target.value)}
            />
            {loginError !== null && <div className="error">{loginError.message}</div>}
            {loginError?.errors && loginError.errors.map( (err, index) => (
                <div key={`err${index}`}>{err.msg}</div>
            ))}
            <button>Loggati</button>
        </form>
    </>)

}