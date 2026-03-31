import {FaArrowLeft} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import "../style/Login.css";
import {type ChangeEvent, useState} from "react";

export const Register = () => {
    const [name, setName] = useState<string>("")
    const [surname, setSurname] = useState<string>("")
    const navigate = useNavigate();

    function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }

    function handleSurnameChange(event: ChangeEvent<HTMLInputElement>) {
        setSurname(event.target.value);
    }

    const goBack = () => {
        const previousView: string = localStorage.getItem("previousView") || "/";
        navigate(previousView);
    }

    return (
        <div className="login-wrapper">
                <button className="step-back-btn login-back-btn" onClick={goBack}><FaArrowLeft/></button>
            <div className="login-form-wrapper register-border">
                <h1 className="login-h2">REJESTRACJA</h1>
                <form>
                    <label className="report-form-label" htmlFor="name">Imię</label>
                    <input type="text" className={`report-form-input`}
                           name="name" value={name}
                           onChange={handleNameChange}/>

                    <label className="report-form-label" htmlFor="surname">Nazwisko</label>
                    <input type="text" className={`report-form-input`}
                           name="surname" value={surname}
                           onChange={handleSurnameChange}/>


                    <button className="register-form-btn" type={"submit"}>Załóż konto</button>

                    <div className="div-center">Masz już konto? <Link to={"/logowanie"} className="register-btn">ZALOGUJ
                        SIĘ</Link></div>
                </form>


            </div>


        </div>
    );
};