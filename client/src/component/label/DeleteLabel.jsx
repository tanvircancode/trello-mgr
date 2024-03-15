import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLabels, setTasks, setMakeCardModalBlur } from "../../store";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import "./label.scss";

const DeleteLabel = ({ editingLabel, setShowDeleteLabel,setOpenLabelModal,setIsEditLabel, setOpenEditLabelModal}) => {
    console.log(editingLabel);
    const token = useSelector((state) => state.token);
    const labelId = editingLabel.id;
    console.log(token)

    const dispatch = useDispatch();

    const closePopup = () => {
        setShowDeleteLabel(false);
        
    };
    const cancelModalAll = () => {
        setShowDeleteLabel(false);
        setOpenLabelModal(false);
        setIsEditLabel(false);
        setOpenEditLabelModal(false);
        dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
    };

    const handleDeleteButton = async () => {
      
        await axios
            .delete(`${BASE_URL}/api/deletelabel/${labelId}`,  {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
            .then((res) => {
                console.log(res);

                if (res.data.status) {
                    dispatch(setTasks({ tasks: res.data.project.tasks }));
                    dispatch(setLabels({ labels: res.data.task.labels }));
                    // toast.success(res.data.message);
                } else {
                    toast.error("Server is not responding");
                }
                cancelModalAll();
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
            className={`modal fade ${editingLabel ? "show" : ""}`}
            tabIndex="-1"
            role="dialog"
            style={{
                display: editingLabel ? "block" : "none",
            }}
            // aria-hidden={editingLabel === null}
        >
            <div className="modal-dialog">
                <div className="modal-content custom-modal-content">
                    <div className="modal-header custom-modal-bg">
                        <span style={{fontWeight:'600' }}>
                            Delete label
                        </span>

                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            style={{fontSize:'11px'}}
                            onClick={closePopup}
                        ></button>
                    </div>
                    <div
                        className="modal-body custom-modal-body"
                        style={{ textAlign: "left" }}
                    >
                        <h5 className="modal-title mb-2" style={{fontSize:'16px'}}>
                            Do you want to Delete this label?
                        </h5>
                        <button
                            type="button"
                            className="btn btn-primary modal-yes"
                            onClick={handleDeleteButton}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger modal-no"
                            data-bs-dismiss="modal"
                            onClick={closePopup}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteLabel;
