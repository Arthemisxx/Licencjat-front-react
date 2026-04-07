import {FaArrowLeft} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import "../style/Login.css";
import {type ChangeEvent, useState} from "react";
import {useAuth} from "../../Auth/AuthProvider.tsx";
import axiosClient from "../../Auth/axiosClient.ts";

interface LoginErrors {
    email?: string;
    password?: string;
}

export const Login = () => {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errors, setErrors] = useState<LoginErrors>({});


    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: undefined }));
        }
    }

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
        if(errors.password){
            setErrors(prev => ({...prev, password: undefined }));
        }
    }

    function validateForm(): boolean {

        const newErrors: LoginErrors = {};
        let isValid = true;

        if (!password.trim()) {
            isValid = false;
            newErrors.password = "Hasło jest wymagany"
        }

        if (!email.trim()) {
            isValid = false;
            newErrors.email = "Adres email jest wymagany"
        }

        setErrors(newErrors);
        return isValid;
    }

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setErrors({});

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axiosClient.post('/auth/login', {email, password});

            const token = response.data.token;

            login(token);

            navigate('/');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            const newErrors: LoginErrors = {};
            newErrors.email = "Błędne dane logowania"
            newErrors.password = "Błędne dane logowania"
            setErrors(newErrors);
            setPassword("");

        }

    }

    const goBack = () => {
        const previousView: string = localStorage.getItem("previousView") || "/";
        navigate(previousView);
    }


    return (
        <div className="login-wrapper">
            <button className="step-back-btn login-back-btn" onClick={goBack}><FaArrowLeft/></button>
            <div className="login-form-wrapper login-border">
                <h1 className="login-h2">LOGOWANIE</h1>
                <form onSubmit={handleSubmit}>
                    <label className="report-form-label" htmlFor="email">E-mail</label>
                    <input type="email" className={`report-form-input ${errors.email ? 'input-error' : ''}`}
                           name="email" value={email}
                           onChange={handleEmailChange}/>

                    <label className="report-form-label" htmlFor="password">Hasło</label>
                    <input type="password" className={`report-form-input ${errors.password ? 'input-error' : ''}`}
                           name="password" value={password}
                           onChange={handlePasswordChange}/>

                    <button className="login-form-btn" type={"submit"}>Zaloguj się</button>
                    <div className="div-center">Nie masz konta? <Link to={"/rejestracja"} className="login-btn">ZAREJESTRUJ
                        SIĘ</Link></div>
                </form>


            </div>


        </div>
    );
};