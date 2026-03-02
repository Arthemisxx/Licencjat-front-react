import {Button} from "../Components/Button.tsx";
import "./HomeView.css"
import "./views.css"

export const HomeView = () => {
    return (
        <div className="wrapper">
            <h1 className="home-h1 padding-h1">Zmieniajmy Łódź</h1>
            <h1 className="home-h1 color-h1">Każdego dnia</h1>
            <p className="home-p">Widzisz uszkodzoną nawierzchnię? Niedziałającą latarnię? Przepełniony kosz? <br/> Nie
                przechodź
                obojętnie.<br/> Zgłoś awarię w 30 sekund.</p>
            <div className="buttons-wrapper">
                <Button buttonType="report" content="ZGŁOŚ PROBLEM" route="/nowe-zgloszenie"/>
                <Button buttonType="log-in" content="ZALOGUJ SIĘ" route="/uzytkownik"/>
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