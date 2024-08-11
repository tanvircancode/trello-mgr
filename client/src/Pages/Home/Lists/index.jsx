import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../config";
import { BsPersonPlus, BsTrash3 } from "react-icons/bs";
import "./lists.scss";
import Card from "../Cards";
import { setStages } from "../../../store";

const List = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [listTitle, setListTitle] = useState("");
    const [showStageAction, setShowStageAction] = useState(false);
    const [stageActionPosition, setStageActionPosition] = useState({
        top: 0,
        left: 0,
    });

    const selectedProject = useSelector((state) => state.selectedProject);

    const userId = localStorage.getItem("user_id");

    const blur = useSelector((state) => state.makeBlur);
    const token = useSelector((state) => state.token);
    const stages = useSelector((state) => state.stages);
    console.log(stages);

    const dispatch = useDispatch();

    const cancelAddList = () => {
        setListTitle("");
    };

    const handleStageAction = (event) => {
        const rect = event.target.getBoundingClientRect();
        setStageActionPosition({ top: rect.bottom + 10, left: rect.left });
        setShowStageAction(true);
    };

    const handleCloseStageAction = () => {
        setShowStageAction(false);
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

    return (
        <div className="d-flex">
            <div className="stage-list d-flex gap-2">
                <div className="d-flex gap-2">
                    {stages &&
                        stages.length > 0 &&
                        stages.map((stage, index) => {
                            return (
                                <div key={index} className={`card custom-card`}>
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
                                            onClick={handleStageAction}
                                        >
                                            ...
                                        </span>
                                    </div>
                                    <Card stage={stage} />
                                </div>
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
                            <li className="list-group-item stage-li-item">
                                Move list
                            </li>
                        </ul>
                    </div>
                )}
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
