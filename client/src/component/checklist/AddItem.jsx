import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setTasks, setChecklists, setMakeCardModalBlur } from "../../store";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

const AddItem = ({
    addItem,
    setAddItem,
    editingChecklistId,
    setEditingChecklistId,
}) => {
   
    const userId = localStorage.getItem("user_id");
    const token = useSelector((state) => state.token);
    const checklistId = editingChecklistId.id;
    const taskId = editingChecklistId.task_id;

    const [title, setTitle] = useState("");

    const dispatch = useDispatch();
    

    const cancelCreateItem = () => {
        setTitle("");
        setAddItem(false);
        setEditingChecklistId(null);
        dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
    };

    const handleCreateItem = async () => {
        var formData = new FormData();
        formData.append("name", title);
        formData.append("user_id", userId);
        formData.append("checklist_id", checklistId);
        formData.append("task_id", taskId);
        formData.append("is_completed", 0);

        await axios
            .post(`${BASE_URL}/api/item`, formData, {
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
                        setChecklists({ checklists: res.data.task.checklists })
                    );
                    // toast.success(res.data.message);
                } else {
                    toast.error("Server is not responding");
                }
                cancelCreateItem();
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
        <div
            className={`modal fade ${addItem ? "show" : ""}`}
            tabIndex="-1"
            role="dialog"
            style={{
                display: addItem ? "block" : "none",
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
                            Add Checklist Item
                        </h1>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            style={{ marginLeft: 0, fontSize: "10px" }}
                            onClick={() => cancelCreateItem()}
                        ></button>
                    </div>

                    <div className="modal-body">
                        <div className="label-title mb-3">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control checklist-input"
                                style={{ padding: "0.4rem" }}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <button
                            type="button"
                            className="btn btn-primary card-button d-flex align-items-center create-button justify-content-center"
                            disabled={!title}
                            onClick={() => handleCreateItem()}
                        >
                            <span>Add</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddItem;
