import { BsPencil, BsTrash } from "react-icons/bs";
import "../modal.scss";
import { useDispatch, useSelector } from "react-redux";
import { setMakeCardModalBlur, setPriorities, setTasks } from "../../store";
import { useState, useEffect } from "react";
import PriorityEditModal from "./PriorityEditModal";
import { toast } from "react-toastify";
import CreatePriority from "../../component/priority/CreatePriority";
import { DeletePriority } from "../../component/priority/DeletePriority";
import axios from "axios";
import { BASE_URL } from "../../config";

const Prioritymodal = ({ openPriorityModal, setOpenPriorityModal }) => {
    const [priorityTitle, setPriorityTitle] = useState("");
    const [openEditPriorityModal, setOpenEditPriorityModal] = useState(false);

    const [deletingPriority, setDeletingPriority] = useState(null);
    const [editingPriority, setEditingPriority] = useState(null);
    const [selectedPriorityId, setSelectedPriorityId] = useState(null);

    const userId = localStorage.getItem("user_id");
    const token = useSelector((state) => state.token);

    const fetchSingleCard = useSelector((state) => state.fetchSingleCard);
    const priorities = useSelector((state) => state.priorities);

    console.log(fetchSingleCard);
    console.log(priorities);

    //main states
    const [showCreatePriority, setShowCreatePriority] = useState(false);

    const dispatch = useDispatch();

    const cancelModal = () => {
        setOpenPriorityModal(false);
        dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
    };

    const handleEditPriority = (priority) => {
        console.log(priority);
        setOpenEditPriorityModal(true);
        setEditingPriority(priority);
    };

    //new
    const handleCreatePriority = () => {
        if (priorityTitle.length > 50) {
            toast.error("Invalid title");
        } else {
            setShowCreatePriority(true);
        }
    };

    const handleDeletePriority = (priority) => {
        // console.log(priority);
        setDeletingPriority(priority);
    };

    const handleCheckboxChange = async (e, priority) => {
        console.log(priority);
        const priorityId = priority.id;
        const taskId = priority.task_id;


        const isChecked = e.target.checked;
        if (isChecked) {
            setSelectedPriorityId(priority.id);
        } else if (selectedPriorityId === priority.id) {
            setSelectedPriorityId(null);
        }

        var formData = new FormData();
        formData.append("id", priorityId);
        formData.append("user_id", userId);
        formData.append("task_id", taskId);

        await axios
            .put(`${BASE_URL}/api/changepriority`, formData, {
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
                        setPriorities({ priorities: res.data.task.priorities })
                    );
                    // toast.success(res.data.message);
                } else {
                    toast.error("Server is not responding");
                }

           
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
    };

    return (
        <div>
            {showCreatePriority && (
                <CreatePriority
                    title={priorityTitle}
                    setPriorityTitle={setPriorityTitle}
                    setShowCreatePriority={setShowCreatePriority}
                />
            )}

            {deletingPriority && (
                <DeletePriority
                    deletingPriority={deletingPriority}
                    setDeletingPriority={setDeletingPriority}
                />
            )}

            {!openEditPriorityModal && (
                <div
                    className={`modal fade ${openPriorityModal ? "show" : ""} `}
                    tabIndex="-1"
                    role="dialog"
                    style={{
                        display: openPriorityModal ? "block" : "none",
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
                                    Priorities
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
                                {priorities.length > 0 && (
                                    <div className="label-title mb-3">
                                        <label className="form-label">
                                            Options
                                        </label>
                                        {/* loop-here */}
                                        {priorities.map((priority, index) => (
                                            <div
                                                className="d-flex align-items-center gap-3 mb-2"
                                                key={index}
                                            >
                                                <input
                                                    className="form-check-input"
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    type="checkbox"
                                                    checked={priority.is_active}
                                                    onChange={(e) =>
                                                        handleCheckboxChange(
                                                            e,
                                                            priority
                                                        )
                                                    }
                                                    id={`flexCheckChecked-${priority.id}`}
                                                />
                                                
                                                <span
                                                    className="styled-span w-100"
                                                    htmlFor={`flexCheckChecked-${priority.id}`}
                                                    style={{
                                                        backgroundColor:
                                                            priority.color
                                                                ? priority.color
                                                                : "#3B444C",
                                                    }}
                                                >
                                                    {priority.name}
                                                </span>
                                                <BsPencil
                                                    className="edit-priority-pencil"
                                                    onClick={() =>
                                                        handleEditPriority(
                                                            priority
                                                        )
                                                    }
                                                />
                                                <BsTrash
                                                    className="delete-priority-trash"
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        handleDeletePriority(
                                                            priority
                                                        )
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="d-flex align-items-center">
                                    <input
                                        type="text"
                                        className="form-control w-100 priority-input"
                                        placeholder="Add item..."
                                        value={priorityTitle}
                                        onChange={(e) =>
                                            setPriorityTitle(e.target.value)
                                        }
                                    />
                                    <button
                                        className="btn btn-primary priority-add"
                                        type="button"
                                        disabled={!priorityTitle}
                                        onClick={() => handleCreatePriority()}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editingPriority && (
                <PriorityEditModal
                    openEditPriorityModal={openEditPriorityModal}
                    setOpenEditPriorityModal={setOpenEditPriorityModal}
                    setEditingPriority={setEditingPriority}
                    editingPriority={editingPriority}
                />
            )}
        </div>
    );
};

export default Prioritymodal;
