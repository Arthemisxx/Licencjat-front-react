import {CategoryButton} from "../../Components/CategoryButton.tsx";
import "../style/AddReportView.css";

interface FirstStepProps {
    onCategorySelect: (categoryId: number) => void;
}

export const AddReportFirstStep = ({onCategorySelect}: FirstStepProps) => {
    return (
        <div className="steps-wrapper">
            <div className="report-nav">
                <p></p>
                <p>Krok 1 z 2</p>

            </div>

            <h2>Czego dotyczy problem?</h2>
            <p className="first-step-p">Wybierz odpowiednią kategorię. Pomoże to nam szybciej przekazać sprawę do
                odpowiednich służb miejskich.</p>
            <div className="btns-wrapper">
                <CategoryButton imagePath="lamp.svg" name={"Oświetlenie"}
                                onClick={() => onCategorySelect(1)}></CategoryButton>
                <CategoryButton imagePath="road.svg" name={"Chodniki"}
                                onClick={() => onCategorySelect(2)}></CategoryButton>
                <CategoryButton imagePath="road.svg" name={"Jezdnia"}
                                onClick={() => onCategorySelect(3)}></CategoryButton>
                <CategoryButton imagePath="tree.svg" name={"Mała architektura"}
                                onClick={() => onCategorySelect(4)}></CategoryButton>
                <CategoryButton imagePath="other.svg" name={"Inne"}
                                onClick={() => onCategorySelect(5)}></CategoryButton>

            </div>

        </div>
    )

}