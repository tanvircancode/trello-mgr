import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../modal.scss";
import { useDispatch, useSelector } from "react-redux";
import { setMakeBlur, setProjects } from "../../store";
import { BASE_URL } from "../../config";

const CreateBoardModal = ({
    openCreateBoardModal,
    setOpenCreateBoardModal,
}) => {
    const [boardTitle, setBoardTitle] = useState("");

    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const userId = localStorage.getItem("user_id");

    const cancelModal = () => {
        setBoardTitle("");
        setOpenCreateBoardModal(false);
        dispatch(setMakeBlur({ makeBlur: false }));
    };

    const handleCreateBoard = async () => {
        if (boardTitle.length === 0 || boardTitle.length > 50) {
            toast.error("Invalid Name");
        } else {
            var formData = new FormData();
            formData.append("title", boardTitle);
            formData.append("user_id", userId);

            await axios
                .post(`${BASE_URL}/api/project`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                    },
                })
                .then((res) => {
                    console.log(res);

                    if (res.data.status && res.status === 200) {
                        dispatch(
                            setProjects({ projects: res.data.data.projects })
                        );
                        toast.success(res.data.message);
                    } else {
                        toast.error("Server is not responding");
                    }
                    cancelModal();
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

    return (
       
            
            <div
                className={`modal fade ${openCreateBoardModal ? "show" : ""}`}
                tabIndex="-1"
                role="dialog"
                style={{
                    display: openCreateBoardModal ? "block" : "none",
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
                                Create Project
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
                                <label className="form-label">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    className="form-control board-title-input"
                                    value={boardTitle}
                                    onChange={(e) =>
                                        setBoardTitle(e.target.value)
                                    }
                                />
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary card-button d-flex align-items-center create-button justify-content-center"
                                onClick={handleCreateBoard}
                                disabled={!boardTitle}
                            >
                                <span>Create</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        
    );
};

export default CreateBoardModal;
