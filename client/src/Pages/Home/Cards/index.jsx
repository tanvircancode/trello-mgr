import { useEffect, useState } from "react";
import { BsBarChartSteps, BsCheck2Square } from "react-icons/bs";
import "./cards.scss";
import CardMainModal from "../../../Modal/CardModals/CardMainModal";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import {
    setChecklists,
    setFetchSingleCard,
    setLabels,
    setMakeBlur,
    setPriorities,
    setSelectedTaskMembers,
    setStages,
    setNewStageId
} from "../../../store";
import { toast } from "react-toastify";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import { BASE_URL } from "../../../config";

const Card = ({ stage }) => {
    var newId = stage.id;
    // const [newStage, setNewStage] = useState(null);
    const [tasks, setTasks] = useState(stage.tasks || []);
    const stageId = stage.id;
    const isCardsLoading = useSelector((state) => state.isCardsLoading);
    const [isLoading, setIsLoading] = useState(false);
    const [openNewCardModal, setOpenNewCardModal] = useState(false);
    const [cardTitle, setCardTitle] = useState("");
    const selectedProject = useSelector((state) => state.selectedProject);
    const blur = useSelector((state) => state.makeBlur);
    const token = useSelector((state) => state.token);
    const userId = localStorage.getItem("user_id");
    const newStageId = useSelector((state) => state.newStageId);
    const dispatch = useDispatch();

    //store single task's labels, priorities,checklists here
    const handleOpenPopup = (task) => {
        dispatch(setMakeBlur({ makeBlur: true }));
        setOpenNewCardModal(true);
        dispatch(setFetchSingleCard({ fetchSingleCard: task }));
        dispatch(setLabels({ labels: task.labels }));
        dispatch(setPriorities({ priorities: task.priorities }));
        dispatch(setChecklists({ checklists: task.checklists }));
        dispatch(setSelectedTaskMembers({ selectedTaskMembers: task.users }));
    };

    const cancelAddCard = () => {
        setCardTitle("");
    };

    const handleCreateCard = async () => {
        setIsLoading(true);
        if (cardTitle.length === 0 || cardTitle.length > 50) {
            toast.error("Invalid Title");
        } else {
            var formData = new FormData();
            formData.append("title", cardTitle);
            formData.append("list_id", stage.id);
            // formData.append("project_id", selectedProject.id);

            //api
            await axios
                .post(`${BASE_URL}/api/task/${userId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                    },
                })
                .then((res) => {
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
                    setCardTitle("");
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



    const getItemStyle = (isDragging, draggableStyle) => ({
        ...draggableStyle,
        opacity: isDragging ? 0.3 : 1,
        // margin: "0 28px 0 0",
        display: "inline-block",
        maxWidth: "250px",
    });



    const handleDragEnd = async (result) => {
        

        console.log(result);
       

        let start = result.source?.index;
        let end = result.destination?.index;
        let projectId = selectedProject.id;
        console.log(stage);

        if (!result.destination || end === start) {
            return;
        }

        // immediately updating tasks
        const reorderedTasks = Array.from(tasks);
        const [movedTask] = reorderedTasks.splice(start, 1);
        reorderedTasks.splice(end, 0, movedTask);
        setTasks(reorderedTasks);

        // console.log(reorderedTasks);
        // new code starts
        var formData = new FormData();
        formData.append("start", start);
        formData.append("end", end);
        formData.append("project_id", projectId);
        formData.append("list_id", stageId);

        await axios
            .put(`${BASE_URL}/api/reordertask`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            })
            .then((res) => {
                // console.log(res.data.data.stages);
                // console.log(tasks);

                if (res.data?.status && res.data?.data) {
                    var newStages = res.data.data?.stages;

                    dispatch(
                        setStages({
                            stages: newStages,
                        })
                    );

                    var updatedStage = newStages.find(
                        (stage) => stage.id === stageId
                    );
                    setTasks(updatedStage.tasks);
                    // console.log(updatedStage.tasks);
                    // toast.success(res.data?.message);
                } else {
                    toast.error("Server is not responding");
                }
            })
            .catch((error) => {
                setTasks(stage.tasks);

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

    const handleDragEnter = (result) => {
        console.log(result);
    }

    const handleStageHover = (result) => {
        // console.log(result);

    }

    useEffect(() => {
        // console.log("New Stage ID:", newStageId);
        setTasks(stage.tasks);
        dispatch(setMakeBlur({ makeBlur: false }));
    }, [stage, newStageId]);

    return (
        <DragDropContext
            onDragEnd={handleDragEnd}
        >
            <Droppable
                droppableId="droppable"
                direction="vertical"
                onDragEnter={handleDragEnter}
            >
                {(provided) => (
                    <div
                        // onMouseOver={() => handleStageHover(stage.id)}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="card-list d-flex flex-wrap gap-2">
                        {isCardsLoading && (
                            <div style={{ width: "100px", margin: "50px auto auto" }}>
                                <HashLoader color="#36d7b7" />
                            </div>
                        )}

                        {!isCardsLoading &&
                            tasks &&
                            tasks.length > 0 &&
                            tasks.map((task, index) => {
                                const activePriority = task.priorities.find(
                                    (priority) => priority.is_active
                                );

                                // Calculated total checklist items
                                let totalChecklistItems = 0;
                                task.checklists.forEach((checklist) => {
                                    totalChecklistItems += checklist.checklistitems.length;
                                });

                                // Calculated total checked items
                                let totalCheckedItems = 0;
                                task.checklists.forEach((checklist) => {
                                    checklist.checklistitems.forEach((item) => {
                                        if (item.is_completed) {
                                            totalCheckedItems++;
                                        }
                                    });
                                });

                                return (
                                    <Draggable
                                        key={task.id.toString()}
                                        draggableId={task.id.toString()}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                {...provided.draggableProps}
                                                ref={provided.innerRef}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided
                                                        .draggableProps
                                                        .style
                                                )}

                                                className={`card custom-card ${blur ? "is-blur disable-pointer-events" : ""
                                                    }`}
                                                onClick={() => handleOpenPopup(task)}
                                            >
                                                <div
                                                    key={index}
                                                    className="card-body d-flex flex-column"
                                                    style={{ padding: "7px" }}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <h5 className="card-title custom-card-title">
                                                        {task && task.title}
                                                    </h5>
                                                    {task?.labels.some(
                                                        (label) => label.is_active
                                                    ) &&
                                                        task?.labels.length > 0 && (
                                                            <div className="d-flex flex-wrap gap-2 custom-card-label">
                                                                {task.labels.map(
                                                                    (label, index) =>
                                                                        label.is_active && (
                                                                            <span
                                                                                className="label-color-small"
                                                                                key={index}
                                                                                style={{
                                                                                    backgroundColor:
                                                                                        label.color !==
                                                                                            null &&
                                                                                            label.color !==
                                                                                            "null"
                                                                                            ? label.color
                                                                                            : "#3B444C",
                                                                                }}
                                                                            ></span>
                                                                        )
                                                                )}
                                                            </div>
                                                        )}
                                                    {(task?.description ||
                                                        totalChecklistItems > 0) && (
                                                            <div
                                                                className=" d-flex align-items-center"
                                                                style={{ marginBottom: "7px" }}
                                                            >
                                                                {task?.description && (
                                                                    <BsBarChartSteps className="card-sm-icon" />
                                                                )}
                                                                {totalChecklistItems > 0 && (
                                                                    <div className="d-flex align-items-center">
                                                                        <BsCheck2Square className="card-sm-icon" />
                                                                        <span className="checked-items-count">
                                                                            {totalCheckedItems}/
                                                                            {totalChecklistItems}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                    {activePriority && (
                                                        <span
                                                            className="label-color-small small-card-priority"
                                                            style={{
                                                                backgroundColor:
                                                                    activePriority?.color,
                                                            }}
                                                        >
                                                            {activePriority?.name}
                                                        </span>
                                                    )}
                                                    {task?.users && task.users.length > 0 && (
                                                        <span style={{ marginLeft: "auto" }}>
                                                            {task.users.map((member, index) => {
                                                                const memberName = member.name
                                                                    .split(" ")
                                                                    .map((word) => word[0])
                                                                    .join("");

                                                                return (
                                                                    <button
                                                                        key={index}
                                                                        className="circular-button-all-tasks"
                                                                        style={{
                                                                            backgroundColor:
                                                                                "#56aaed",
                                                                        }}
                                                                    >
                                                                        {memberName}
                                                                    </button>
                                                                );
                                                            })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                        {provided.placeholder}
                        <div
                            className={`custom-card ${blur ? "is-blur disable-pointer-events" : ""
                                }`}
                        >
                            <input
                                type="text"
                                className="form-control custom-task-placeholder p-0"
                                value={cardTitle}
                                placeholder="+ Add a task"
                                onChange={(e) => setCardTitle(e.target.value)}
                            />
                            {cardTitle && (
                                <div className="d-flex align-items-center gap-1 mt-2 ">
                                    <button
                                        type="button"
                                        className="btn btn-primary create-card-button"
                                        disabled={isLoading}
                                        onClick={handleCreateCard}
                                    >
                                        <span className="add-card-text">
                                            {isLoading ? "Loading..." : "Add task"}
                                        </span>
                                    </button>
                                    {!isLoading && (
                                        <button
                                            type="button"
                                            className="btn-close"
                                            aria-label="Close"
                                            disabled={isLoading}
                                            style={{ fontSize: "12px" }}
                                            onClick={cancelAddCard}
                                        ></button>
                                    )}
                                </div>
                            )}
                        </div>


                        <CardMainModal
                            openNewCardModal={openNewCardModal}
                            setOpenNewCardModal={setOpenNewCardModal}
                        />
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default Card;