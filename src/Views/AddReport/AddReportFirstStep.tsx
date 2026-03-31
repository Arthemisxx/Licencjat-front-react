import {CategoryButton} from "../../Components/CategoryButton.tsx";
import "../style/AddReportView.css";
import type {Category} from "../../types/report.ts";
import {FaArrowLeft} from "react-icons/fa";
import {useNavigate} from "react-router-dom";

interface FirstStepProps {
    onCategorySelect: (categoryId: number) => void;
    categories: Category[];
}

export const AddReportFirstStep = ({onCategorySelect, categories}: FirstStepProps) => {
    const navigate = useNavigate();

    const stepBack = () => {
        const previousView: string = localStorage.getItem("previousView") || "/";
        navigate(previousView);
    }

    return (
        <div className="steps-wrapper">
            <div className="report-nav">
                <button onClick={stepBack} className="step-back-btn"><FaArrowLeft/></button>
                <p>Krok 1 z 2</p>

            </div>

            <h2>Czego dotyczy problem?</h2>
            <p className="first-step-p">Wybierz odpowiednią kategorię. Pomoże to nam szybciej przekazać sprawę do
                odpowiednich służb miejskich.</p>
            <div className="btns-wrapper">
                {categories.map((category) => (
                    <CategoryButton
                        key={category.id}
                        imagePath={category.iconKey}
                        name={category.name}
                        onClick={() => onCategorySelect(category.id)}
                    />
                ))}

            </div>

        </div>
    )

}