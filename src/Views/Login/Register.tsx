import {FaArrowLeft} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import "../style/Login.css";
import {type ChangeEvent, useState} from "react";
import axiosClient from "../../Auth/axiosClient.ts";

interface RegisterErrors {
    name?: string;
    surname?: string;
    email?: string;
    password?: string;
}

export const Register = () => {
    const [name, setName] = useState<string>("")
    const [surname, setSurname] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errors, setErrors] = useState<RegisterErrors>({});
    const navigate = useNavigate();

    function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
        if (errors.name) {
            setErrors(prev => ({ ...prev, name: undefined }));
        }
    }

    function handleSurnameChange(event: ChangeEvent<HTMLInputElement>) {
        setSurname(event.target.value);
        if (errors.surname) {
            setErrors(prev => ({ ...prev, surname: undefined }));
        }
    }

    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: undefined }));
        }
    }

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: undefined }));
        }
    }

    const goBack = () => {
        const previousView: string = localStorage.getItem("previousView") || "/";
        navigate(previousView);
    }

    function validateForm(): boolean {

        const newErrors: RegisterErrors = {};
        let isValid = true;

        if (!name.trim()) {
            isValid = false;
            newErrors.name = "Imię jest wymagany"
        }

        if (!surname.trim()) {
            isValid = false;
            newErrors.surname = "Nazwisko jest wymagany"
        }

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
            await axiosClient.post('/auth/signup', {email, password, firstName: name, lastName: surname});
            navigate('/logowanie');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            const newErrors: RegisterErrors = {};
            newErrors.email = "Błędne dane logowania"
            newErrors.password = "Błędne dane logowania"
            newErrors.name = "Błędne dane logowania"
            newErrors.surname = "Błędne dane logowania"
            setErrors(newErrors);
            setPassword("");

        }

    }

    return (
        <div className="login-wrapper">
                <button className="step-back-btn login-back-btn" onClick={goBack}><FaArrowLeft/></button>
            <div className="login-form-wrapper register-border">
                <h1 className="login-h2">REJESTRACJA</h1>
                <form onSubmit={handleSubmit}>
                    <label className="report-form-label" htmlFor="name">Imię</label>
                    <input type="text" className={`report-form-input ${errors.name ? 'input-error' : ''}`}
                           name="name" value={name}
                           onChange={handleNameChange}/>

                    <label className="report-form-label" htmlFor="surname">Nazwisko</label>
                    <input type="text" className={`report-form-input ${errors.surname ? 'input-error' : ''}`}
                           name="surname" value={surname}
                           onChange={handleSurnameChange}/>

                    <label className="report-form-label" htmlFor="email">Email</label>
                    <input type="email" className={`report-form-input ${errors.email ? 'input-error' : ''}`}
                           name="email" value={email}
                           onChange={handleEmailChange}/>

                    <label className="report-form-label" htmlFor="password">Hasło</label>
                    <input type="password" className={`report-form-input ${errors.password ? 'input-error' : ''}`}
                           name="password" value={password}
                           onChange={handlePasswordChange}/>


                    <button className="register-form-btn" type={"submit"}>Załóż konto</button>

                    <div className="div-center">Masz już konto? <Link to={"/logowanie"} className="register-btn">ZALOGUJ
                        SIĘ</Link></div>
                </form>


            </div>


        </div>
    );
};