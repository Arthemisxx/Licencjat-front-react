import "../style/AddReportView.css";
import {AddReportFirstStep} from "./AddReportFirstStep.tsx";
import {useEffect, useState} from "react";
import type {Category, ReportData} from "../../types/report.ts";
import {AddReportSecondStep} from "./AddReportSecondStep.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {fetchCategories} from "../../Utils/api.ts";

export const AddReportView = () => {
    const navigate = useNavigate();
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

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

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    useEffect(() => {
        const getCategories = async () => {
            setAvailableCategories(await fetchCategories());
        }
        getCategories();
    }, []);

    useEffect(() => {
        if(hasInitialLocalization){
            // eslint-disable-next-line react-hooks/set-state-in-effect
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

                showToast("Wysłano zgłoszenie!");
                setTimeout(() => {
                    navigate("/mapa");
                }, 2000);

            }
        } catch (e) {
            showToast("Błąd wysyłania zgłoszenia");
        }
    }

    return (
        <div className="report-wrapper">
            {step === 1 && (
                <AddReportFirstStep categories={availableCategories}
                                    onCategorySelect={handleFirstStep}></AddReportFirstStep>
            )}

            {step === 2 && (

                <>
                    <AddReportSecondStep onStepBack={() => setStep(1)}
                                         onSubmit={handleSecondStep}
                                         categories={availableCategories}
                                         initialCategoryId={categoryId}></AddReportSecondStep>
                </>
            )}

            {toastMessage && (
                <div className="custom-toast">
                    {toastMessage}
                </div>
            )}

        </div>
    );
};