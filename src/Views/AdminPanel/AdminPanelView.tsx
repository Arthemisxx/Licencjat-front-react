import '../style/AdminPanelView.css';
import {AdminPanelReports} from "./AdminPanelReports.tsx";
import {AdminPanelCategories} from "./AdminPanelCategories.tsx";
import {AdminPanelUsers} from "./AdminPanelUsers.tsx";
import {useSearchParams} from "react-router-dom";

type AdminTab = 'users' | 'reports' | 'categories';

export const AdminPanelView = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get('tab') as AdminTab) || 'reports';

    const handleTabChange = (tab: AdminTab) => {
        setSearchParams({ tab });
    };


    return (
        <div className="admin-wrapper">
            <div className="admin-container">

                <div className="admin-tabs-header">
                    <h2>Panel Administratora</h2>
                    <div className="admin-tabs">
                        <button
                            className={`admin-tab ${activeTab === 'reports' ? 'active' : ''}`}
                            onClick={() => handleTabChange('reports')}
                        >
                            Zgłoszenia
                        </button>
                        <button
                            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => handleTabChange('users')}
                        >
                            Użytkownicy
                        </button>
                        <button
                            className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`}
                            onClick={() => handleTabChange('categories')}
                        >
                            Kategorie
                        </button>
                    </div>
                </div>

                <div className="admin-content">

                    {activeTab === 'reports' ? (
                        <AdminPanelReports></AdminPanelReports>
                    ): activeTab === 'categories' ? (
                        <AdminPanelCategories></AdminPanelCategories>
                    ) : (
                        <AdminPanelUsers></AdminPanelUsers>
                    )}

                </div>
            </div>







        </div>
    );
};