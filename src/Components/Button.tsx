import {Link} from "react-router-dom";
import "./style/Button.css"

interface ButtonProps {
    buttonType: string,
    content: string,
    route: string
}

export const Button = ({buttonType, content, route}: ButtonProps) => {
    return (
        <Link to={route} className={"btn"}>
            <button className={`button-wrapper ${buttonType}`}>
                <p>{content}</p>
            </button>

        </Link>
    );
};