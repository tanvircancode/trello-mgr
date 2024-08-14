import React from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setShowMoveStage, setShowStageAction } from "../../store";
const MoveStage = () => {
    const dispatch = useDispatch();

    const showStageAction = useSelector((state) => state.showStageAction);
    const showMoveStage = useSelector((state) => state.showMoveStage);

    const handleMoveStageClick = (showMoveStage, showStageAction) => {
        dispatch(setShowMoveStage({ showMoveStage }));
        dispatch(setShowStageAction({ showStageAction }));
    };

    return (
        <div className="card" style={{ width: "18rem" }}>
            <div className="card-header d-flex justify-content-between align-items-center">
                <BsArrowLeftShort
                    onClick={() => handleMoveStageClick(false, true)}
                />

                <span>Featured</span>
                <div
                    style={{ cursor: "pointer" }}
                    onClick={() => handleMoveStageClick(false, false)}
                >
                    x
                </div>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">An item</li>
                <li className="list-group-item">A second item</li>
                <li className="list-group-item">A third item</li>
            </ul>
        </div>
    );
};

export default MoveStage;
