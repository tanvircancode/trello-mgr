import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../../../config";
import "./lists.scss";
import Card from "../Cards";
import {
    setStages,
    setShowStageAction,
    setShowMoveStage,
    setShowCopyStage,
    setSelectedStage,
} from "../../../store";
import MoveStage from "../../../component/stage/MoveStage";

//new code starts
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const List = () => {
    const getItemStyle = (isDragging, draggableStyle) => ({
        background: isDragging ? "lightgreen" : "grey",
        ...draggableStyle,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [listTitle, setListTitle] = useState("");
    const [showRect, setShowRect] = useState(null);

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
                        dispatch(
                            setStages({
                                stages: res.data.data.stages,
                            })
                        );

                        toast.success(res.data?.message);
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
        }
        setIsLoading(false);
    };

    const handleMoveStageClick = (showMoveStage, showStageAction) => {
        dispatch(setShowMoveStage({ showMoveStage }));
        dispatch(setShowStageAction({ showStageAction }));
    };
    const handleCopyStageClick = (showCopyStage, showStageAction) => {
        dispatch(setShowCopyStage({ showCopyStage }));
        dispatch(setShowStageAction({ showStageAction }));
    };

    const handleDragEnd = async (result) => {
        console.log(result);
        console.log(stages);
        let start = result.source.index;
        let end = result.destination.index;
        let projectId = selectedProject.id;

        if (!result.destination || end === start) {
            return;
        }

        // const items = Array.from(tasks);
        // const [reorderedItem] = items.splice(result.source.index, 1);
        // items.splice(result.destination.index, 0, reorderedItem);
        // reorderTasks(
        //     projectId,
        //     result.source.index + 1,
        //     result.destination.index + 1
        // );

        // setTasks(items);

        // new code starts

        var formData = new FormData();
        formData.append("start", start);
        formData.append("end", end);
        formData.append("project_id", projectId);

        //api
        await axios
            .put(`${BASE_URL}/api/reorderstage`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            })
            .then((res) => {
                console.log(res.data.data.stages);
                // console.log(stages);
                // const items = Array.from(res.data.data.stages);
                // const [reorderedItem] = items.splice(result.source.index, 1);
                // items.splice(result.destination.index, 0, reorderedItem);
                if (res.data?.status && res.data?.data) {
                    dispatch(
                        setStages({
                            stages: res.data.data.stages,
                            // stages: items,
                        })
                    );

                    toast.success(res.data?.message);
                } 
                // else {
                //     toast.error("Server is not responding");
                // }
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

    return (
        <div className="d-flex">
            <div className="stage-list d-flex gap-2">
                <div className="d-flex gap-2">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided) => (
                                <ul
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {stages &&
                                        stages.length > 0 &&
                                        stages.map((stage, index) => (
                                            <Draggable
                                                key={stage.id.toString()}
                                                draggableId={stage.id.toString()}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <li
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="task-item"
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided
                                                                .draggableProps
                                                                .style
                                                        )}
                                                    >
                                                        <div
                                                            key={index}
                                                            // className={`card custom-card`}
                                                            className="task-item-content"
                                                        >
                                                            <div
                                                            // className={`card-body custom-stage-body d-flex justify-content-between align-items-center ${
                                                            //     blur
                                                            //         ? "is-blur disable-pointer-events"
                                                            //         : ""
                                                            // }`}
                                                            >
                                                                <span className="card-title custom-stage-title m-0">
                                                                    {stage &&
                                                                        stage.title}
                                                                </span>
                                                                <span
                                                                    className="stage-horizontal-dots mb-1"
                                                                    onClick={(
                                                                        event
                                                                    ) =>
                                                                        handleStageAction(
                                                                            event,
                                                                            stage
                                                                        )
                                                                    }
                                                                >
                                                                    ...
                                                                </span>
                                                            </div>
                                                            <Card
                                                                stage={stage}
                                                            />
                                                        </div>
                                                    </li>
                                                )}
                                            </Draggable>
                                        ))}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
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
                            <li
                                className="list-group-item stage-li-item"
                                onClick={() =>
                                    handleCopyStageClick(true, false)
                                }
                            >
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
