import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
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
        ...draggableStyle,
        opacity: isDragging ? 0.3 : 1,
        margin: "0 28px 0 0",
        display: "inline-block",
        maxWidth: "250px",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [listTitle, setListTitle] = useState("");
    const [showRect, setShowRect] = useState(null);

    const [stageActionPosition, setStageActionPosition] = useState({
        top: 0,
        left: 0,
        visible: false, // Track visibility
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

    const stageListRef = useRef(null);

    const handleStageAction = (event, stage) => {
        dispatch(setSelectedStage({ selectedStage: stage }));
        const rect = event.target.getBoundingClientRect();
        const scrollContainer = event.currentTarget.closest(".stage-list"); // Get the parent scrollable container
        const scrollLeft = scrollContainer?.scrollLeft || 0;
        setShowRect(rect);
        setStageActionPosition({
            top: rect.bottom + 10,
            left:
                rect.left -
                scrollContainer.getBoundingClientRect().left +
                scrollLeft,
            visible: true, // Show menu
        });
        dispatch(setShowStageAction({ showStageAction: true }));
    };

    const handleCloseStageAction = () => {
        setStageActionPosition({ ...stageActionPosition, visible: false });
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
        let start = result.source.index;
        let end = result.destination.index;
        let projectId = selectedProject.id;

        if (!result.destination || end === start) {
            return;
        }

        // immediately updating stages
        const reorderedStages = Array.from(stages);
        const [movedStage] = reorderedStages.splice(start, 1);
        reorderedStages.splice(end, 0, movedStage);
        dispatch(setStages({ stages: reorderedStages }));

        // new code starts
        var formData = new FormData();
        formData.append("start", start);
        formData.append("end", end);
        formData.append("project_id", projectId);

        await axios
            .put(`${BASE_URL}/api/reorderstage`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            })
            .then((res) => {
                console.log(res.data.data.stages);

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
                dispatch(setStages({ stages }));
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
        const handleScroll = () => {
            setShowStageAction({ showStageAction: false }); // Optional: Close the menu on scroll
        };

        const container = stageListRef.current;
        if (container) container.addEventListener("scroll", handleScroll);

        return () => {
            if (container)
                container.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="d-flex">
            <div
                className="stage-list d-flex gap-2"
                ref={stageListRef}
                style={{
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    position: "relative", // Make this relative for child absolute positioning
                }}
            >
                <div className="d-flex gap-2">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable
                            droppableId="droppable"
                            direction="horizontal"
                        >
                            {(provided) => (
                                <ul
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="d-flex"
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
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided
                                                                .draggableProps
                                                                .style
                                                        )}
                                                    >
                                                        <div
                                                            key={index}
                                                            className="stage-item"
                                                        >
                                                            <div
                                                                className={`card-body custom-stage-body d-flex justify-content-between align-items-center ${
                                                                    blur
                                                                        ? "is-blur disable-pointer-events"
                                                                        : ""
                                                                }`}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <span className="card-title custom-stage-title m-0">
                                                                    {stage &&
                                                                        stage.title}
                                                                </span>
                                                                <span
                                                                    className="stage-horizontal-dots mb-1 cursor-pointer"
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
                                    {provided.placeholder}
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
                                            onChange={(e) =>
                                                setListTitle(e.target.value)
                                            }
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
                                                        {isLoading
                                                            ? "Loading..."
                                                            : "Add List"}
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
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                {stageActionPosition.visible && (
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
            </div>
        </div>
    );
};

export default List;
