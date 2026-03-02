import './App.css'
import './variables.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Header} from "./Components/Header.tsx";
import {HomeView} from "./Views/HomeView.tsx";
import {MapView} from "./Views/MapView.tsx";
import {AddReportView} from "./Views/AddReportView.tsx";
import {UserAccountView} from "./Views/UserAccountView.tsx";
import {Footer} from "./Components/Footer.tsx";
import {NotFoundView} from "./Views/NotFoundView.tsx";

function App() {

    return (
        <>
                <BrowserRouter>
                    <Header/>
                    <Routes>
                        <Route path="/" element={<><HomeView/><Footer/></>}/>
                        <Route path="/mapa" element={<MapView/>}/>
                        <Route path="/nowe-zgloszenie" element={<AddReportView/>}/>
                        <Route path="/uzytkownik" element={<UserAccountView/>}/>
                        <Route path="*" element={<NotFoundView/>}/>

                    </Routes>
                </BrowserRouter>
        </>
    )
}

export default App
