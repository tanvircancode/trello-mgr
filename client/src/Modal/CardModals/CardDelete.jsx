import "../modal.scss";
import { useDispatch, useSelector } from "react-redux";
import {
    setMakeCardModalBlur,
    setProjects,
    setTasks,
    setMakeBlur,
    setSelectedProjectMembers,
    setSelectedProject,
} from "../../store";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../config";

const CardDelete = ({
    openDeleteCardModal,
    setOpenDeleteCardModal,
    setOpenNewCardModal,
}) => {
    const fetchSingleCard = useSelector((state) => state.fetchSingleCard);
    const selectedProject = useSelector((state) => state.selectedProject);

    const token = useSelector((state) => state.token);
    const cardId = fetchSingleCard.id;
    const userId = localStorage.getItem("user_id");
    // check later
    const projectId = selectedProject.id;

    const dispatch = useDispatch();

    const closePopup = () => {
        setOpenDeleteCardModal(false);
        dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
        dispatch(setMakeBlur({ makeBlur: false }));
        setOpenNewCardModal(false);
    };

    const handleDeleteButton = async () => {
        await axios
            .delete(`${BASE_URL}/api/deletetask/${cardId}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                if (res.data.status) {
                    const allProjects = res.data.data;
                    var filteredProject = allProjects.filter(
                        (project) => project.id === projectId
                    );
                    filteredProject = filteredProject[0];

                    dispatch(setProjects({ projects: allProjects }));
                    if (allProjects.length > 0) {
                        dispatch(
                            setSelectedProject({
                                selectedProject: filteredProject,
                            })
                        );
                        dispatch(
                            setSelectedProjectMembers({
                                selectedProjectMembers: filteredProject.members,
                            })
                        );

                        dispatch(
                            setTasks({
                                tasks: filteredProject.tasks,
                            })
                        );
                    }

                    toast.success(res.data?.message);
                } else {
                    toast.error("Server is not responding");
                }
                closePopup();
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
        <div
            className={`modal fade ${openDeleteCardModal ? "show" : ""}`}
            tabIndex="-1"
            role="dialog"
            style={{
                display: openDeleteCardModal ? "block" : "none",
            }}
        >
            <div className="modal-dialog">
                <div className="modal-content custom-modal-content">
                    <div className="modal-header custom-modal-bg">
                        <span style={{ fontWeight: "600" }}>Delete card</span>

                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            style={{ fontSize: "11px" }}
                            onClick={closePopup}
                        ></button>
                    </div>
                    <div
                        className="modal-body custom-modal-body"
                        style={{ textAlign: "left" }}
                    >
                        <h5
                            className="modal-title mb-2"
                            style={{ fontSize: "16px" }}
                        >
                            Do you want to Delete this task?
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

export default CardDelete;
