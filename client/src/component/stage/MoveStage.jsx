import React, { useState, useEffect } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import {
    setSelectedStage,
    setShowMoveStage,
    setShowStageAction,
    setStages,
} from "../../store";
import "./moveStage.scss";
const MoveStage = ({ showRect }) => {
    const [stageActionPosition, setStageActionPosition] = useState({
        top: 0,
        left: 0,
    });
    const dispatch = useDispatch();
    var stagePos = 0;

    const showStageAction = useSelector((state) => state.showStageAction);
    const showMoveStage = useSelector((state) => state.showMoveStage);
    const projects = useSelector((state) => state.projects);
    const selectedProject = useSelector((state) => state.selectedProject);
    const selectedStage = useSelector((state) => state.selectedStage);
    const token = useSelector((state) => state.token);
    const userId = localStorage.getItem("user_id");
    console.log(selectedStage);

    const [selectedProjectFromOption, setSelectedProjectFromOption] =
        useState(null);
    const [selectedPosition, setSelectedPosition] = useState("");

    const handleMoveStageClick = (showMoveStage, showStageAction) => {
        dispatch(setShowMoveStage({ showMoveStage }));
        dispatch(setShowStageAction({ showStageAction }));
    };

    const handleProjectSelection = async (e) => {
        const selectedProjectId = e.target.value;
        const selectedProject = projects.find(
            (project) => project.id == selectedProjectId
        );

        setSelectedProjectFromOption(selectedProject);
    };

    const handleMoveButtonClick = async () => {
        // console.log(selectedStage);

        // console.log(selectedPosition);
        const projectId = selectedProjectFromOption.id;
        const newPosition = selectedPosition;
        const stageId = selectedStage.id;
        const originalPosition = selectedStage.position;

        const payload = {
            project_id: projectId,
            new_position: newPosition,
            original_position: originalPosition,
            stage_id: stageId,
            user_id: userId,
        };

        await axios
            .put(`${BASE_URL}/api/movestage`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            })
            .then((res) => {
                console.log(res.data);
                if (res.data?.status && res.data?.data) {
                    dispatch(setStages({ stages: res.data.data.stages }));
                    dispatch(setShowMoveStage({ showMoveStage: false }));
                    toast.success(res.data.message);
                } else {
                    toast.error("Server is not responding");
                }
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
    };

    useEffect(() => {
        // const selectedProjectId = selectedProject.id;
        setSelectedProjectFromOption(selectedProject);

        if (showRect && showRect.bottom && showRect.left) {
            setStageActionPosition({
                top: showRect.bottom + 10,
                left: showRect.left,
            });
        }
    }, [showRect]);

    return (
        <div
            className="card"
            style={{
                width: "18rem",
                padding: "0 15px 10px",
                position: "absolute",
                top: stageActionPosition.top,
                left: stageActionPosition.left,
                zIndex: 1000,
            }}
        >
            <div
                className="card-header d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }} 
            >
                <BsArrowLeftShort
                    onClick={() => handleMoveStageClick(false, true)}
                />

                <span>Move list</span>
                <div
                    style={{ cursor: "pointer" }}
                    onClick={() => handleMoveStageClick(false, false)}
                >
                    x
                </div>
            </div>
            <label htmlFor="board">Board</label>
            <select
                value={
                    selectedProjectFromOption
                        ? selectedProjectFromOption.id
                        : ""
                }
                className="form-select"
                onChange={handleProjectSelection}
            > 
                {projects.map((project) => {
                    return (
                        <option    
                            // selected={selectedProject.id == project.id}
                            key={project.id}
                            value={project.id}
                        >
                            {project.title}
                            {selectedProject.id == project.id && " (current)"}
                        </option>
                    );
                })}
            </select>

            <br />
            <label htmlFor="board">Position</label>

            <select
                className="form-select"
                onChange={(e) => setSelectedPosition(e.target.value)}
            >
                {selectedProjectFromOption &&
                    selectedProjectFromOption.stages.map((stage) => {
                        stagePos = stage.position;
                        return (
                            <option
                                selected={
                                    stage.position == selectedStage.position
                                }
                                key={stage.id}
                                value={stage.position}
                            >
                                {stagePos}
                                {selectedStage.position == stagePos &&
                                    " (current)"}
                            </option>
                        );
                    })}
                {selectedProjectFromOption &&
                    selectedProjectFromOption.id != selectedProject.id && (
                        <option value={stagePos + 1}>{stagePos + 1}</option>
                    )}
            </select>

            <button
                onClick={handleMoveButtonClick}
                type="button"
                className="move-button"
            >
                Move
            </button>
        </div>
    );
};

export default MoveStage;
