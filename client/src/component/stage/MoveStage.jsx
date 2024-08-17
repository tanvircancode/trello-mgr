import React, { useState, useEffect } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setShowMoveStage, setShowStageAction } from "../../store";
const MoveStage = ({ showRect }) => {
    const [stageActionPosition, setStageActionPosition] = useState({
        top: 0,
        left: 0,
    });
    const dispatch = useDispatch();

    const showStageAction = useSelector((state) => state.showStageAction);
    const showMoveStage = useSelector((state) => state.showMoveStage);
    const projects = useSelector((state) => state.projects);
    const selectedProject = useSelector((state) => state.selectedProject);
    console.log(projects);

    const [selectedProjectFromOption, setSelectedProjectFromOption] =
        useState(null);
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState("");

    const handleMoveStageClick = (showMoveStage, showStageAction) => {
        dispatch(setShowMoveStage({ showMoveStage }));
        dispatch(setShowStageAction({ showStageAction }));
    };

    const handleProjectSelection = (e) => {
        const selectedProjectId = e.target.value;
        const selectedProject = projects.find(
            (project) => project.id == selectedProjectId
        );

        setSelectedProjectFromOption(selectedProject);
        console.log(selectedProjectFromOption);
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
                padding: '0 15px 10px',
                position: "absolute",
                top: stageActionPosition.top,
                left: stageActionPosition.left,
                zIndex: 1000,
            }}
        >
            <div className="card-header d-flex justify-content-between align-items-center">
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
            <select className="form-select" onChange={handleProjectSelection}>
                {projects.map((project) => {
                    return (
                        <option
                            selected={selectedProject.id == project.id}
                            key={project.id}
                            value={project.id}
                        >
                            {project.title}
                            {selectedProject.id == project.id && (
                                <span>(current)</span>
                            )}
                        </option>
                    );
                })}
            </select>

            <br />
            <label htmlFor="board">Position</label>

            <select
                class="form-select"
                // onChange={(e) => setSelectedProjectFromOption(e.target.value)}
            >
                {selectedProjectFromOption &&
                    selectedProjectFromOption.stages.map((stage) => {
                        return (
                            <option selected={stage.position} key={stage.id} value={stage.id}>
                                {stage.position} 
                            </option>
                        );
                    })}
            </select>
        </div>
    );
};

export default MoveStage;
