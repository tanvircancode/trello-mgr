import { useEffect, useState } from "react";
import { BsBarChartSteps, BsCheck2Square } from "react-icons/bs";
import "./cards.scss";
import CardMainModal from "../../../Modal/CardModals/CardMainModal";
import { useDispatch, useSelector } from "react-redux";
import {
    setChecklists,
    setFetchSingleCard,
    setLabels,
    setMakeBlur,
    setPriorities,
    setTasks,
} from "../../../store";
import { toast } from "react-toastify";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import { BASE_URL } from "../../../config";

const Card = () => {
    const isCardsLoading = useSelector((state) => state.isCardsLoading);

    const [openNewCardModal, setOpenNewCardModal] = useState(false);
    const selectedProject = useSelector((state) => state.selectedProject);
    console.log(selectedProject);

    const [cardTitle, setCardTitle] = useState("");

    const blur = useSelector((state) => state.makeBlur);
    const token = useSelector((state) => state.token);
    const tasks = useSelector((state) => state.tasks);
    const userId = localStorage.getItem("user_id");
    const dispatch = useDispatch();

    //store single task's labels, priorities,checklists here
    const handleOpenPopup = (task) => {
        dispatch(setMakeBlur({ makeBlur: true }));
        console.log(task);
        setOpenNewCardModal(true);
        dispatch(setFetchSingleCard({ fetchSingleCard: task }));
        dispatch(setLabels({ labels: task.labels }));
        dispatch(setPriorities({ priorities: task.priorities }));
        dispatch(setChecklists({ checklists: task.checklists }));
    };

    const cancelAddCard = () => {
        setCardTitle("");
    };

    const handleCreateCard = async () => {
        if (cardTitle.length === 0 || cardTitle.length > 50) {
            toast.error("Invalid Title");
        } else {
            var formData = new FormData();
            formData.append("title", cardTitle);
            formData.append("project_id", selectedProject.id);

            //api
            await axios
                .post(`${BASE_URL}/api/task/${userId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                    },
                })
                .then((res) => {
                    console.log(res);

                    if (res.data?.status && res.data?.data) {
                        dispatch(
                            setTasks({
                                tasks: res.data.data.tasks,
                            })
                        );

                        toast.success(res.data?.message);
                    } else {
                        toast.error("Server is not responding");
                    }
                    setCardTitle("");
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
        }
    };

    useEffect(() => {
        dispatch(setMakeBlur({ makeBlur: false }));
    }, []);

    return (
        <div className="card-list d-flex flex-wrap gap-3">
            {isCardsLoading && (
                <div style={{ width: "100px", margin: "50px auto auto" }}>
                    <HashLoader color="#36d7b7" />
                </div>
            )}
            {!isCardsLoading &&
                tasks.length > 0 &&
                tasks.map((task, index) => (
                    <div
                        key={index}
                        className={`card custom-card ${
                            blur ? "is-blur disable-pointer-events" : ""
                        }`}
                        onClick={() => handleOpenPopup(task)}
                    >
                        <div className="card-body">
                            <h5 className="card-title">{task.title}</h5>
                            <div className="d-flex flex-wrap gap-1">
                                {task.labels.length > 0 &&
                                    task.labels.map(
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
                            <div className="desc-label">
                                <BsBarChartSteps className="card-sm-icon" />
                                <BsCheck2Square className="card-sm-icon" />
                            </div>

                            <span>priority</span>
                        </div>
                    </div>
                ))}

            <div className="custom-card">
                <input
                    type="text"
                    className="form-control board-title-input"
                    value={cardTitle}
                    placeholder="Add a task"
                    onChange={(e) => setCardTitle(e.target.value)}
                />
                {cardTitle && (
                    <div className="d-flex align-items-center gap-3 mt-2 ">
                        <button
                            type="button"
                            className="btn btn-primary create-card-button"
                            onClick={handleCreateCard}
                        >
                            <span className="add-card-text">Add Task</span>
                        </button>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            style={{ fontSize: "12px" }}
                            onClick={cancelAddCard}
                        ></button>
                    </div>
                )}
            </div>

            <CardMainModal
                openNewCardModal={openNewCardModal}
                setOpenNewCardModal={setOpenNewCardModal}
            />
        </div>
    );
};

export default Card;