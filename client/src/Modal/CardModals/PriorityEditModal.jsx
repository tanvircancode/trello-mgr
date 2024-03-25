import "../modal.scss";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { BlockPicker } from "react-color";
import axios from "axios";
import { BASE_URL } from "../../config";
import { setPriorities, setTasks } from "../../store";

const PriorityEditModal = ({
    openEditPriorityModal,
    setOpenEditPriorityModal,
    setEditingPriority,
    editingPriority,
}) => {
    

    const [labelColor, setLabelColor] = useState("#f44336");
    const [title, setTitle] = useState("");

    const userId = localStorage.getItem("user_id");
    const token = useSelector((state) => state.token);
    const priorityId = editingPriority.id;

    const dispatch = useDispatch();

    const handleChangeComplete = (color) => {
        setLabelColor(color.hex);
    };

    var colors = [
        "#94C748",
        "#e91e63",
        "#FFAB4A",
        "#F2D600",
        "#3f51b5",
        "#2196f3",
        "#03a9f4",
        "#424242",
        "#1F2022",
        "#4b6387",
        "#C02942",
        "#007BFF",
        "#009688",
        "#795548",
        "#607d8b",
    ];

    const cancelModal = () => {
        setOpenEditPriorityModal(false);
    };

    const handleUpdatePriority = async () => {
     
        if (title.length === 0 || title.length > 50) {
            toast.error("Invalid title");
        } else {
            var formData = new FormData();
            formData.append("name", title);
            formData.append("color", labelColor);
            formData.append("user_id", userId);
            formData.append("id", priorityId);
            formData.append("task_id", editingPriority.task_id);

            await axios
                .put(`${BASE_URL}/api/priority`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                    },
                })
                .then((res) => {
                    // console.log(res);

                    if (res.data.status) {
                        dispatch(setTasks({ tasks: res.data.project.tasks }));
                        dispatch(
                            setPriorities({
                                priorities: res.data.task.priorities,
                            })
                        );
                        //     // toast.success(res.data.message);
                    } else {
                        toast.error("Server is not responding");
                    }
                    setEditingPriority(null);
                    setOpenEditPriorityModal(false);
                })
                .catch((error) => {
                    // console.log(error)
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
        if (editingPriority) {
            setTitle(editingPriority.name);
            setLabelColor(editingPriority.color);
        }
    }, [editingPriority]);

    return (
        <div>
            <div
                className={`modal fade ${openEditPriorityModal ? "show" : ""}`}
                tabIndex="-1"
                role="dialog"
                style={{
                    display: openEditPriorityModal ? "block" : "none",
                    marginTop: "2em",
                }}
            >
                <div className="modal-dialog modal-sm custom-modal-width">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1
                                className="modal-title fs-6 text-center"
                                style={{ margin: "0 auto" }}
                            >
                                Edit Priority
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                style={{ marginLeft: 0, fontSize: "10px" }}
                                onClick={cancelModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="label-title mb-3">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control label-input"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                    }}
                                />
                            </div>

                            <BlockPicker
                                colors={colors}
                                color={labelColor || "#9c27b0"}
                                onChangeComplete={handleChangeComplete}
                            />

                            <button
                                type="button"
                                className="btn btn-primary create-button mt-3"
                                disabled={!title && !labelColor}
                                onClick={() => handleUpdatePriority()}
                            >
                                <span>Update</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriorityEditModal;
