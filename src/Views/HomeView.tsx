import {Button} from "../Components/Button.tsx";
import "./HomeView.css"
import "./views.css"

export const HomeView = () => {
    return (
        <div className="wrapper">
            <h1 className="home-h1">Zmieniajmy Łódź</h1>
            <h1 className="home-h1">Każdego dnia</h1>
            <p className="home-p">Widzisz uszkodzoną nawierzchnię? Niedziałającą latarnię? Przepełniony kosz? <br/> Nie
                przechodź
                obojętnie. Zgłoś awarię w 30 sekund.</p>
            <div className="buttons-wrapper">
                <Button buttonType="report" content="ZGŁOŚ PROBLEM" route="/nowe-zgloszenie" style="padding-right: 20px"/>
                <Button buttonType="log-in" content="ZALOGUJ SIĘ" route="/uzytkownik"/>
            </div>
            <div className="map-wrapper">
                <div className="map-img"></div>
                <Button buttonType="map" content="Otwórz interaktywną mapę &RightArrow;" route="#/map"
                        style="padding-bottom: 50px; z-index: 2"/>

            </div>
        </div>
    );
};