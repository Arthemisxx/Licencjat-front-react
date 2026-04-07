import '../Views/style/UserAccountView.css'
import {useEffect, useState} from "react";
import type {ReportDetails} from "../types/report.ts";
import {fetchCurrentUserReports, fetchCurrentUserWatchedReports, toggleWatchReport} from "../Utils/api.ts";
import {UserReport} from "./UserReport.tsx";
import { createPortal } from 'react-dom';

interface ReportsListProps{
    type: string;
}

export const ReportsList = ({type}: ReportsListProps) => {
    const [userReports, setUserReports] = useState<ReportDetails[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>()
    const [selectedReport, setSelectedReport] = useState<ReportDetails | null>(null)


    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            try {
                if (type === "mine") {
                    const fetchedData = await fetchCurrentUserReports();
                    setUserReports(fetchedData);
                } else if (type === "watched") {
                    const fetchedData = await fetchCurrentUserWatchedReports();
                    setUserReports(fetchedData);
                }
            } catch (error) {
                console.error("Błąd pobierania", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();

    }, [type]);

    const handleWatchToggle = async() => {
        if(!selectedReport) return;

        const previousWatchState = selectedReport.isWatched;
        const newWatchState = !previousWatchState;

        setSelectedReport(prev => prev ? { ...prev, isWatched: !prev.isWatched } : prev);

        setUserReports(prevReports => {
            if (type === "watched" && !newWatchState) {
                return prevReports.filter(report => report.id !== selectedReport.id);
            } else {
                return prevReports.map(report =>
                    report.id === selectedReport.id
                        ? { ...report, isWatched: newWatchState }
                        : report
                );
            }
        });

        try{
            await toggleWatchReport(selectedReport.id);

        }catch(error){
            setSelectedReport(prev => prev ? { ...prev, isWatched: previousWatchState } : prev);

            setUserReports(prevReports => {
                if (type === "watched" && !newWatchState) {
                    return [...prevReports, { ...selectedReport, isWatched: previousWatchState }];
                } else {
                    return prevReports.map(report =>
                        report.id === selectedReport.id
                            ? { ...report, isWatched: previousWatchState }
                            : report
                    );
                }
            });
        }



    }



    return (
        <><div className="reports-list">
            {isLoading ? (
                <div className="sp-loading">Ładowanie danych...</div>
            ) : (
                userReports.length === 0 ? (
                    <div className="sp-loading">Brak zgłoszeń</div>
                    ):(
                    userReports.map(report => (
                        <UserReport key={report.id} report={report} onClick={() => setSelectedReport(report)}/>
                    ))
                )

            )}
        </div>

            {selectedReport && createPortal(
                <div className="report-modal-overlay" onClick={() => setSelectedReport(null)}>
                    <span className="report-modal-close" onClick={() => setSelectedReport(null)}>&times;</span>

                    <div
                        className="report-modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{ borderTopColor: selectedReport.categoryColorHex || 'var(--color-secondary-yellow)' }}
                    >
                        <div className="report-modal-header">
                            <div className="report-modal-title">

                                <h2>{selectedReport.categoryName} </h2>
                            </div>
                            <div className={`report-status-badge ${selectedReport.status === "NOWE" ? 'new' : selectedReport.status === 'W TRAKCIE' ? 'in-progress' : selectedReport.status === 'ROZWIĄZANE' ? 'resolved' : ''}`}>
                                {selectedReport.status}
                            </div>
                        </div>

                        <div className="report-modal-body">
                            <p className="report-description">{selectedReport.description}</p>

                            {selectedReport.imageUrls && selectedReport.imageUrls.length > 0 && (
                                <div className="report-images-section">
                                    <h3>Załączone zdjęcia</h3>
                                    <div className="report-images-grid">
                                        {selectedReport.imageUrls.map((url, index) => (
                                            <img key={index} src={url} alt={`Zgłoszenie ${selectedReport.id} - zdjęcie ${index + 1}`} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="report-details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Lokalizacja:</span>
                                    <span className="detail-value">
                            {selectedReport.address ? selectedReport.address : `${selectedReport.latitude}, ${selectedReport.longitude}`}
                        </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Data zgłoszenia:</span>
                                    <span className="detail-value">{new Date(selectedReport.createdAt).toLocaleDateString('pl-PL')}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Ostatnia zmiana:</span>
                                    <span className="detail-value">{new Date(selectedReport.updatedAt).toLocaleDateString('pl-PL')}</span>
                                </div>
                            </div>


                        </div>

                        <div className="report-modal-actions">
                            <button className={`btn-watch ${selectedReport.isWatched ? 'watched' : ''}`}  onClick={handleWatchToggle}>
                                {selectedReport.isWatched ? 'Obserwujesz' : 'Obserwuj'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>


    );
};