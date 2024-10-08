import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { BASE_URL } from "../../../config";
import { BsPersonPlus, BsTrash3 } from "react-icons/bs";
import "./lists.scss";
import Card from "../Cards";
import {
    setStages,
    setShowStageAction,
    setShowMoveStage,
    setSelectedStage,
} from "../../../store";
import MoveStage from "../../../component/stage/MoveStage";
import DropArea from "../DropArea";

const List = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [listTitle, setListTitle] = useState("");
    const [showRect, setShowRect] = useState(null);
    const [activeCard, setActiveCard] = useState(null);

    const [stageActionPosition, setStageActionPosition] = useState({
        top: 0,
        left: 0,
    });

    const selectedProject = useSelector((state) => state.selectedProject);

    const userId = localStorage.getItem("user_id");

    const blur = useSelector((state) => state.makeBlur);
    const token = useSelector((state) => state.token);
    const stages = useSelector((state) => state.stages);
    // console.log(selectedProject.stages);
    const showStageAction = useSelector((state) => state.showStageAction);
    const showMoveStage = useSelector((state) => state.showMoveStage);

    const dispatch = useDispatch();

    const cancelAddList = () => {
        setListTitle("");
    };

    const handleStageAction = (event, stage) => {
        console.log(stage);
        dispatch(setSelectedStage({ selectedStage: stage }));
        const rect = event.target.getBoundingClientRect();
        setShowRect(rect);
        setStageActionPosition({ top: rect.bottom + 10, left: rect.left });
        dispatch(setShowStageAction({ showStageAction: true }));
    };

    const handleCloseStageAction = () => {
        dispatch(setShowStageAction({ showStageAction: false }));
    };

    const handleCreateList = async () => {
        setIsLoading(true);
        if (listTitle.length === 0 || listTitle.length > 50) {
            toast.error("Invalid Title");
        } else {
            var formData = new FormData();
            formData.append("title", listTitle);
            formData.append("project_id", selectedProject.id);

            //api
            await axios
                .post(`${BASE_URL}/api/stage/${userId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                    },
                })
                .then((res) => {
                    console.log(res.data);
                    if (res.data?.status && res.data?.data) {
                        console.log(res.data);
                        dispatch(
                            setStages({
                                stages: res.data.data.stages,
                            })
                        );

                        toast.success(res.data?.message);
                    } else {
                        toast.error("Server is not responding");
                    }
                    setListTitle("");
                })
                .catch((error) => {
                    if (
                        error.response &&
                        error.response?.status &&
                        error.response.data?.message
                    ) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error("Server is not responding");
                    }
                });
        }
        setIsLoading(false);
    };

    const handleMoveStageClick = (showMoveStage, showStageAction) => {
        dispatch(setShowMoveStage({ showMoveStage }));
        dispatch(setShowStageAction({ showStageAction }));
    };

    const handleDragStart = (e, position) => {
        console.log("dragging " + position);
    };

    const onDrop = (position) => {
        console.log(`${activeCard} is going to its new position ${position}`);

        if(activeCard == null || activeCard == undefined) return;

        const stageToMove = stages[activeCard];
        const updatedStages = stages.filter((stage, index) => index !== activeCard);


    };

    return (
        <div className="d-flex">
            <div className="stage-list d-flex gap-2">
                <div className="d-flex gap-2">
                <DropArea onDrop={() => onDrop(0)} />

                    {stages &&
                        stages.length > 0 &&
                        stages.map((stage, index) => {
                            return (
                                <>
                                    <div
                                        key={index}
                                        className={`card custom-card`}
                                        onDragStart={() => setActiveCard(index)}
                                        onDragEnd={() => setActiveCard(null)}
                                        draggable
                                    >
                                        <div
                                            className={`card-body custom-stage-body d-flex justify-content-between align-items-center ${
                                                blur
                                                    ? "is-blur disable-pointer-events"
                                                    : ""
                                            }`}
                                        >
                                            <span className="card-title custom-stage-title m-0">
                                                {stage && stage.title}
                                            </span>
                                            <span
                                                className="stage-horizontal-dots mb-1"
                                                onClick={(event) =>
                                                    handleStageAction(
                                                        event,
                                                        stage
                                                    )
                                                }
                                            >
                                                ...
                                            </span>
                                        </div>
                                        <Card stage={stage} />
                                    </div>  
                                    <DropArea index={index+1} activeCard={activeCard} onDrop={onDrop} />  
                                </>      
                            );
                        })}
                </div>

                {showStageAction && (
                    <div
                        className="card"
                        style={{
                            width: "18rem",
                            position: "absolute",
                            top: stageActionPosition.top,
                            left: stageActionPosition.left,
                            zIndex: 1000,
                        }}
                    >
                        <div className="card-header d-flex justify-content-between">
                            <span style={{ fontWeight: "600" }}>
                                List Actions
                            </span>
                            <div
                                style={{ cursor: "pointer" }}
                                onClick={handleCloseStageAction}
                            >
                                x
                            </div>
                        </div>

                        <ul className="list-group list-group-flush">
                            <li className="list-group-item stage-li-item">
                                Add card
                            </li>
                            <li className="list-group-item stage-li-item">
                                Copy list
                            </li>
                            <li
                                className="list-group-item stage-li-item"
                                onClick={() =>
                                    handleMoveStageClick(true, false)
                                }
                            >
                                Move list
                            </li>
                        </ul>
                    </div>
                )}

                {showMoveStage && <MoveStage showRect={showRect} />}
                <div className="custom-card-add">
                    <input
                        type="text"
                        className="form-control stage-title-input"
                        value={listTitle}
                        placeholder={
                            stages.length > 0
                                ? "+ Add another list"
                                : "+ Add a list"
                        }
                        onChange={(e) => setListTitle(e.target.value)}
                    />
                    {listTitle && (
                        <div className="d-flex align-items-center gap-3 mt-2 ">
                            <button
                                type="button"
                                className="btn btn-primary create-card-button"
                                disabled={isLoading}
                                onClick={handleCreateList}
                            >
                                <span className="add-card-text">
                                    {isLoading ? "Loading..." : "Add List"}
                                </span>
                            </button>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                disabled={isLoading}
                                style={{ fontSize: "12px" }}
                                onClick={cancelAddList}
                            ></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default List;
