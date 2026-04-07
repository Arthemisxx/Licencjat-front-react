import {FaArrowLeft} from "react-icons/fa";
import {useState, type ChangeEvent, useEffect} from "react";
import {GeoJSON, MapContainer, Marker, TileLayer} from "react-leaflet";
import {fetchAddressFromCoords} from "../../Utils/geocoding.ts";
import type {Category, ReportData} from "../../types/report.ts";
import {useSearchParams} from "react-router-dom";
import cityBoundaries from "../../Utils/lodz-borders.json";
import type {LatLngBoundsExpression} from "leaflet";
import {useAuth} from "../../Auth/AuthProvider.tsx";

interface SecondStepProps {
    onStepBack: () => void;
    onSubmit: (report: ReportData) => void;
    initialCategoryId: number;
    categories: Category[];
}

interface FormErrors {
    description?: string;
    guestEmail?: string;
    localization?: string;
}

interface Localization {
    latitude: number;
    longitude: number;
}


export const AddReportSecondStep = ({onStepBack, onSubmit, initialCategoryId, categories}: SecondStepProps) => {
    const [categoryId, setCategoryId] = useState<number>(initialCategoryId);
    const [description, setDescription] = useState<string>("");
    const [guestEmail, setGuestEmail] = useState<string | null>(null);
    const [photos, setPhotos] = useState<File[]>([]);
    const [photosPreviewUrls, setPhotosPreviewUrls] = useState<string[]>([]);
    const [localization, setLocalization] = useState<Localization>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});

    const {isAuthenticated, user} = useAuth();
    const [searchParams] = useSearchParams();
    const initialLatitude =Number(searchParams.get("lat"));
    const initialLongitude = Number(searchParams.get("lng"));

    const hasInitialLocalization = searchParams.has("lat") && searchParams.has("lng");

    const lodzBounds: LatLngBoundsExpression = [[51.6500, 19.2500], [51.9000, 19.6500]];
    const borderStyle = {
        color: "var(--color-primary-magenta)",
        weight: 3,
        fillOpacity: 0
    };


    function handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setDescription(event.target.value);
        if (errors.description) {
            setErrors({...errors, description: undefined});
        }
    }

    function handleCategoryChange(event: ChangeEvent<HTMLSelectElement>) {
        setCategoryId(Number(event.target.value));
    }

    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
        setGuestEmail(event.target.value);
        if (errors.guestEmail) {
            setErrors({...errors, guestEmail: undefined});
        }
    };

    function handlePhotosChange(event: ChangeEvent<HTMLInputElement>) {
        const addedPhotos = event.target.files;

        if (addedPhotos && addedPhotos.length > 0) {
            const photosArray = Array.from(addedPhotos);
            if (photos.length + photosArray.length > 5) {
                alert("Możesz dodać max. 5 zdjęć");
                return;
            }
            setPhotos((prev) => [...prev, ...photosArray]);

            const newPreviewUrls = photosArray.map(file => URL.createObjectURL(file));
            setPhotosPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
            event.target.value = "";
        }
    }

    function handleRemovePhoto(indexToRemove: number) {
        setPhotos(prevPhotos => prevPhotos.filter((_, index) => index !== indexToRemove));
        URL.revokeObjectURL(photosPreviewUrls[indexToRemove]);
        setPhotosPreviewUrls(prevUrls => prevUrls.filter((_, index) => index !== indexToRemove));
    }


    useEffect(() => {
        if(hasInitialLocalization){
            setLocalization({latitude: initialLatitude, longitude:initialLongitude});
        }
    }, []);


    useEffect(() => {
        if (!localization) return;

        const timer = setTimeout(async () => {
            const result = await fetchAddressFromCoords(localization.latitude, localization.longitude);

            if (result) {
                setAddress(result);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [localization]);


    useEffect(() => {
        return () => {
            photosPreviewUrls.forEach(url => URL.revokeObjectURL(url));
        }
    }, []);

    function validateForm(): boolean {
        const newErrors: FormErrors = {};
        let isValid = true;


        if (!description.trim()) {
            isValid = false;
            newErrors.description = "Opis jest wymagany"
        }

        if(!isAuthenticated){
            if (guestEmail && guestEmail.trim() !== "") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(guestEmail)) {
                    isValid = false;
                    newErrors.guestEmail = "Adres email jest niepoprawny";
                }
            }
        }

        if(!localization) {
            isValid = false;
            newErrors.localization = "Wybierz na mapie lokalizację zgłoszenia"
        }


        setErrors(newErrors);
        return isValid;
    }

    function submitForm(event: { preventDefault: () => void; }) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }


        const newReport: ReportData = {
            authorId: user ? user.id : null,
            categoryId: categoryId,
            description: description,
            latitude: localization.latitude,
            longitude: localization.longitude,
            address: address,
            guestEmail: guestEmail,
            photos: photos
        }

        onSubmit(newReport);
    }



    return (
        <>
            <div className="steps-wrapper">
                <div className="report-nav">
                    <button onClick={() => onStepBack()} className="step-back-btn"><FaArrowLeft/></button>
                    <p>Krok 2 z 2</p>
                </div>

                <h3 className="report-form-header">Szczegóły zgłoszenia</h3>

                <form action="" className="report-form" onSubmit={submitForm}>
                    <div className="report-form-wrapper">
                        <div className="report-form-first-col">

                            <div className="report-form-group">
                                <label className="report-form-label" htmlFor="category">Kategoria zgłoszenia</label>
                                <select value={categoryId} onChange={handleCategoryChange} name="category"
                                        className="report-form-input">
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>

                            </div>
                            <div className="report-form-group">
                                <label className="report-form-label" htmlFor="description">Opis sytuacji</label>
                                <textarea
                                    className={`report-form-textarea ${errors.description ? 'input-error' : ''}`}
                                    placeholder="Opisz dokładnie problem"
                                    name="description" value={description} onChange={handleDescriptionChange}/>
                                {errors.description && <span className="error-message">{errors.description}</span>}

                            </div>
                            <div className="report-form-group">
                                <label className="report-form-label" htmlFor="photo">Zdjęcie (opcjonalnie)</label>
                                <input type="file" multiple accept="image/jpeg, image/jpg, image/png"
                                       className="report-form-input-photo" id="photo-input"
                                       name="photo" onChange={handlePhotosChange}/>
                                <label className="report-form-label-custom" htmlFor="photo-input">Wybierz
                                    zdjęcia</label>
                                {photosPreviewUrls.length > 0 && (
                                    <div className="preview-grid">
                                        {photosPreviewUrls.map((url, index) => (
                                            <div key={url} className="preview-item">
                                                <img src={url} alt="Podgląd zdjęcia"/>
                                                <button className="remove-photo-btn" type="button"
                                                        onClick={() => handleRemovePhoto(index)}>✕
                                                </button>

                                            </div>
                                        ))

                                        }

                                    </div>

                                )

                                }

                            </div>

                        </div>
                        <div className="report-form-second-col">
                            <div className="report-form-group">
                                <label className="report-form-label">Lokalizacja (Wybierz na mapie)</label>
                                <div className="report-form-minimap">
                                    <MapContainer center={hasInitialLocalization ? [Number(initialLatitude), Number(initialLongitude)] : [51.7592, 19.4558]} zoom={16}
                                                  style={{height: "100%", width: "100%"}}
                                                  maxBounds={lodzBounds}
                                                  minZoom={11}>
                                        {cityBoundaries && (
                                            <GeoJSON data={cityBoundaries as any}
                                                     style={borderStyle}
                                                     eventHandlers={{
                                                         click: (e) => {
                                                             setLocalization({latitude: e.latlng.lat, longitude: e.latlng.lng});
                                                         }
                                                     }}/>
                                        )}
                                        <TileLayer attribution='&copy; OpenStreetMap'
                                                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                                        {localization && (
                                            <Marker position={{lat: localization.latitude, lng: localization.longitude}}></Marker>
                                        )}
                                    </MapContainer>


                                </div>
                                {errors.localization && <span className="error-message">{errors.localization}</span>}

                            </div>
                            <div className="report-form-group">
                                <label className="report-form-label">Adres</label>
                                <input type="text" className="report-form-input"
                                       placeholder="Adres zostanie pobrany z mapy" defaultValue={address}/>
                            </div>

                            {!isAuthenticated && (
                                <div className="report-form-group">
                                    <label className="report-form-label" htmlFor="guestEmail">Adres e-mail
                                        (opcjonalnie)</label>
                                    <input
                                        type="email"
                                        className={`report-form-input ${errors.guestEmail ? 'input-error' : ''}`}
                                        placeholder="Aby otrzymać powiadomienie o statusie"
                                        name="guestEmail"
                                        value={guestEmail}
                                        onChange={handleEmailChange}
                                    />
                                    {errors.guestEmail && <span className="error-message">{errors.guestEmail}</span>}
                                </div>
                            )}


                        </div>


                    </div>
                    <button type={"submit"} className="report-form-btn">WYŚLIJ ZGŁOSZENIE</button>

                </form>


            </div>

        </>
    );
};