import { useState, useEffect } from "react";
import "../modal.scss";
import { useDispatch, useSelector } from "react-redux";
import {
    setMakeCardModalBlur,
    setSelectedTaskMembers,
    setTasks,
} from "../../store";
import { BsPersonAdd, BsPersonDash } from "react-icons/bs";
import { BASE_URL } from "../../config";
import axios from "axios";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

const MemberModal = ({ openMemberModal, setOpenMemberModal }) => {
    const dispatch = useDispatch();
    const selectedProjectMembers = useSelector(
        (state) => state.selectedProjectMembers
    );

    const fetchSingleCard = useSelector((state) => state.fetchSingleCard);
    const selectedProject = useSelector((state) => state.selectedProject);
    const selectedTaskMembers = useSelector(
        (state) => state.selectedTaskMembers
    );
    const taskId = fetchSingleCard.id;
    const token = useSelector((state) => state.token);
    const userId = localStorage.getItem("user_id");
    const [loading, setLoading] = useState(false);

    // console.log(selectedProject);
    // console.log(selectedProjectMembers);
    // console.log(selectedTaskMembers);

    const filteredProjectMembers = () => {
        if (!selectedTaskMembers) {
            return [];
        }

        let newProjectMembers = selectedProjectMembers.filter(
            (projectMember) => {
                return !selectedTaskMembers.some(
                    (taskMember) => taskMember.id === projectMember.id
                );
            }
        );
       
        return newProjectMembers;
    };

    const removeTaskMember = async (memberId) => {
        setLoading(true);

        var formData = new FormData();
        formData.append("user_id", memberId);
        formData.append("task_id", taskId);
        formData.append("owner_id", userId);

        await axios
            .post(`${BASE_URL}/api/removetaskmember`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            })
            .then((res) => {
                const updatedTaskUsers = res.data.task.users;
                dispatch(setTasks({ tasks: res.data.project.tasks }));
                dispatch(
                    setSelectedTaskMembers({
                        selectedTaskMembers: updatedTaskUsers,
                    })
                );

                filteredProjectMembers();
            })
            .catch((error) => {
                if (
                    error.response &&
                    error.response?.status &&
                    error.response?.data?.message
                ) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Server is not responding");
                }
            });
        setLoading(false);
    };

    const addAsTaskMember = async (memberId) => {
        setLoading(true);

        var formData = new FormData();
        formData.append("user_id", memberId);
        formData.append("task_id", taskId);
        formData.append("owner_id", userId);

        await axios
            .post(`${BASE_URL}/api/addtaskmember`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            })
            .then((res) => {
                const updatedTaskUsers = res.data.task.users;
                dispatch(setTasks({ tasks: res.data.project.tasks }));
                dispatch(
                    setSelectedTaskMembers({
                        selectedTaskMembers: updatedTaskUsers,
                    })
                );
                filteredProjectMembers();
            })
            .catch((error) => {
                if (
                    error.response &&
                    error.response?.status &&
                    error.response?.data?.message
                ) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Server is not responding");
                }
            });
        setLoading(false);
    };

    const cancelModal = () => {
        setOpenMemberModal(false);

        dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
    };

    useEffect(() => {
        if (selectedTaskMembers) {
            filteredProjectMembers();
        }
    }, [selectedTaskMembers]);

    return (
        <div
            className={`modal fade ${openMemberModal ? "show" : ""}`}
            tabIndex="-1"
            role="dialog"
            style={{
                display: openMemberModal ? "block" : "none",
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
                            Members
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
                        <ul className="list-group list-group-flush ">
                            {selectedTaskMembers &&
                                selectedTaskMembers.length > 0 && (
                                    <div className="task-member-list">
                                        <li
                                            className="list-group-item task-member-header"
                                            aria-current="true"
                                        >
                                            Task members
                                        </li>
                                        {loading ? (
                                            <div className="custom-loader">
                                                <HashLoader
                                                    color="#36d7b7"
                                                    size={25}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                {selectedTaskMembers.map(
                                                    (member, index) => (
                                                        <li
                                                            key={index}
                                                            className="list-group-item d-flex justify-content-between align-items-center no-border no-border-bottom member-list-text"
                                                        >
                                                            <div>
                                                                {member.name}
                                                                {selectedProject.user_id ===
                                                                    member.id && (
                                                                    <span>
                                                                        (owner)
                                                                    </span>
                                                                )}
                                                                {userId ===
                                                                    member.id && (
                                                                    <span>
                                                                        (you)
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <BsPersonDash
                                                                className="member-list-dash-icon"
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() =>
                                                                    removeTaskMember(
                                                                        member.id
                                                                    )
                                                                }
                                                            />
                                                        </li>
                                                    )
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            {filteredProjectMembers().length > 0 && (
                                <div className="task-member-list">
                                    <li
                                        className="list-group-item task-member-header"
                                        aria-current="true"
                                    >
                                        Project members
                                    </li>
                                    {loading ? (
                                        <div className="custom-loader">
                                            <HashLoader
                                                color="#36d7b7"
                                                size={25}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            {filteredProjectMembers().map(
                                                (member, index) => (
                                                    <li
                                                        key={index}
                                                        className="list-group-item d-flex justify-content-between align-items-center no-border no-border-bottom member-list-text"
                                                    >
                                                        <div>
                                                            {member.name}
                                                            {selectedProject.user_id ===
                                                                member.id && (
                                                                <span>
                                                                    (owner)
                                                                </span>
                                                            )}
                                                            {userId ===
                                                                member.id && (
                                                                <span>
                                                                    (you)
                                                                </span>
                                                            )}
                                                        </div>
                                                        <BsPersonAdd
                                                            className="member-list-plus-icon"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() =>
                                                                addAsTaskMember(
                                                                    member.id
                                                                )
                                                            }
                                                        />
                                                    </li>
                                                )
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberModal;
