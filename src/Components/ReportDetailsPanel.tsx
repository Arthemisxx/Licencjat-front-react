import {useEffect, useState} from "react";
import {fetchReportDetails, toggleWatchReport} from "../Utils/api.ts";
import type {ReportDetails} from "../types/report.ts";
import './style/ReportDetailsPanel.css';
import {useAuth} from "../Auth/AuthProvider.tsx";
import {Link} from "react-router-dom";

interface ReportDetailsPanelProps {
    reportId: number;
    onClose: () => void;
}

export const ReportDetailsPanel = ({reportId, onClose}: ReportDetailsPanelProps) => {
    const [details, setDetails] = useState<ReportDetails>();
    const [isLoading, setIsLoading] = useState<boolean>();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const data = await fetchReportDetails(reportId);
                setDetails(data);

            } catch (error) {
                console.error("Błąd pobierania szczegółów", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchDetails();
    }, [reportId]);

    const handleWatchToggle = async() => {
        if(!details) return;

        const previousWatchState = details.isWatched;

        setDetails(prev => prev ? { ...prev, isWatched: !prev.isWatched } : prev);

        try{
            await toggleWatchReport(reportId);

        }catch(error){
            setDetails(prev => prev ? { ...prev, isWatched: previousWatchState } : prev);
        }



    }

    return (
        <div className="side-panel open">
            <div className="sp-header">
                <h2 style={{color: details?.categoryColorHex || 'var(--color-text-main-black)'}}>
                    {details?.categoryName || "Szczegóły zgłoszenia"}
                </h2>
                <button className="sp-close-btn" onClick={onClose} aria-label="Zamknij">
                    &times;
                </button>
            </div>

            <div className="sp-content">
                {isLoading ? (
                    <div className="sp-loading">Ładowanie danych...</div>
                ) : details ? (
                    <>
                        <div className="sp-info-group description">
                            <span className="sp-label">Opis</span>
                            <p className="sp-description">{details.description}</p>
                        </div>
                        <div className="sp-info-group-wrapper">
                            <div className="sp-info-group">
                                <span className="sp-label">Data zgłoszenia</span>
                                <span className="sp-value">
                                {new Date(details.createdAt).toLocaleDateString('pl-PL')}
                            </span>
                            </div>
                            <div className="sp-info-group status">
                                <span className="sp-label ">Status</span>
                                <span className={`sp-value status-badge ${details.status === "NOWE" ? 'new' : details.status === 'W TRAKCIE' ? 'in-progress' : details.status === 'ROZWIĄZANE' ? 'resolved' : ''}`}>{details.status}</span>
                            </div>
                        </div>

                        <div className="sp-info-group">
                            <span className="sp-label">Adres</span>
                            <span className="sp-value">{details.address}</span>
                        </div>

                        <div className="sp-info-group photos">
                            <span className="sp-label">Zdjęcia</span>
                            <div className="photos-wrapper">
                                {details.imageUrls && details.imageUrls.length > 0 ? (
                                        details.imageUrls.map(photo => (
                                            <img src={photo} alt="" key={photo} className="sp-thumbnail-photo" onClick={() => setSelectedImage(photo)} />
                                        ))
                                    ) :
                                    (
                                        <span className="sp-value no-photos">Brak zdjęć</span>
                                    )
                                }

                            </div>


                        </div>


                    </>
                ) : (
                    <div className="sp-error">Nie udało się załadować danych.</div>
                )}
            </div>

            <div className="sp-footer">
                {isAuthenticated ? (
                    <button className={`sp-watch ${details?.isWatched ? 'watched' : ''}`} onClick={handleWatchToggle}>
                        {details?.isWatched ? 'OBSERWUJESZ' : 'OBSERWUJ'}
                    </button>
                ): (
                    <p className="sp-watch-link">Chcesz obserwować zgłoszenia?  <Link style={{"fontWeight": "bold"}} to={"/logowanie"}>Zaloguj się</Link></p>
                )}

            </div>

            {selectedImage && (
                <div className="image-modal-overlay" onClick={() => setSelectedImage(null)}>
                    <span className="image-modal-close" onClick={() => setSelectedImage(null)}>&times;</span>
                    <img
                        src={selectedImage}
                        alt="Powiększone zdjęcie"
                        className="image-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

        </div>
    );
};