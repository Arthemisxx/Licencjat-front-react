import '../Views/style/UserAccountView.css'
import {useEffect, useState} from "react";
import type {ReportDetails, UserReportDetailsData} from "../types/report.ts";
import {fetchCurrentUserReports, fetchCurrentUserWatchedReports, toggleWatchReport, fetchUserReportDetails} from "../Utils/api.ts";
import {UserReport} from "./UserReport.tsx";
import {ReportDetailsAdmin} from "../Views/AdminPanel/ReportDetailsAdmin.tsx";

interface ReportsListProps{
    type: string;
}

export const ReportsList = ({type}: ReportsListProps) => {
    const [userReports, setUserReports] = useState<ReportDetails[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>()
    const [selectedReport, setSelectedReport] = useState<ReportDetails | null>(null)
    const [selectedReportId, setSelectedReportId] = useState<number | null>(null)
    const [selectedReportDetails, setSelectedReportDetails] = useState<UserReportDetailsData | null>(null)
    const [isReportLoading, setIsReportLoading] = useState<boolean>(false)
    const [statusToChange, setStatusToChange] = useState<string | null>(null)
    const [noteToChange, setNoteToChange] = useState<string | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

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
        if(!selectedReportDetails) return;

        const previousWatchState = selectedReportDetails.isWatched;
        const newWatchState = !previousWatchState;

        setSelectedReportDetails(prev => prev ? { ...prev, isWatched: !prev.isWatched } : prev);

        setUserReports(prevReports => {
            if (type === "watched" && !newWatchState) {
                return prevReports.filter(report => report.id !== selectedReportDetails.id);
            } else {
                return prevReports.map(report =>
                    report.id === selectedReportDetails.id
                        ? { ...report, isWatched: newWatchState }
                        : report
                );
            }
        });

        try{
            await toggleWatchReport(selectedReportDetails.id);

        }catch(error){
            setSelectedReportDetails(prev => prev ? { ...prev, isWatched: previousWatchState } : prev);

            setUserReports(prevReports => {
                if (type === "watched" && !newWatchState) {
                    return [...prevReports, { ...selectedReportDetails, isWatched: previousWatchState }];
                } else {
                    return prevReports.map(report =>
                        report.id === selectedReportDetails.id
                            ? { ...report, isWatched: previousWatchState }
                            : report
                    );
                }
            });
        }
    }

    const loadReportDetails = async () => {
        setIsReportLoading(true);
        if (selectedReportId === null) return null;

        try {
            const data = await fetchUserReportDetails(selectedReportId);
            setSelectedReportDetails(data);
        } catch (error) {
            console.error("Błąd pobierania raportu:", error);
        } finally {
            setIsReportLoading(false)
        }
    }

    useEffect(() => {
        if (selectedReportId !== null) {
            loadReportDetails();
        }
    }, [selectedReportId]);

    const handleModalClose = () => {
        setNoteToChange(null);
        setStatusToChange(null);
        setSelectedReportId(null);
        setSelectedReportDetails(null);
        setSelectedReport(null);
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <><div className="reports-list">
            {isLoading ? (
                <div className="sp-loading">Ładowanie danych...</div>
            ) : (
                userReports.length === 0 ? (
                    <div className="sp-loading">Brak zgłoszeń</div>
                    ):(
                    userReports.map(report => (
                        <UserReport key={report.id} report={report} onClick={() => {
                            setSelectedReport(report);
                            setSelectedReportId(report.id);
                        }}/>
                    ))
                )

            )}
        </div>

            <ReportDetailsAdmin
                view={"USER"}
                selectedReportId={selectedReportId}
                selectedReport={selectedReportDetails as any}
                isReportLoading={isReportLoading}
                statusToChange={statusToChange}
                noteToChange={noteToChange}
                showDeleteConfirm={showDeleteConfirm}
                onClose={handleModalClose}
                onStatusChange={(value) => setStatusToChange(value)}
                onNoteChange={(value) => setNoteToChange(value)}
                onSaveChanges={() => {}}
                onDeleteClick={handleDeleteClick}
                onDeleteConfirm={() => {
                    setShowDeleteConfirm(false);
                    handleModalClose();
                }}
                onDeleteCancel={handleDeleteCancel}
                onWatchToggle={handleWatchToggle}
            />

        </>


    );
};