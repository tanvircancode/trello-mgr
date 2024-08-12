import React from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

const MoveStage = () => {

    const showStageAction = useSelector((state) => state.showStageAction);
    const showMoveStage = useSelector((state) => state.showMoveStage);

    return (
        <div className="card" style={{width: '18rem'}}>
            <div className="card-header d-flex justify-content-between align-items-center">
                <BsArrowLeftShort />

                <span>Featured</span>
                <div
                    style={{ cursor: "pointer" }}
                    // onClick={handleCloseStageAction}
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
