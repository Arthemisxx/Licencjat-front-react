import {GeoJSON, MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "./style/MapView.css"
import "./style/views.css"
import 'leaflet/dist/leaflet.css';
import {Button} from "../Components/Button.tsx";
import {useEffect, useState} from "react";
import {type LatLngBoundsExpression} from "leaflet";
import cityBoundaries from "../Utils/lodz-borders.json"
import type {ReportMapData} from "../types/report.ts";
import {fetchFilteredReports} from "../Utils/api.ts";

export const MapView = () => {
    const lodzBounds: LatLngBoundsExpression = [[51.6500, 19.2500], [51.9000, 19.6500]];
    const [filteredCategoryIds, setFilteredCategoryIds] = useState([1, 2, 3, 4, 5]);
    const [filteredReports, setFilteredReports] = useState<ReportMapData[]>([]);

    const borderStyle = {
        color: "var(--color-primary-magenta)",
        weight: 3,
        fillOpacity: 0
    };

    useEffect(() => {
        localStorage.setItem("previousView", "/mapa");
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const reports = await fetchFilteredReports(filteredCategoryIds);
            setFilteredReports(reports);
        }
        fetchData();
    }, []);


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
            <MapContainer center={[51.77307, 19.48040]} zoom={12} scrollWheelZoom={true}
                          style={{height: '100%', width: '100%'}} maxBounds={lodzBounds} minZoom={11}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {cityBoundaries && (
                    <GeoJSON data={cityBoundaries as any} style={borderStyle}/>
                )}
                {filteredReports.map(report => (
                    <Marker
                        key={report.id}
                        position={[report.latitude, report.longitude]}>
                        <Popup>
                            {report.categoryName}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

        </div>
    );
};