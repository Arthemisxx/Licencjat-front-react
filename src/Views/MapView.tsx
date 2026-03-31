import {GeoJSON, MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "./style/MapView.css"
import "./style/views.css"
import 'leaflet/dist/leaflet.css';
import {Button} from "../Components/Button.tsx";
import {useEffect, useState} from "react";
import {type LatLngBoundsExpression} from "leaflet";
import cityBoundaries from "../Utils/lodz-borders.json"
import type {Category, ReportMapData} from "../types/report.ts";
import {fetchCategories, fetchFilteredReports} from "../Utils/api.ts";
import {useSearchParams} from "react-router-dom";

export const MapView = () => {
    const lodzBounds: LatLngBoundsExpression = [[51.6500, 19.2500], [51.9000, 19.6500]];
    const [categories, setCategories] = useState<Category[]>();
    const [filteredReports, setFilteredReports] = useState<ReportMapData[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const categoriesParam = searchParams.get("categories");
    const hasCategoriesParam = searchParams.has("categories");

    let filteredCategoryIds: number[];

    if (!hasCategoriesParam) {
        filteredCategoryIds = [1, 2, 3, 4, 5];
    } else if (categoriesParam === "") {
        filteredCategoryIds = [];
    } else {
        filteredCategoryIds = categoriesParam!.split(',').map(Number);
    }

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