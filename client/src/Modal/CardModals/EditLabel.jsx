import { useState, useEffect } from "react";
import "../modal.scss";
import { useDispatch, useSelector } from "react-redux";
import { setMakeCardModalBlur, setLabels, setTasks } from "../../store";
import { toast } from "react-toastify";
import axios from "axios";
import { BsPencil } from "react-icons/bs";
import LabelModal from "./LabelModal";
import { BASE_URL } from "../../config";

const EditLabel = ({ openEditLabelModal, setOpenEditLabelModal }) => {
    const [openLabelModal, setOpenLabelModal] = useState(false);
    const [isEditLabel, setIsEditLabel] = useState(false);
    const [editingLabel, setEditingLabel] = useState(null);
    const [isCreateLabel, setIsCreateLabel] = useState(false);

    const token = useSelector((state) => state.token);
    const userId = localStorage.getItem("user_id");

    const dispatch = useDispatch();

    const labels = useSelector((state) => state.labels);
    console.log(labels);

    const handleCheckboxChange = async (labelId, checked) => {
        await axios
            .put(
                `${BASE_URL}/api/label/${labelId}`,
                { is_active: checked ? 1 : 0, user_id: userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                    },
                }
            )
            .then((res) => {
                //    console.log(res);

                if (res.data?.project && res.data?.task) {
                    dispatch(setTasks({ tasks: res.data.project.tasks }));
                    dispatch(setLabels({ labels: res.data.task.labels }));
                } else {
                    toast.error("Server is not responding");
                }
                // setOpenLabelModal(false);
                //  dispatch(setMakeBlur({makeBlur:false}));
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

    const cancelModal = () => {
        setOpenEditLabelModal(false);

        dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
    };

    const handleCreateLabel = () => {
        setOpenLabelModal(true);
        setIsCreateLabel(true);
    };

    const handleEditLabel = (label) => {
        setEditingLabel(label);
        setOpenLabelModal(true);
        setIsEditLabel(true);
    };

    return (
        <div>
            {!editingLabel && !isCreateLabel && (
                <div
                    className={`modal fade ${openEditLabelModal ? "show" : ""}`}
                    tabIndex="-1"
                    role="dialog"
                    style={{
                        display: openEditLabelModal ? "block" : "none",
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
                                    Labelssss
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
                                    <label className="form-label">Labels</label>
                                    <div className="d-flex flex-column gap-3">
                                        {labels.map((label, index) => (
                                            <div
                                                className="d-flex align-items-center gap-3"
                                                key={index}
                                            >
                                                <input
                                                    className="form-check-input"
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    type="checkbox"
                                                    checked={label.is_active}
                                                    onChange={(e) =>
                                                        handleCheckboxChange(
                                                            label.id,
                                                            e.target.checked
                                                        )
                                                    }
                                                    id={`flexCheckChecked-${label.id}`}
                                                />
                                                <span
                                                    className="styled-span w-100"
                                                    htmlFor={`flexCheckChecked-${label.id}`}
                                                    style={{
                                                        backgroundColor:
                                                            label.color
                                                                ? label.color
                                                                : "#3B444C",
                                                    }}
                                                >
                                                    {label?.name}
                                                </span>
                                                <BsPencil
                                                    className="edit-label-pencil"
                                                    onClick={() =>
                                                        handleEditLabel(label)
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-primary card-button d-flex align-items-center create-button justify-content-center"
                                    onClick={() => handleCreateLabel()}
                                >
                                    <span>Create label</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <LabelModal
                openLabelModal={openLabelModal}
                setOpenLabelModal={setOpenLabelModal}
                isEditLabel={isEditLabel}
                setIsEditLabel={setIsEditLabel}
                openEditLabelModal={openEditLabelModal}
                setOpenEditLabelModal={setOpenEditLabelModal}
                editingLabel={editingLabel}
                setEditingLabel={setEditingLabel}
                isCreateLabel={isCreateLabel}
                setIsCreateLabel={setIsCreateLabel}
            />
        </div>
    );
};

export default EditLabel;
