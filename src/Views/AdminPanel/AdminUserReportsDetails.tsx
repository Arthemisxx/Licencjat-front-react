import type { UserReportMini } from "../../types/users.ts";

interface AdminUserReportsDetailsProps {
    report: UserReportMini;
}

export const AdminUserReportsDetails = ({ report }: AdminUserReportsDetailsProps) => {
    return (
        <tr>
            <td>#{report.id}</td>
            <td>
                {report.description.length > 50
                    ? `${report.description.substring(0, 50)}...`
                    : report.description}
            </td>
            <td>{report.categoryName}</td>
            <td>{new Date(report.createdAt).toLocaleDateString('pl-PL')}</td>
            <td>
                <span className={`status-badge ${report.status === "NOWE" ? 'new' : report.status === 'W TRAKCIE' ? 'in-progress' : report.status === 'ROZWIĄZANE' ? 'resolved' : report.status === 'ODRZUCONE' ? 'rejected' : ''}`}>
                    {report.status}
                </span>
            </td>

        </tr>
    );
};