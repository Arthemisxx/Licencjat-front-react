import {Button} from "../Components/Button.tsx";
import './style/NotFoundView.css';

export const NotFoundView = () => {
    return (
        <div className="not-found-wrapper">
            <h1 className="error">404</h1>
            <p className="not-found-p">Niestety, taka strona nie istnieje</p>
            <Button content="Przejdź na stronę główną" route="/" buttonType="map" />
        </div>
    );
};