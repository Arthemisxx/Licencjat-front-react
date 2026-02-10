import {Link} from "react-router-dom";
import "./Header.css";

export const Header = () => {
    return (
        <div className="header-wrapper">
            <div className="header-wrapper-main">
                <Link to={"/"} className="header-logo"><p>ŁÓDŹ</p> <p>&nbsp;NAPRAWIA</p></Link>
                <div className="header-options">
                    <Link to={"/mapa"} className="header-option">Mapa zgłoszeń</Link>
                    <Link to={"/uzytkownik"} className="header-option">Moje Konto</Link>
                </div>


            </div>
            <div className="header-wrapper-line"></div>

        </div>
    );
};