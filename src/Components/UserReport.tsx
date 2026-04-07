import "./style/UserReport.css"
import type {ReportDetails} from "../types/report.ts";

interface UserReportParams {
    report: ReportDetails,
    onClick?: () => void
}

export const UserReport = ({report, onClick}: UserReportParams) => {
    return (
        <div onClick={onClick} className="user-report-wrapper">
            <div className="report-info">
                <h3>{report.description}</h3>
                <p>{report.address}</p>
                <p>{report.createdAt.toString()}</p>
            </div>
            <div className={`report-status ${report.status === "NOWE" ? 'new' : report.status === 'W TRAKCIE' ? 'in-progress' : report.status === 'ROZWIĄZANE' ? 'resolved' : ''}`}>
                <p>{report.status}</p>
            </div>
        </div>
    );
};