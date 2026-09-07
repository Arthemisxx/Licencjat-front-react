import {createPortal} from "react-dom";
import {MapContainer, Marker, TileLayer} from "react-leaflet";
import {generateReportPDF} from "../../Utils/generateReport.ts";
import type {AdminReportDetailsData} from "../../types/report.ts";
import {useAuth} from "../../Auth/AuthProvider.tsx";

interface ReportDetailsAdminProps {
    view: string;
    selectedReportId: number | null;
    selectedReport: AdminReportDetailsData | null;
    isReportLoading: boolean;
    statusToChange: string | null;
    noteToChange: string | null;
    showDeleteConfirm: boolean;
    onClose: () => void;
    onStatusChange: (value: string) => void;
    onNoteChange: (value: string) => void;
    onSaveChanges: () => void;
    onDeleteClick: () => void;
    onDeleteConfirm: () => void;
    onDeleteCancel: () => void;
    onWatchToggle?: () => void;
}

export const ReportDetailsAdmin = ({
                                       view,
                                       selectedReportId,
                                       selectedReport,
                                       isReportLoading,
                                       statusToChange,
                                       noteToChange,
                                       showDeleteConfirm,
                                       onClose,
                                       onStatusChange,
                                       onNoteChange,
                                       onSaveChanges,
                                       onDeleteClick,
                                       onDeleteConfirm,
                                       onDeleteCancel,
                                       onWatchToggle,
                                   }: ReportDetailsAdminProps) => {
    const {user} = useAuth();
    const isAdmin = user?.role === "ADMIN";

    if (!selectedReportId) return null;
    console.log(view)

    return (
        <>
            {createPortal(
                <div className="report-modal-overlay" onClick={onClose}>
                    <span
                        className="report-modal-close"
                        onClick={() => {
                            onClose();
                        }}
                    >
                        &times;
                    </span>

                    <div
                        className={`admin-modal-content ${view !== "ADMIN" ? 'user-modal' : 'admin-modal'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {isReportLoading ? (
                            <div style={{textAlign: 'center', marginTop: '50px', fontSize: '18px'}}>
                                Ładowanie danych...
                            </div>
                        ) : (
                            <>
                                <div className="report-modal-header">
                                    <div className="report-modal-title">
                                        <h2>Kategoria: {selectedReport?.categoryName}</h2>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                        <div
                                            className={`report-status-badge ${
                                                selectedReport?.status === 'NOWE'
                                                    ? 'new'
                                                    : selectedReport?.status === 'W TRAKCIE'
                                                        ? 'in-progress'
                                                        : selectedReport?.status === 'ROZWIĄZANE'
                                                            ? 'resolved'
                                                            : selectedReport?.status === 'ODRZUCONE' ? 'rejected' : ''
                                            }`}
                                        >
                                            {selectedReport?.status}
                                        </div>
                                        {onWatchToggle && (
                                            <button
                                                className={`btn-watch-header ${selectedReport?.isWatched ? 'watched' : ''}`}
                                                onClick={onWatchToggle}
                                                title={selectedReport?.isWatched ? 'Przestań obserwować' : 'Obserwuj'}
                                            >
                                                {selectedReport?.isWatched ? 'Obserwujesz' : 'Obserwuj'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="admin-modal-body">
                                    <div className="admin-modal-left">
                                        <div className="admin-section-title">Opis zgłoszenia</div>
                                        <p className="report-description">{selectedReport?.description}</p>

                                        {selectedReport?.imageUrls && selectedReport.imageUrls.length > 0 && (
                                            <div className="report-images-section">
                                                <div className="admin-section-title photos">Załączone zdjęcia</div>
                                                <div className="report-images-grid">
                                                    {selectedReport.imageUrls.map((url, index) => (
                                                        <img key={index} src={url} alt={`Zdjęcie ${index + 1}`}/>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="report-details-grid">
                                            <div className="detail-item">
                                                <span className="detail-label">Data zgłoszenia:</span>
                                                <span className="detail-value">
                                                    {new Date(selectedReport?.createdAt!).toLocaleString('pl-PL')}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Ostatnia modyfikacja:</span>
                                                <span className="detail-value">
                                                    {new Date(selectedReport?.updatedAt!).toLocaleString('pl-PL')}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Adres:</span>
                                                <span className="detail-value">
                                                    {selectedReport?.address || 'Brak dokładnego adresu'}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Lokalizacja:</span>
                                                <p className="detail-value">
                                                    {selectedReport?.longitude.toFixed(4)} N &nbsp;
                                                    {selectedReport?.latitude.toFixed(4)} E
                                                </p>

                                            </div>
                                        </div>

                                        <div className="admin-mini-map-container">
                                            <div className="admin-section-title">Lokalizacja na mapie</div>
                                            <div className="map-placeholder">
                                                {selectedReport?.latitude && selectedReport?.longitude ? (
                                                    <MapContainer
                                                        center={[selectedReport.latitude, selectedReport.longitude]}
                                                        zoom={15}
                                                        scrollWheelZoom={false}
                                                        dragging={false}
                                                        zoomControl={false}
                                                        doubleClickZoom={false}
                                                        style={{
                                                            height: '100%',
                                                            width: '100%',
                                                            zIndex: 1,
                                                        }}
                                                    >
                                                        <TileLayer
                                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        />
                                                        <Marker
                                                            position={[
                                                                selectedReport.latitude,
                                                                selectedReport.longitude,
                                                            ]}
                                                        />
                                                    </MapContainer>
                                                ) : (
                                                    <span>Brak danych o lokalizacji</span>
                                                )}
                                            </div>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${selectedReport?.latitude},${selectedReport?.longitude}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn-google-maps"
                                            >
                                                Pokaż w Google Maps
                                            </a>
                                        </div>
                                    </div>

                                    {view === "ADMIN" && isAdmin && (
                                        <div className="admin-modal-right">
                                            <div
                                                className="admin-author-info"
                                                onClick={() =>
                                                    console.log('Otwórz modal użytkownika: ', selectedReport?.authorId)
                                                }
                                            >
                                                <span className="detail-label">Zgłaszający:</span>
                                                <div className="author-clickable">
                                                    <span
                                                        className="author-name">{selectedReport ? selectedReport.authorName : "Anonimowy"}</span>
                                                </div>
                                                <div>
                                                    <span className="author-name">
                                                        {`${selectedReport?.authorEmail || ''} `}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="admin-actions-panel">
                                                <div className="admin-status-control">
                                                    <label className="detail-label">Zmień status:</label>
                                                    <select
                                                        className="admin-status-select"
                                                        defaultValue={selectedReport?.status}
                                                        onChange={(e) => onStatusChange(e.target.value)}
                                                    >
                                                        <option value="NOWE">NOWE</option>
                                                        <option value="W TRAKCIE">W TRAKCIE</option>
                                                        <option value="ROZWIĄZANE">ROZWIĄZANE</option>
                                                        <option value="ODRZUCONE">ODRZUCONE</option>
                                                    </select>
                                                </div>

                                                <div className="admin-status-control">
                                                    <label className="detail-label">
                                                        Notatka{' '}
                                                        <span className={'smaller'}>
                                                            (niewidoczne dla użytkownika)
                                                        </span>
                                                        :
                                                    </label>
                                                    <input
                                                        className="admin-status-select"
                                                        defaultValue={selectedReport?.adminNote || ''}
                                                        placeholder={'BRAK'}
                                                        onChange={(e) => onNoteChange(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="admin-buttons-grid">
                                                <button
                                                    className="btn-admin-action pdf"
                                                    onClick={() => {
                                                        if (selectedReport) {
                                                            generateReportPDF(selectedReport);
                                                        }
                                                    }}
                                                >
                                                    Generuj PDF
                                                </button>
                                                <button
                                                    className="btn-admin-action delete"
                                                    onClick={onDeleteClick}
                                                >
                                                    Usuń zgłoszenie
                                                </button>
                                                <button
                                                    className={`btn-admin-action save ${
                                                        noteToChange !== null || statusToChange !== null ? 'active' : ''
                                                    }`}
                                                    onClick={onSaveChanges}
                                                >
                                                    Zapisz zmiany
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/*{isAdmin && (*/}
                                {/*    <div className="admin-buttons-grid">*/}

                                {/*        <button*/}
                                {/*            className="btn-admin-action pdf"*/}
                                {/*            onClick={() => {*/}
                                {/*                if (selectedReport) {*/}
                                {/*                    generateReportPDF(selectedReport);*/}
                                {/*                }*/}
                                {/*            }}*/}
                                {/*        >*/}
                                {/*            Generuj PDF*/}
                                {/*        </button>*/}
                                {/*        <button*/}
                                {/*            className="btn-admin-action delete"*/}
                                {/*            onClick={onDeleteClick}*/}
                                {/*        >*/}
                                {/*            Usuń zgłoszenie*/}
                                {/*        </button>*/}
                                {/*        <button*/}
                                {/*            className={`btn-admin-action save ${*/}
                                {/*                noteToChange !== null || statusToChange !== null ? 'active' : ''*/}
                                {/*            }`}*/}
                                {/*            onClick={onSaveChanges}*/}
                                {/*        >*/}
                                {/*            Zapisz zmiany*/}
                                {/*        </button>*/}

                                {/*    </div>*/}
                                {/*)}*/}
                            </>
                        )}
                    </div>
                </div>,
                document.body
            )}

            {showDeleteConfirm &&
                createPortal(
                    <div className="confirm-modal-overlay" onClick={onDeleteCancel}>
                        <div
                            className="confirm-modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3>Potwierdzenie usunięcia</h3>
                            <p>
                                Czy na pewno chcesz trwale usunąć to zgłoszenie? Tej operacji nie można
                                cofnąć.
                            </p>

                            <div className="confirm-modal-actions">
                                <button
                                    className="btn-confirm-cancel"
                                    onClick={onDeleteCancel}
                                >
                                    Anuluj
                                </button>
                                <button
                                    className="btn-confirm-delete"
                                    onClick={onDeleteConfirm}
                                >
                                    Tak, usuń
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};
