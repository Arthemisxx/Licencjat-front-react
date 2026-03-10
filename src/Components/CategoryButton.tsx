import "./style/CategoryButton.css"

interface CategoryButtonProps {
    imagePath: string,
    name: string,
    onClick: () => void;
}

export const CategoryButton = ({imagePath, name, onClick}: CategoryButtonProps) => {
    const path = `../../public/categories/${imagePath}`

    return (
            <button className={"category-btn"} onClick={onClick}>
                <div className={"category-btn-wrapper"}>
                    <img src={path} alt={name} className="btn-img"/>
                    <p>{name}</p>
                </div>

            </button>
    )
}