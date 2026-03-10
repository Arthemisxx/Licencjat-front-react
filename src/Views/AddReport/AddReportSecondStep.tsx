import {FaArrowLeft, FaMapMarkerAlt} from "react-icons/fa";
import {useState, type ChangeEvent, useEffect} from "react";
import {MapContainer, TileLayer, useMapEvents} from "react-leaflet";
import {fetchAddressFromCoords} from "../../Utils/geocoding.ts";
import type {PartialReport} from "../../types/report.ts";

interface SecondStepProps {
    onStepBack: () => void;
    onSubmit: (report: PartialReport) => void;
}

interface FormErrors{
    title?: string;
    description?: string;
}
interface Localization{
    latitude: number;
    longitude: number;
}




export const AddReportSecondStep = ({onStepBack, onSubmit}: SecondStepProps) => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState("");
    const [photos, setPhotos] = useState<File[]>([]);
    const [photosPreviewUrls, setPhotosPreviewUrls] = useState<string[]>([]);
    const [localization, setLocalization] = useState<Localization>({latitude: 51.505, longitude: -0.09});
    const [address, setAddress] = useState<string>("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);


    function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
        setTitle(event.target.value);
        if(errors.title){
            setErrors({...errors, title: undefined});
        }
    }

    function handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setDescription(event.target.value);
        if(errors.description){
            setErrors({...errors, description: undefined});
        }
    }

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

    const handleMapMove = (lat: number, lng: number) => {
        setLocalization({latitude: lat, longitude: lng});

    };

    useEffect(() => {
        if (!localization) return;

        const timer = setTimeout(async () => {
            const result = await fetchAddressFromCoords(localization.latitude, localization.longitude);

            if(result){
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

    function validateForm(): boolean{
        const newErrors: FormErrors = {};
        let isValid = true;

        if(!title.trim()){
            isValid = false;
            newErrors.title = "Tytuł zgłoszenia jest wymagany"
        }else if(title.trim().length<5){
            isValid = false;
            newErrors.title = "Tytuł zgłoszenia musi mieć co najmniej 5 znaków"
        }

        if(!description.trim()){
            isValid= false;
            newErrors.description = "Opis jest wymagany"
        }

        setErrors(newErrors);
        return isValid;
    }

    function submitForm(event: { preventDefault: () => void; }) {
        event.preventDefault();

        if(!validateForm()){
            return;
        }

        const newReport: PartialReport = {
            title: title,
            description: description,
            latitude: localization.latitude,
            longitude: localization.longitude,
            address: address,
            photos: photos
        }

        onSubmit(newReport);

        //TODO nawigacja do strony głównej
    }

    const MapCenterUpdater = ({onCenterChange}: { onCenterChange: (lat: number, lng: number) => void }) => {
        useMapEvents({
            move: (e) => {
                const center = e.target.getCenter();
                onCenterChange(center.lat, center.lng);
            },
        });
        return null;
    };

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
                                <label className="report-form-label" htmlFor="title">Tytuł zgłoszenia</label>
                                <input type="text" className={`report-form-input ${errors.title ? 'input-error' : ''}`}
                                       placeholder="np. Przepełniony kosz na śmieci" name="title" value={title}
                                       onChange={handleTitleChange}/>
                                {errors.title && <span className="error-message">{errors.title}</span>}

                            </div>
                            <div className="report-form-group">
                                <label className="report-form-label" htmlFor="description">Opis sytuacji</label>
                                <textarea className={`report-form-textarea ${errors.description ? 'input-error' : ''}`} placeholder="Opisz dokładnie problem"
                                          name="description" value={description} onChange={handleDescriptionChange}/>
                                {errors.description && <span className="error-message">{errors.description}</span>}

                            </div>
                            <div className="report-form-group">
                                <label className="report-form-label" htmlFor="photo">Zdjęcie (opcjonalnie)</label>
                                <input type="file" multiple accept="image/jpeg, image/jpg, image/png"
                                       className="report-form-input-photo" id="photo-input"
                                       name="photo" onChange={handlePhotosChange}/>
                                <label className="report-form-label-custom" htmlFor="photo-input">Wybierz zdjęcia</label>
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
                                    <div className="map-center-pin"><FaMapMarkerAlt/></div>
                                    <MapContainer center={[51.505, -0.09]} zoom={13} style={{height: "100%", width: "100%"}}>
                                        <TileLayer attribution='&copy; OpenStreetMap'
                                                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                                        <MapCenterUpdater onCenterChange={handleMapMove}/>
                                    </MapContainer>


                                </div>

                            </div>
                            <div className="report-form-group">
                                <label className="report-form-label">Adres</label>
                                <input type="text" className="report-form-input"
                                       placeholder="Adres zostanie pobrany z mapy" defaultValue={address}/>
                            </div>

                        </div>


                    </div>
                    <button type={"submit"} className="report-form-btn" >WYŚLIJ ZGŁOSZENIE</button>

                </form>


            </div>

        </>
    );
};