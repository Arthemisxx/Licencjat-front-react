import "./style/UserAccountView.css"
import {UserReport} from "../Components/UserReport.tsx";
import {useState} from "react";
import {useAuth} from "../Auth/AuthProvider.tsx";


export const UserAccountView = () => {
    const [activeTab, setActiveTab] = useState<'reported' | 'watched'>('reported');
    const [editData, setEditData] = useState<boolean>(false);
    const {logout} = useAuth();

    const handleLogout = () => {
        logout();
    }

    return (
        <div className="user-wrapper">
            <div>
            <div className="user-details-wrapper">
                <h2>Witaj, Anna!</h2>
                <div className="user-details">
                    <div className="avatar">A</div>
                    {!editData ? (
                        <p>Anna Nowak</p>
                    ) : (
                        <input type="text" defaultValue={"Anna Nowak"}/>
                        )}
                    <hr/>

                    <p className="email">Email: </p>
                    {!editData ? (
                        <p>anna.nowak@wp.pl</p>
                    ) : (
                        <input type="email" defaultValue={"anna.nowak@wp.pl"}/>
                    )}

                    <div className="btn-edit-user-wrapper">
                        {!editData ? (
                                <button className="btn-edit-user edit-btn" onClick={() => setEditData(true)}>EDYTUJ</button>

                        ) : (
                            <div className="btns">
                                <button className="btn-edit-user cancel-btn" onClick={() => setEditData(false)}>ZAPISZ</button>
                                <button className="btn-edit-user save-btn" onClick={() => setEditData(false)}>ANULUJ</button>
                            </div>

                        )}
                    </div>
                </div>
            </div>

            <div>
                <button className="btn-logout" onClick={handleLogout}>
                    WYLOGUJ SIĘ
                </button>
            </div>
            </div>

            <div className="reports-card">
                <div className="tabs-header">
                    <div
                        className={`tab ${activeTab === 'reported' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reported')}
                    >
                        Moje zgłoszenia
                    </div>
                    <div
                        className={`tab ${activeTab === 'watched' ? 'active' : ''}`}
                        onClick={() => setActiveTab('watched')}
                    >
                        Obserwowane
                    </div>
                </div>

                <div className="tabs-content">
                    {activeTab === 'reported' && (
                        <div className="reports-list">
                            <UserReport/>
                            <UserReport/>
                            <UserReport/>
                            <UserReport/>
                            <UserReport/>
                            <UserReport/>
                            <UserReport/>
                            <UserReport/>
                            <UserReport/>
                        </div>
                    )}

                    {activeTab === 'watched' && (
                        <div className="reports-list">
                            <UserReport/>
                            <UserReport/>
                        </div>
                    )}
                </div>
            </div>






        </div>
    );
};