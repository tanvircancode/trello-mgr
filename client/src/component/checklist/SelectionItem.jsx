import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
    setChecklists,
    setLabels,
    setTasks,
    setMakeCardModalBlur,
} from "../../store";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

const SelectionItem = ({ selectItem, setSelectItem }) => {
    const getItemDetails = (selectItemProp) => {
        const checklistId = selectItemProp.checklist_id;
        const itemId = selectItemProp.id;
        const name = selectItemProp.name;

        return { checklistId, itemId, name };
    };

    const [title, setTitle] = useState("");
    const token = useSelector((state) => state.token);
    const userId = localStorage.getItem("user_id");

    

    const dispatch = useDispatch();

    const closeModal = () => {
        setSelectItem(null);
        setTitle("");
        dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
    };

    const handleItemChecklist = async () => {
        const { checklistId, itemId, name } = getItemDetails(selectItem);
        var formData = new FormData();

        formData.append("user_id", userId);
        formData.append("id", itemId);
        formData.append("checklist_id", checklistId);
        formData.append("is_completed", selectItem.checked ? 1 : 0);
        formData.append("name", name);

        await axios
            .put(`${BASE_URL}/api/item`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            })
            .then((res) => {
                // console.log(res);

                if (res.data?.project && res.data?.task) {
                    dispatch(setTasks({ tasks: res.data.project.tasks }));
                    dispatch(
                        setChecklists({ checklists: res.data.task.checklists })
                    );
                } else {
                    toast.error("Server is not responding");
                }

                setSelectItem(null);
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

    const handleItemUpdate = async () => {
        const { checklistId, itemId } = getItemDetails(selectItem);

        if (title.length === 0 || title.length > 50) {
            toast.error("Invalid Title");
        } else {
            var formData = new FormData();
            formData.append("user_id", userId);
            formData.append("id", itemId);
            formData.append("checklist_id", checklistId);
            formData.append("name", title);

            await axios
                .put(`${BASE_URL}/api/item`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                    },
                })
                .then((res) => {
                    // console.log(res);

                    if (res.data?.project && res.data?.task) {
                        dispatch(setTasks({ tasks: res.data.project.tasks }));
                        dispatch(
                            setChecklists({
                                checklists: res.data.task.checklists,
                            })
                        );
                    } else {
                        toast.error("Server is not responding");
                    }

                    closeModal();
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
        if (selectItem.checked === true || selectItem.checked === false) {
            handleItemChecklist();
        } else if (selectItem.modal) {
            setTitle(selectItem.name);
        }
    }, [selectItem]);

    return (
        <>
            {selectItem && selectItem.modal && (
                <div
                    className={`modal fade ${selectItem.modal ? "show" : ""}`}
                    tabIndex="-1"
                    role="dialog"
                    style={{
                        display: selectItem.modal ? "block" : "none",
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
                                    Update Item
                                </h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    style={{ marginLeft: 0, fontSize: "10px" }}
                                    onClick={() => closeModal()}
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
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-primary card-button d-flex align-items-center create-button justify-content-center"
                                    disabled={!title}
                                    onClick={() => handleItemUpdate()}
                                >
                                    <span>Update</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SelectionItem;
