import {GeoJSON, MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "./style/MapView.css"
import "./style/views.css"
import 'leaflet/dist/leaflet.css';
import {Button} from "../Components/Button.tsx";
import {useEffect, useRef, useState} from "react";
import L, {type LatLngBoundsExpression} from "leaflet";
import cityBoundaries from "../Utils/lodz-borders.json"
import type {Category, ReportMapData} from "../types/report.ts";
import {fetchCategories, fetchFilteredReports} from "../Utils/api.ts";
import {useNavigate, useSearchParams} from "react-router-dom";
import {ReportDetailsPanel} from "../Components/ReportDetailsPanel.tsx";

// const defaultIcon = new L.Icon({
//     iconUrl: 'public/marker.svg',
//     shadowUrl: 'public/shadow.png',
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41]
// });

const defaultIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


const selectedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


export const MapView = () => {
    const lodzBounds: LatLngBoundsExpression = [[51.6500, 19.2500], [51.9000, 19.7000]];
    const [categories, setCategories] = useState<Category[]>();
    const [filteredReports, setFilteredReports] = useState<ReportMapData[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
    const [potentialReport, setPotentialReport] = useState<{ lat: number, lng: number } | null>(null)
    const navigate = useNavigate();
    const tempMarkerRef = useRef<any>(null);

    const categoriesParam = searchParams.get("categories");
    const hasCategoriesParam = searchParams.has("categories");

    let filteredCategoryIds: number[];

    if (!hasCategoriesParam) {
        filteredCategoryIds = [1, 2, 3, 4, 5, 6];
    } else if (categoriesParam === "") {
        filteredCategoryIds = [];
    } else {
        filteredCategoryIds = categoriesParam!.split(',').map(Number);
    }

    const borderStyle = {
        color: "var(--color-primary-magenta)",
        weight: 3,
        fillColor: "transparent",
        fillOpacity: 0.01
    };

    useEffect(() => {
        localStorage.setItem("previousView", "/mapa");
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const categories = await fetchCategories();
            setCategories(categories);

            const reports = await fetchFilteredReports(filteredCategoryIds);
            setFilteredReports(reports);
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const reports = await fetchFilteredReports(filteredCategoryIds);
            setFilteredReports(reports);
        }
        fetchData();
    }, [searchParams]);

    useEffect(() => {
        if (potentialReport && tempMarkerRef.current) {
            setTimeout(() => {
                tempMarkerRef.current?.openPopup()
            }, 10);
        }
    }, [potentialReport]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, categoryId: number) => {
        let newIds: number[];

        if (e.target.checked) {
            newIds = [...filteredCategoryIds, categoryId];
        } else {
            newIds = filteredCategoryIds.filter(id => id !== categoryId);
        }

        setSearchParams({categories: newIds.join(',')});
    }


    return (
        <div className="mapview-wrapper">
            <div className="map-filter">

                <div className="map-filter-wrapper">
                    <p>Filtruj widok zgłoszeń</p>
                    {categories?.map(category => (
                        <label key={category.id}><input type="checkbox"
                                                        checked={filteredCategoryIds.includes(category.id)}
                                                        onChange={(e) => handleChange(e, category.id)}/>
                            {category.name}
                            <br/></label>
                    ))}

                </div>


            </div>
            <div className="add-report-wrapper">
                <Button buttonType="add-report" content={"Dodaj zgłoszenie"} route="/nowe-zgloszenie"></Button>

            </div>

            <MapContainer
                center={[51.77307, 19.48040]}
                zoom={11}
                scrollWheelZoom={true}
                style={{height: '100%', width: '100%'}}
                maxBounds={lodzBounds}
                minZoom={11}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                    OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {cityBoundaries && (

                    <GeoJSON
                        data={cityBoundaries as any}
                        style={borderStyle}
                        eventHandlers={{
                            click: (e) => {
                                setPotentialReport(e.latlng);
                                setSelectedReportId(null);
                            }
                        }}
                    />

                )}

                {filteredReports.map(report => (
                    <Marker
                        key={report.id}
                        icon={selectedReportId === report.id ? selectedIcon : defaultIcon}
                        position={[report.latitude, report.longitude]}
                        eventHandlers={{
                            click: () => {
                                setSelectedReportId(report.id);
                                setPotentialReport(null);
                            },
                        }}
                    >
                    </Marker>
                ))}

                {potentialReport && (
                    <Marker position={potentialReport}
                            ref={tempMarkerRef}>
                        <Popup eventHandlers={{
                            remove: () => {
                                setPotentialReport(null);
                            },

                        }}>
                            <div className="popup-add-report">
                                <p>Chcesz dodać zgłoszenie w tym miejscu?</p>
                                <button className="popup-report-btn"
                                        onClick={() => navigate(`/nowe-zgloszenie?lat=${potentialReport?.lat}&lng=${potentialReport.lng}`)}>
                                    DODAJ
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {selectedReportId && (
                <ReportDetailsPanel
                    reportId={selectedReportId}
                    onClose={() => setSelectedReportId(null)}
                ></ReportDetailsPanel>
            )}

        </div>
    );
};