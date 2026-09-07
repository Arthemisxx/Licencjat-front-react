import '../style/AdminPanelView.css';
import type {AdminReport, AdminReportDetailsData} from "../../types/report.ts";
import {generateReportPDF} from "../../Utils/generateReport.ts";
import {fetchAdminReportDetails} from "../../Utils/api.ts";

interface AdminReportDetailsProps {
    report: AdminReport;
    onClick?: () => void
}

export const AdminReportDetails = ({report, onClick}: AdminReportDetailsProps) => {
    let reportDescription: string = report.description;
    const maxLength = 30;
    if(report.description.length>maxLength){
        reportDescription = report.description.slice(0,maxLength) + "...";
    }

    const generatePdf = async() => {
        try {
            const data : AdminReportDetailsData= await fetchAdminReportDetails(report.id);
            generateReportPDF(data);
        }catch (error){
            console.log("Error generating pdf: " + error);
        }
    }

    return (
        <tr >
            <td>{report.id}</td>
            <td className="report-description-grid">{reportDescription}</td>
            <td>{report.categoryName}</td>
            <td>{report.createdAt.toString().slice(0, 10)}</td>
            <td><span className={`status-badge pending  ${report?.status === "NOWE" ? 'new' : report?.status === 'W TRAKCIE' ? 'in-progress' : report?.status === 'ROZWIĄZANE' ? 'resolved' : report?.status === 'ODRZUCONE' ? 'rejected' : ''}`}>{report.status}</span></td>
            <td>{report.authorName}</td>
            <td className="td-actions">
                <button className="btn-action edit" onClick={onClick}>Edytuj</button>
                <button className="btn-action pdf" onClick={generatePdf}>PDF</button>
            </td>
        </tr>
    );
};