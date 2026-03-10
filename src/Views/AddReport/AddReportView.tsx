import "../style/AddReportView.css";
import {AddReportFirstStep} from "./AddReportFirstStep.tsx";
import {useEffect, useState} from "react";
import type {PartialReport} from "../../types/report.ts";
import {AddReportSecondStep} from "./AddReportSecondStep.tsx";
import { useNavigate } from "react-router";

export const AddReportView = () => {

    const [step, setStep] = useState<1 | 2>(() => {
        const savedStep = sessionStorage.getItem("reportStep");
        return savedStep ? (parseInt(savedStep) as 1 | 2) : 1;
    });
    const [category, setCategory] = useState<number>(() => {
        const savedData = sessionStorage.getItem("reportData");
        return savedData ? JSON.parse(savedData) : {
            categoryId: -1,
            description: "",
            latitude: 0,
            longitude: 0
        };
    });

    useEffect(() => {
        sessionStorage.setItem("reportStep", step.toString())
    }, [step]);

    useEffect(() => {
        sessionStorage.setItem("category", JSON.stringify(category))
    }, [category]);


    const handleFirstStep = (selectedCategoryId: number) => {
        setCategory(selectedCategoryId);
        setStep(2);
    }

    const handleSecondStep = async (report: PartialReport) => {
        let navigate = useNavigate();
        const finalReportData = {
                categoryId: category,
                title:report.title,
                description:report.description,
                latitude:report.latitude,
                longitude:report.longitude,
                address:report.address
            };

        const formData = new FormData();

        formData.append("reportData", new Blob([JSON.stringify(finalReportData)], {type: "application/json"}));

        if(report.photos && report.photos.length>0){
            report.photos.forEach(photo => {
                formData.append("images", photo);
            })

        }
        try{
            const response = await fetch("http://localhost:8080/reports", {
                method: "POST",
                body: formData
            });

            if(response.ok){
                sessionStorage.removeItem("reportStep");
                sessionStorage.removeItem("category");

                alert("Wysłano zgłoszenie");
                navigate("/");

            }
        }catch(e){
            alert("Błąd wysyłania zgłoszenia")
        }




        setStep(1);
    }

    return (
        <div className="report-wrapper">
            {step === 1 && (
                <AddReportFirstStep onCategorySelect={handleFirstStep}></AddReportFirstStep>
            )}

            {step === 2 && (

                <>

                    <AddReportSecondStep onStepBack={() => setStep(1)}
                                         onSubmit={handleSecondStep}></AddReportSecondStep>
                </>
            )}

        </div>
    );
};