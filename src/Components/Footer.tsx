import "./style/Footer.css";
import {useEffect, useState} from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export const Footer = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if(savedTheme === "dark"){
            setIsDarkMode(true);
            document.documentElement.classList.add("dark-mode");
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if(!isDarkMode){
            document.documentElement.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
        }else{
            document.documentElement.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
        }
    }

    return (
        <div className="footer-wrapper">
            <p>© 2026 Julia Staniszewska</p>
            <div className="light-dark-mode">
                <button onClick={toggleTheme} className="theme-toggle-btn">
                    {isDarkMode ? <FaSun/> : <FaMoon/>}
                </button>


            </div>
        </div>
    );
};