import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../config";
import { BsPersonPlus, BsTrash3 } from "react-icons/bs";
import "./lists.scss";

const List = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [listTitle, setListTitle] = useState("");
    const [showStageAction, setShowStageAction] = useState(false);
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

    const handleStageAction = () => {
        setShowStageAction(true);
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
                .post(`${BASE_URL}/api/list/${userId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                    },
                })
                .then((res) => {
                    if (res.data?.status && res.data?.data) {
                        console.log(res.data);
                        // dispatch(
                        //     setTasks({
                        //         tasks: res.data.data.tasks,
                        //     })
                        // );

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
        <div className="card-list d-flex flex-wrap gap-2">
            <div className="d-flex gap-2">
                {stages &&
                    stages.length > 0 &&
                    stages.map((stage, index) => {
                        return (
                            <div key={index} className={`card custom-card`}>
                                <div className="card-body custom-stage-body  d-flex align-items-center">
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
                            </div>
                        );
                    })}
            </div>

            {handleStageAction && (
                // <div>
                <div className="card" style={{ width: "18rem" }}>
                    <div className="d-flex cursor-pointer">
                        <div className="card-header">Featured</div> <div>X</div>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">An item</li>
                        <li className="list-group-item">A second item</li>
                        <li className="list-group-item">A third item</li>
                    </ul>
                </div>
                // </div>
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
    );
};

export default List;
