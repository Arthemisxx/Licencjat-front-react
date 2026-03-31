import {Button} from "../Components/Button.tsx";
import "./style/HomeView.css"
import "./style/views.css"
import {useAuth} from "../Auth/AuthProvider.tsx";
import {useEffect} from "react";

export const HomeView = () => {
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        localStorage.setItem("previousView", "/");
    }, []);

    return (
        <div className="wrapper">
            <h1 className="home-h1 padding-h1">Zmieniajmy Łódź</h1>
            <h1 className="home-h1 color-h1">Każdego dnia</h1>
            <p className="home-p">Widzisz uszkodzoną nawierzchnię? Niedziałającą latarnię? Przepełniony kosz? <br/> Nie
                przechodź
                obojętnie<br/> Zgłoś awarię</p>
            <div className="buttons-wrapper">
                <Button buttonType="report" content="ZGŁOŚ PROBLEM" route="/nowe-zgloszenie"/>
                {isAuthenticated ? (
                    <Button buttonType="log-in" content="TWOJE KONTO" route="/uzytkownik"/>
                ) : (
                    <Button buttonType="log-in" content="ZALOGUJ SIĘ" route="/logowanie"/>
                )}
            </div>
            <div className="map-wrapper">
                <div className="map-img"></div>
                <div className="btn-map-wrapper">
                    <Button buttonType="map" content={`Otwórz interaktywną mapę ➜`}  route="/mapa" />
                </div>

            </div>
        </div>
    );
};