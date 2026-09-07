import {Link} from "react-router-dom";
import "./style/Header.css";
import {useAuth} from "../Auth/AuthProvider.tsx";

export const Header = () => {
    const {isAuthenticated, user} = useAuth();

    return (
        <div className="header-wrapper">
            <div className="header-wrapper-main">
                <Link to={"/"} className="header-logo"><h1>ŁÓDŹ</h1> <h1>&nbsp;NAPRAWIA</h1></Link>
                <div className="header-options">

                    <Link to={"/mapa"} className="header-option">Mapa zgłoszeń</Link>

                    {isAuthenticated ? (
                            <>
                                <Link to={"/uzytkownik"} className="header-option">Konto użytkownika</Link>
                                {user?.role === "ADMIN" && (
                                    <Link to={"/panel-administratora"} className="header-option admin">Panel
                                        administratora</Link>
                                )}
                            </>
                        )
                        : (
                            <Link to={"/logowanie"} className="header-option">Zaloguj się</Link>
                        )}
                </div>
            </div>
            <div className="header-wrapper-line"></div>
        </div>
    );
};