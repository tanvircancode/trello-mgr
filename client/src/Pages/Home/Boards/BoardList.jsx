import "./board.scss";
import { useState } from "react";
import {
    BsPersonPlus,
    BsTrash3,
    BsBarChartSteps,
    BsCheck2Square,
} from "react-icons/bs";
import {  useSelector } from "react-redux";
import Card from "../Cards";

const BoardList = () => {
    const [isSharing, setIsSharing] = useState(false);
    const blur = useSelector((state) => state.makeBlur);

    const handleShare = () => {
        alert('Share')
    }
    return (
        <div className="board-main-content d-flex flex-column">
            <div
                className={`board-header-content d-flex ${
                    blur ? "is-blur disable-pointer-events" : ""
                }`}
            >
                <div className="board-header-name d-flex">
                    <h1 className="board-name m-0">Board Name</h1>
                </div>
                <div className="board-header-button">
                    <button
                        className={`share-button ${isSharing ? "active" : ""}`}
                        onClick={() => handleShare()}
                    >
                        <BsPersonPlus className="share-icon" /> Share
                    </button>
                    <BsTrash3 className="custom-sm-trash-icon" />
                </div>
            </div>

            <div className="card-list d-flex flex-wrap">
                {/* make a loop */}
                <Card />
            </div>
        </div>
    );
};

export default BoardList;
