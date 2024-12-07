import { useState, useEffect, useRef } from "react";
import { BsChevronLeft, BsXLg } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import {
    setShowMoveStage,
    setShowStageAction,
    setStages,
    setSelectedStage,
} from "../../store";
import "./moveStage.scss";

const MoveStage = ({
    stageListRef,
    savedRect,
    scrollingLeft,
    stageActionPosition,
    setStageActionPosition,
}) => {
    const [moveStageActionPosition, setMoveStageActionPosition] = useState({
        top: 0,
        left: 0,
    });

    const dispatch = useDispatch();
    var stagePos = 0;

    const projects = useSelector((state) => state.projects);
    const selectedProject = useSelector((state) => state.selectedProject);
    const selectedStage = useSelector((state) => state.selectedStage);
    const token = useSelector((state) => state.token);
    const userId = localStorage.getItem("user_id");
    var lats = selectedProject.stages[0];
    // const stages = useSelector((state) => state.stages);
    // console.log(projects);

    const [selectedProjectFromOption, setSelectedProjectFromOption] =
        useState(null);
    const [selectedPosition, setSelectedPosition] = useState("");
    const [selectedProjectFromDropdown, setSelectedProjectFromDropdown] =
        useState(null);

    const handleMoveStageClick = (showMoveStage, showStageAction, source) => {
        if (source === "arrow") {
            setStageActionPosition({ ...stageActionPosition, visible: true });
        } else {
            setStageActionPosition({ ...stageActionPosition, visible: false });
        }
        dispatch(setShowMoveStage({ showMoveStage }));
        dispatch(setShowStageAction({ showStageAction }));
    };

    const handleProjectSelection = async (e) => {
        const selectedProjectId = e.target.value;

        var selectedTempProject = projects.find(
            (project) => project.id == selectedProjectId
        );
        console.log(selectedTempProject);
        lats = selectedTempProject.stages[0];

        //  dispatch(setSelectedStage({ selectedStage: selectedTempProject.stages[0] }));

        setSelectedProjectFromOption(selectedTempProject);
        setSelectedProjectFromDropdown();

        console.log(selectedProject);
        console.log(lats);
    };

    const handleMoveButtonClick = async () => {
        if (!stagePos || stagePos === 0) {
            console.log("IF is running");
            setSelectedPosition(1); // Default to 1
        }
        // else {
        //     setSelectedPosition(stagePos + 1); // Default to stagePos + 1
        // }
        const projectId = selectedProjectFromOption.id;
        const newPosition = selectedPosition;
        const stageId = selectedStage.id;
        const originalPosition = selectedStage.position;
        console.log(newPosition);

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
                console.log(res);
                if (res.data?.status && res.data?.data) {
                    dispatch(setStages({ stages: res.data.data.stages }));
                    dispatch(setShowMoveStage({ showMoveStage: false }));
                    toast.success(res.data.message);
                } else {
                    toast.error("Server is not responding");
                }
            })
            .catch((error) => {
                console.log(error);
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
        setSelectedProjectFromOption(selectedProject);

        setMoveStageActionPosition({
            top: savedRect?.bottom - 100,
            left:
                savedRect?.left -
                stageListRef.current.getBoundingClientRect().left +
                scrollingLeft,
        });
        console.log(selectedProject);
    }, [selectedProject]);

    return (
        <div
            className="card move-stage-card"
            style={{
                top: moveStageActionPosition.top,
                left: moveStageActionPosition.left,
            }}
        >
            <div className="card-header d-flex justify-content-between align-items-center header">
                <BsChevronLeft
                    onClick={() => handleMoveStageClick(false, true, "arrow")}
                />

                <span className="bold-text">Move list</span>

                <BsXLg
                    onClick={() => handleMoveStageClick(false, false, "close")}
                />
            </div>
            <label htmlFor="board" className="bold-text">
                Board
            </label>

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
                        <option key={project.id} value={project.id}>
                            {project.title}
                            {lats?.id == project.id && " (current)"}
                        </option>
                    );
                })}
            </select>

            <br />
            <label htmlFor="board" className="bold-text">
                Position
            </label>

            <select
                className="form-select"
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(Number(e.target.value))}
            >
                {selectedProjectFromOption &&
                    selectedProjectFromOption.stages.map((stage) => {
                        stagePos = stage.position;
                        return (
                            <option
                                selected={
                                    stage.position == selectedStage?.position
                                }
                                key={stage.id}
                                value={stage.position}
                            >
                                {stagePos}
                                {selectedProject.id == lats?.project_id &&
                                    selectedProject?.position == stagePos &&
                                    " (current)"}
                            </option>
                        );
                    })}

                {!stagePos || stagePos === 0
                    ? selectedProjectFromOption &&
                      selectedProjectFromOption.id != selectedProject.id && (
                          <option value={1}>1</option>
                      )
                    : selectedProjectFromOption &&
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
