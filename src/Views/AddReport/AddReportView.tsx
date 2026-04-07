import "../style/AddReportView.css";
import {AddReportFirstStep} from "./AddReportFirstStep.tsx";
import {useEffect, useState} from "react";
import type {Category, ReportData} from "../../types/report.ts";
import {AddReportSecondStep} from "./AddReportSecondStep.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";

const AVAILABLE_CATEGORIES: Category[] = [
    {id: 1, name: "Oświetlenie", iconKey: "lamp.svg", colorHex: "#FFCB05"},
    {id: 2, name: "Chodniki", iconKey: "road.svg", colorHex: "#D71920"},
    {id: 3, name: "Jezdnia", iconKey: "road.svg", colorHex: "#D71920"},
    {id: 4, name: "Mała architektura", iconKey: "tree.svg", colorHex: "#10B981"},
    {id: 5, name: "Inne", iconKey: "other.svg", colorHex: "#6B7280"}
];

export const AddReportView = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState<1 | 2>(() => {
        const savedStep = sessionStorage.getItem("reportStep");
        return savedStep ? (parseInt(savedStep) as 1 | 2) : 1;
    });

    const [categoryId, setCategoryId] = useState<number>(() => {
        const savedCategory = sessionStorage.getItem("categoryId");
        return savedCategory ? parseInt(savedCategory) : -1;
    });

    const [searchParams] = useSearchParams();
    const hasInitialLocalization = searchParams.has("lat") && searchParams.has("lng");

    useEffect(() => {
        if(hasInitialLocalization){
            setStep(1);
        }
    }, [hasInitialLocalization]);

    useEffect(() => {
            sessionStorage.setItem("reportStep", step.toString())
    }, [step]);

    useEffect(() => {
        sessionStorage.setItem("categoryId", JSON.stringify(categoryId))
    }, [categoryId]);


    const handleFirstStep = (selectedCategoryId: number) => {
        setCategoryId(selectedCategoryId);
        setStep(2);
    }

    const handleSecondStep = async (report: ReportData) => {


        const finalReportData = {
            authorId: report.authorId,
            categoryId: categoryId,
            description: report.description,
            latitude: report.latitude,
            longitude: report.longitude,
            address: report.address,
            guestEmail: report.guestEmail
        };

        const formData = new FormData();
        formData.append("reportData", new Blob([JSON.stringify(finalReportData)], {type: "application/json"}));

        if (report.photos && report.photos.length > 0) {
            report.photos.forEach(photo => {
                formData.append("images", photo);
            })

        }

        const log = await new Response(formData.get("reportData")).text() ;
        console.log(log);

        try {
            const response = await fetch("http://localhost:8080/reports", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                sessionStorage.removeItem("reportStep");
                sessionStorage.removeItem("category");

                alert("Wysłano zgłoszenie");
                navigate("/mapa");

            }
        } catch (e) {
            alert("Błąd wysyłania zgłoszenia")
        }
    }

    return (
        <div className="report-wrapper">
            {step === 1 && (
                <AddReportFirstStep categories={AVAILABLE_CATEGORIES}
                                    onCategorySelect={handleFirstStep}></AddReportFirstStep>
            )}

            {step === 2 && (

                <>
                    <AddReportSecondStep onStepBack={() => setStep(1)}
                                         onSubmit={handleSecondStep}
                                         categories={AVAILABLE_CATEGORIES}
                                         initialCategoryId={categoryId}></AddReportSecondStep>
                </>
            )}

        </div>
    );
};