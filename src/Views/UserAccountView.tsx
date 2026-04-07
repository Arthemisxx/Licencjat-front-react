import "./style/UserAccountView.css"
import {type ChangeEvent, useState} from "react";
import {useAuth} from "../Auth/AuthProvider.tsx";
import { updateUserDetails} from "../Utils/api.ts";
import type {UserUpdatedDetails} from "../types/User.ts";
import {ReportsList} from "../Components/ReportsList.tsx";


export const UserAccountView = () => {
    const [activeTab, setActiveTab] = useState<'reported' | 'watched'>('reported');
    const [editData, setEditData] = useState<boolean>(false);
    const {logout, user, updateCurrentUser} = useAuth();
    const [changedFirstName, setChangedFirstName] = useState<string>("");
    const [changedLastName, setChangedLastName] = useState<string>("");


    const handleLogout = () => {
        logout();
    }

    function handleFirstNameChange(event: ChangeEvent<HTMLInputElement>) {
        setChangedFirstName(event.target.value);
    }

    function handleLastNameChange(event: ChangeEvent<HTMLInputElement>) {
        setChangedLastName(event.target.value);
    }



    async function handleUserDetailsChange() {
        const user: UserUpdatedDetails = {firstName: changedFirstName, lastName: changedLastName};
        await updateUserDetails(user);
        updateCurrentUser();
    }


    return (
        <div className="user-wrapper">
            <div>
                <div className="user-details-wrapper">
                    <h2>Witaj, {user?.firstName || "mieszkańcu"}!</h2>
                    <div className="user-details">
                        <div className="avatar">{user?.firstName?.charAt(0) || "M"}</div>
                        {!editData ? (
                            <p>{user?.firstName || "Brak danych"} {user?.lastName}</p>
                        ) : (
                            <div className="edit-name-wrapper">
                                <input type="text" defaultValue={user?.firstName} onChange={handleFirstNameChange}/>
                                <input type="text" defaultValue={user?.lastName} onChange={handleLastNameChange}/>
                            </div>
                        )}
                        <hr/>

                        <p className="email">Email: </p>
                        <p>{user?.email || "Brak danych"}</p>

                        <div className="btn-edit-user-wrapper">
                            {!editData ? (
                                <button className="btn-edit-user edit-btn"
                                        onClick={() => setEditData(true)}>EDYTUJ</button>

                            ) : (
                                <div className="btns">
                                    <button className="btn-edit-user cancel-btn"
                                            onClick={() => {
                                                handleUserDetailsChange();
                                                setEditData(false)
                                            }}>ZAPISZ
                                    </button>
                                    <button className="btn-edit-user save-btn"
                                            onClick={() => {
                                                setChangedLastName("");
                                                setChangedFirstName("");
                                                setEditData(false);
                                            }
                                                }>ANULUJ
                                    </button>
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
                        <ReportsList type="mine"></ReportsList>
                    )}

                    {activeTab === 'watched' && (
                        <ReportsList type="watched"></ReportsList>
                    )}
                </div>
            </div>


        </div>
    );
};