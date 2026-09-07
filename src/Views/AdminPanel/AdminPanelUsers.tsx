import {useEffect, useState} from "react";
import {fetchAdminUsers, fetchUserReportsMini, fetchAdminReportDetails, deleteAdminReport, updateStatus} from "../../Utils/api.ts";
import '../style/AdminPanelView.css'
import type {AdminUser, UserReportMini} from "../../types/users.ts";
import type {AdminReportDetailsData} from "../../types/report.ts";
import React from "react";
import {useSearchParams} from "react-router-dom";
import {AdminUserDetails} from "./AdminUserDetails.tsx";
import {ReportDetailsAdmin} from "./ReportDetailsAdmin.tsx";


export const AdminPanelUsers = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = Number(searchParams.get('page')) || 0;
    const activeSearch = searchParams.get('search') || "";
    const sortConfig = {
        field: searchParams.get('sort') || 'id',
        direction: (searchParams.get('dir') as 'asc' | 'desc') || 'desc'
    };
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchInput, setSearchInput] = useState<string>(activeSearch);
    const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
    const [expandedUserReports, setExpandedUserReports] = useState<UserReportMini[]>([]);
    const [isReportsLoading, setIsReportsLoading] = useState<boolean>(false);
    const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
    const [selectedReport, setSelectedReport] = useState<AdminReportDetailsData | null>(null);
    const [isReportLoading, setIsReportLoading] = useState<boolean>(false);
    const [statusToChange, setStatusToChange] = useState<string | null>(null);
    const [noteToChange, setNoteToChange] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [reload, setReload] = useState<boolean>(true);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

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

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const data = await fetchAdminUsers(currentPage, activeSearch, 10, sortConfig.field, sortConfig.direction);
            setUsers(data.content);
            setTotalPages(data.totalPages > 0 ? data.totalPages : 1);
        } catch (error) {
            console.error("Błąd pobierania użytkowników:", error);
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
            setIsReportLoading(false);
        }
    };

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

    useEffect(() => {
        loadUsers();
        setExpandedUserId(null);
    }, [currentPage, activeSearch, sortConfig.field, sortConfig.direction, reload]);

    useEffect(() => {
        if (selectedReportId !== null) {
            loadReportDetails();
        }
    }, [selectedReportId]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            updateURLParams({search: searchInput, page: 0});
        }
    };

    const handleSort = (field: string) => {
        const isAsc = sortConfig.field === field && sortConfig.direction === 'asc';
        updateURLParams({sort: field, dir: isAsc ? 'desc' : 'asc', page: 0});
    };

    const renderSortIndicator = (field: string) => {
        if (sortConfig.field === field) {
            return sortConfig.direction === 'desc' ? ' ▲' : ' ▼';
        }
        return <span style={{opacity: 0.4}}> ↕</span>;
    };

    const toggleUserExpand = async (userId: number, reportsCount: number) => {
        if (expandedUserId === userId) {
            setExpandedUserId(null);
            return;
        }

        if (reportsCount === 0) {
            return;
        }

        setExpandedUserId(userId);
        setIsReportsLoading(true);
        try {
            const data = await fetchUserReportsMini(userId);
            setExpandedUserReports(data);
        } catch (error) {
            console.error("Błąd pobierania zgłoszeń użytkownika:", error);
        } finally {
            setIsReportsLoading(false);
        }
    };

    return (
        <>
            <div className="admin-toolbar">
                <div className="admin-search">
                    <input
                        type="text"
                        placeholder="Szukaj po nazwisku, emailu..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th onClick={() => handleSort('id')} className="sortable-th">ID {renderSortIndicator('id')}</th>
                        <th onClick={() => handleSort('lastName')} className="sortable-th">Imię i
                            Nazwisko {renderSortIndicator('lastName')}</th>
                        <th onClick={() => handleSort('email')}
                            className="sortable-th">Email {renderSortIndicator('email')}</th>
                        <th className="sortable-th">Zgłoszenia</th>
                        <th className="th-actions">Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={5} style={{textAlign: 'center'}}>Ładowanie użytkowników...</td>
                        </tr>
                    ) : (!users || users.length === 0) ? (
                        <tr>
                            <td colSpan={5} style={{textAlign: 'center'}}>Brak użytkowników do wyświetlenia.</td>
                        </tr>
                    ) : (
                        users.map(user => (
                            <AdminUserDetails
                                key={user.id}
                                user={user}
                                isExpanded={expandedUserId === user.id}
                                isReportsLoading={isReportsLoading}
                                expandedReports={expandedUserReports}
                                onToggleExpand={toggleUserExpand}
                                onReportClick={(reportId) => setSelectedReportId(reportId)}
                            />
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <div className="admin-pagination">
                <button
                    disabled={currentPage === 0 || isLoading}
                    onClick={() => updateURLParams({page: currentPage - 1})}
                >
                    Poprzednia
                </button>
                <span>Strona {currentPage + 1} z {totalPages}</span>
                <button
                    disabled={currentPage >= totalPages - 1 || isLoading}
                    onClick={() => updateURLParams({page: currentPage + 1})}
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

