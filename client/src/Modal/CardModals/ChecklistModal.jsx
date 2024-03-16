import { useState, useEffect } from "react";
import "../modal.scss";
import { useDispatch, useSelector } from "react-redux";
import { setMakeCardModalBlur } from "../../store";
import axios from "axios";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

const ChecklistModal = ({ openChecklistModal, setOpenChecklistModal }) => {
    const [title, setTitle] = useState("");
    const userId = localStorage.getItem("user_id");
    const token = useSelector((state) => state.token);
    const fetchSingleCard = useSelector((state) => state.fetchSingleCard);
    console.log(fetchSingleCard);

    const dispatch = useDispatch();

    const cancelModal = () => {
        setOpenChecklistModal(false);

        dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
    };

    const handleAddChecklist = async () => {
        var formData = new FormData();
        formData.append("name", title);
        formData.append("user_id", userId);
        formData.append("task_id", fetchSingleCard.id);

        await axios
            .post(`${BASE_URL}/api/checklist`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            })
            .then((res) => {
                console.log(res);

                // if (res.data.status) {
                //     dispatch(setTasks({ tasks: res.data.project.tasks }));
                //     dispatch(setPriorities({ priorities: res.data.task.priorities }));
                //     // toast.success(res.data.message);
                // } else {
                //     toast.error("Server is not responding");
                // }

                // setTitle("");
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
            <div>
                <label className="form-label">Title</label>
                <input type="email" className="form-control" />
            </div>
            <div
                className={`modal fade ${openChecklistModal ? "show" : ""}`}
                tabIndex="-1"
                role="dialog"
                style={{
                    display: openChecklistModal ? "block" : "none",
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
                                Add Checklist
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
                                onClick={() => handleAddChecklist()}
                            >
                                <span>Add</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ChecklistModal;
