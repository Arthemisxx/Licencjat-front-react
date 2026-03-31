import "./style/UserReport.css"

export const UserReport = () => {
    return (
        <div className="user-report-wrapper">
            <div className="report-info">
                <h3>Report name</h3>
                <p>Address</p>
                <p>Data</p>
            </div>
            <div className="report-status">
                <p>STATUS</p>
            </div>
        </div>
    );
};