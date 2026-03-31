import './App.css'
import './variables.css'
import {Route, Routes} from "react-router-dom";
import {Header} from "./Components/Header.tsx";
import {HomeView} from "./Views/HomeView.tsx";
import {MapView} from "./Views/MapView.tsx";
import {AddReportView} from "./Views/AddReport/AddReportView.tsx";
import {UserAccountView} from "./Views/UserAccountView.tsx";
import {Footer} from "./Components/Footer.tsx";
import {NotFoundView} from "./Views/NotFoundView.tsx";
import {Login} from "./Views/Login/Login.tsx";
import {Register} from "./Views/Login/Register.tsx";
import {AuthProvider} from "./Auth/AuthProvider.tsx";

function App() {

    return (
        <>
            <AuthProvider>
                    <Routes>
                        <Route path="/" element={<><Header/><HomeView/><Footer/></>}/>
                        <Route path="/mapa" element={<><Header/><MapView/></>}/>
                        <Route path="/nowe-zgloszenie" element={<><Header/><AddReportView/></>}/>
                        <Route path="/uzytkownik" element={<><Header/><UserAccountView/><Footer/></>}/>
                        <Route path="*" element={<><Header/><NotFoundView/><Footer/></>}/>
                        <Route path="/logowanie" element={<Login/>}/>
                        <Route path="/rejestracja" element={<Register/>}/>
                    </Routes>
            </AuthProvider>

        </>
    )
}

export default App
