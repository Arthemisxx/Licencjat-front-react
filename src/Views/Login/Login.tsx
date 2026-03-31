import {FaArrowLeft} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import "../style/Login.css";
import {type ChangeEvent, useState} from "react";
import {useAuth} from "../../Auth/AuthProvider.tsx";
import axiosClient from "../../Auth/axiosClient.ts";


export const Login = () => {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")


    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosClient.post('/auth/login', {email, password});

            const token = response.data.token;

            login(token);

            navigate('/');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            alert('Błędne dane logowania');
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
                    <input type="email" className={`report-form-input`}
                           name="email" value={email}
                           onChange={handleEmailChange}/>

                    <label className="report-form-label" htmlFor="password">Hasło</label>
                    <input type="password" className={`report-form-input`}
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