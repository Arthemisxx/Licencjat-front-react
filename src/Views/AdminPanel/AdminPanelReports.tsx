import '../style/AdminPanelView.css';
import {AdminReportDetails} from "./AdminReportDetails.tsx";
import {ReportDetailsAdmin} from "./ReportDetailsAdmin.tsx";
import { useEffect, useState} from "react";
import type {AdminReport, AdminReportDetailsData} from "../../types/report.ts";
import {deleteAdminReport, fetchAdminReportDetails, fetchAdminReports, updateStatus} from "../../Utils/api.ts";
import {useSearchParams} from "react-router-dom";

export const AdminPanelReports = () => {
    const [reports, setReports] = useState<AdminReport[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 0;
    const activeSearch = searchParams.get('search') || "";
    const sortConfig = {
        field: searchParams.get('sort') || 'createdAt',
        direction: (searchParams.get('dir') as 'asc' | 'desc') || 'desc'
    };
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchInput, setSearchInput] = useState<string>(activeSearch);
    const [selectedReportId, setSelectedReportId] = useState<number | null>(null)
    const [selectedReport, setSelectedReport] = useState<AdminReportDetailsData | null>(null)
    const [isReportLoading, setIsReportLoading] = useState<boolean>(false)
    const [statusToChange, setStatusToChange] = useState<string | null>(null)
    const [noteToChange, setNoteToChange] = useState<string | null>(null)
    const [reload, setReload] = useState<boolean>(true);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);

        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

    const updateURLParams = (updates: Record<string, string | number>) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value === "" || (key === 'page' && value === 0)) {
                newParams.delete(key);
            } else {
                newParams.set(key, String(value));
            }
        });
        setSearchParams(newParams);
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            updateURLParams({ search: searchInput, page: 0 });
        }
    };

    const handleSort = (field: string) => {
        const isAsc = sortConfig.field === field && sortConfig.direction === 'asc';
        updateURLParams({ sort: field, dir: isAsc ? 'desc' : 'asc', page: 0 });
    };


    const loadReports = async () => {
        setIsLoading(true);
        try {
            const data = await fetchAdminReports(currentPage, activeSearch, 5, sortConfig.field, sortConfig.direction);
            setReports(data.content);
            setTotalPages(data.totalPages > 0 ? data.totalPages : 1);
        } catch (error) {
            console.error("Błąd pobierania raportów:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadReportDetails = async () => {
        setIsReportLoading(true);
        if (selectedReportId === null) return null;

        try {
            const data = await fetchAdminReportDetails(selectedReportId);
            setSelectedReport(data);

        } catch (error) {
            console.error("Błąd pobierania raportu:", error);
        } finally {
            setIsReportLoading(false)
        }
    }

    const saveChanges = async () => {
        if (statusToChange === null && noteToChange === null) {
            showToast("Brak zmian do wprowadzenia");
            return;
        }

        if (selectedReportId === null) {
            return;
        }

        await updateStatus(statusToChange, noteToChange, selectedReportId);
        showToast("Zmieniono status zgłoszenia");
        // @ts-ignore
        setSelectedReport(prevState => ({
            ...prevState,
            status: statusToChange,
            adminNote: noteToChange
        }))
        setStatusToChange(null);
        setNoteToChange(null)
        setReload(!reload);
    }

    useEffect(() => {
        loadReports();
    }, [currentPage, activeSearch, sortConfig.field, sortConfig.direction, reload]);

    useEffect(() => {
        if (selectedReportId !== null) {
            loadReportDetails();
        }
    }, [selectedReportId]);


    const renderSortIndicator = (field: string) => {
        if (sortConfig.field === field) {
            return sortConfig.direction === 'desc' ? ' ▲' : ' ▼';
        }
        return <span style={{opacity: 0.4}}> ↕</span>;
    };

    const handleDeleteConfirm = async () => {
        if (selectedReportId === null) return;

        try {
            await deleteAdminReport(selectedReportId);

            showToast("Zgłoszenie zostało trwale usunięte");
            setShowDeleteConfirm(false);
            setSelectedReportId(null);
            setReload(!reload);
        } catch (error) {
            console.error("Błąd usuwania:", error);
            showToast("Wystąpił błąd podczas usuwania");
            setShowDeleteConfirm(false);
        }
    };


    return (
        <>
            <div className="admin-toolbar">
                <div className="admin-search">
                    <input type="text" placeholder="Szukaj po ID, nazwie..." value={searchInput}
                           onChange={(e) => setSearchInput(e.target.value)}
                           onKeyDown={handleSearch}/>
                </div>

            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th onClick={() => handleSort('id')} className="sortable-th">
                            ID {renderSortIndicator('id')}
                        </th>
                        <th onClick={() => handleSort('description')} className="sortable-th">
                            Opis {renderSortIndicator('description')}
                        </th>
                        <th onClick={() => handleSort('category.name')} className="sortable-th">
                            Kategoria {renderSortIndicator('category.name')}
                        </th>
                        <th onClick={() => handleSort('createdAt')} className="sortable-th">
                            Data utworzenia {renderSortIndicator('createdAt')}
                        </th>
                        <th onClick={() => handleSort('status')} className="sortable-th">
                            Status {renderSortIndicator('status')}
                        </th>
                        <th>Autor</th>
                        <th className="th-actions">Akcje</th>
                    </tr>
                    </thead>
                    <tbody>

                    {isLoading ? (
                        <tr>
                            <td colSpan={7} style={{textAlign: 'center'}}>Ładowanie danych...</td>
                        </tr>
                    ) : reports.length === 0 ? (
                        <tr>
                            <td colSpan={7} style={{textAlign: 'center'}}>Brak zgłoszeń do wyświetlenia.</td>
                        </tr>
                    ) : (
                        reports.map(report => (
                            <AdminReportDetails key={report.id} report={report}
                                                onClick={() => setSelectedReportId(report.id)}/>
                        ))
                    )}

                    </tbody>
                </table>
            </div>

            <div className="admin-pagination">
                <button
                    disabled={currentPage === 0 || isLoading}
                    onClick={() => updateURLParams({ page: currentPage - 1 })}
                >
                    Poprzednia
                </button>
                <span>Strona {currentPage + 1} z {totalPages}</span>
                <button
                    disabled={currentPage >= totalPages - 1 || isLoading}
                    onClick={() => updateURLParams({ page: currentPage + 1 })}
                >
                    Następna
                </button>
            </div>


            <ReportDetailsAdmin
                view="ADMIN"
                selectedReportId={selectedReportId}
                selectedReport={selectedReport}
                isReportLoading={isReportLoading}
                statusToChange={statusToChange}
                noteToChange={noteToChange}
                showDeleteConfirm={showDeleteConfirm}
                onClose={() => {
                    setNoteToChange(null);
                    setStatusToChange(null);
                    setSelectedReportId(null);
                }}
                onStatusChange={(value) => setStatusToChange(value)}
                onNoteChange={(value) => setNoteToChange(value)}
                onSaveChanges={saveChanges}
                onDeleteClick={() => setShowDeleteConfirm(true)}
                onDeleteConfirm={handleDeleteConfirm}
                onDeleteCancel={() => setShowDeleteConfirm(false)}
            />

            {toastMessage && (
                <div className="custom-toast">
                    {toastMessage}
                </div>
            )}
        </>
    );
};

