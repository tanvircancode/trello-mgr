import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setChecklists, setTasks } from "../../store";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

const EditNameDescModal = ({
    setNameFormText,
    setEditingChecklistId,
    nameFormText,
    editingChecklistId,
    editingTaskId,
    setEditingTaskId,
}) => {
    const userId = localStorage.getItem("user_id");
    const token = useSelector((state) => state.token);

    const dispatch = useDispatch();

    const cancelEditing = () => {
        setNameFormText("");
        setEditingChecklistId(null);
        setEditingTaskId(null);
    };

    const handleSubmit = async () => {
        var formData = new FormData();

        formData.append("user_id", userId);
        formData.append("id", editingChecklistId);
        formData.append("task_id", editingTaskId);
        formData.append("name", nameFormText);

        await axios
            .put(`${BASE_URL}/api/checklist`, formData, {
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
                cancelEditing();
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

    return (
        <div className="card-detail-text w-100">
            <div className="description-form ">
                <textarea
                    className="form-control custom-description-form mb-2"
                    style={{
                        resize: "none",
                        fontSize: "13px",
                    }}
                    rows="2"
                    value={nameFormText}
                    onChange={(e) => setNameFormText(e.target.value)}
                ></textarea>
                <button
                    type="button"
                    className="modal-save"
                    style={{
                        marginRight: "5px",
                    }}
                    onClick={() => handleSubmit()}
                >
                    Save
                </button>
                <button
                    type="button"
                    className="modal-cancel"
                    onClick={() => cancelEditing()}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EditNameDescModal;
