import type { AdminUser, UserReportMini } from "../../types/users.ts";
import {AdminUserReportsDetails} from "./AdminUserReportsDetails.tsx";

interface AdminUserDetailsProps {
    user: AdminUser;
    isExpanded: boolean;
    isReportsLoading: boolean;
    expandedReports: UserReportMini[];
    onToggleExpand: (userId: number, reportsCount: number) => void;
    onReportClick?: (reportId: number) => void;
}

export const AdminUserDetails = ({
                                     user,
                                     isExpanded,
                                     isReportsLoading,
                                     expandedReports,
                                     onToggleExpand,
                                     onReportClick,
                                 }: AdminUserDetailsProps) => {
    return (
        // <React.Fragment>
        <>
            <tr
                onClick={() => onToggleExpand(user.id, user.reportsCount)}
                style={{ cursor: user.reportsCount > 0 ? 'pointer' : 'default' }}
            >
                <td>#{user.id}</td>
                <td style={{ fontWeight: 'bold' }}>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>
                    <span style={{
                        color: user.reportsCount > 0 ? 'var(--color-text-main-black)' : 'var(--color-text-gray)',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontWeight: 'bold'
                    }}>
                        {user.reportsCount}
                    </span>
                </td>
                <td className="td-actions">
                    {user.reportsCount > 0 && (
                        <button className="btn-action edit">
                            {isExpanded ? "Zwiń" : "Pokaż zgłoszenia"}
                        </button>
                    )}
                </td>
            </tr>

            {isExpanded && (
                <tr className="nested-row-container">
                    <td colSpan={5} style={{ padding: 0, borderBottom: 'none' }}>
                        <div className="nested-reports-wrapper">
                            {isReportsLoading ? (
                                <div style={{ padding: '20px', textAlign: 'center' }}>Pobieranie zgłoszeń...</div>
                            ) : (
                                <table className="nested-table">
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Opis</th>
                                        <th>Kategoria</th>
                                        <th>Status</th>
                                        <th>Data</th>
                                        <th className="th-actions">Akcje</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {expandedReports.map(report => (
                                        <tr key={report.id}>
                                            <td>{report.id}</td>
                                            <td>{report.description}</td>
                                            <td>{report.categoryName}</td>
                                            <td>{report.status}</td>
                                            <td>{new Date(report.createdAt).toLocaleDateString('pl-PL')}</td>
                                            <td className="td-actions">
                                                <button
                                                    className="btn-action edit"
                                                    onClick={() => onReportClick?.(report.id)}
                                                >
                                                    Szczegóły
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
        // </React.Fragment>
    );
};

