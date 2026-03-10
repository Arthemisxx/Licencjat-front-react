import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "./style/MapView.css"
import "./style/views.css"
import 'leaflet/dist/leaflet.css';
import {Button} from "../Components/Button.tsx";

export const MapView = () => {
    return (
        <div className="mapview-wrapper">
            <div className="map-filter">

                <div className="map-filter-wrapper">
                    <p>Filtruj widok zgłoszeń</p>
                    {/*TODO dodać pobieranie kategorii z backendu*/}
                    <label><input type="checkbox" checked/> Oświetlenie </label><br/>
                    <label><input type="checkbox" checked/> Chodniki </label><br/>
                    <label><input type="checkbox" checked/> Jezdnia </label><br/>
                    <label><input type="checkbox" checked/> Mała architektura </label><br/>
                    <label><input type="checkbox" checked/> Inne </label><br/>
                </div>


            </div>
            <div className="add-report-wrapper">
                <Button buttonType="add-report" content={"Dodaj zgłoszenie"} route="/nowe-zgloszenie"></Button>

            </div>
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}
                          style={{height: '100%', width: '100%'}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[51.505, -0.09]}>
                    <Popup>
                        A pretty CSS3 popup. <br/> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>

        </div>
    );
};