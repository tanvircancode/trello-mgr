// import SearchMember from "./SearchMember";
import { useState, useEffect } from "react";
import "./boardmodal.scss";
import { setMakeBlur } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../config";
import AddMember from "../../component/member/AddMember";
import RemoveMember from "../../component/member/RemoveMember";

const AddMemberModal = ({ showAddMemberModal, setShowAddMemberModal }) => {
    const dispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [addMemberId, setAddMemberId] = useState(null);
    const [removeMemberId, setRemoveMemberId] = useState(null);

    const token = useSelector((state) => state.token);

    const selectedProject = useSelector((state) => state.selectedProject);

    const userId = localStorage.getItem("user_id");
    const projectId = selectedProject.id;
    const ownerId = selectedProject.user_id;

    const handleAddMember = (userId) => {
        setIsLoading(true);
        setAddMemberId(userId);
    };
    const handleRemoveMember = (userId) => {
        setIsLoading(true);
        setRemoveMemberId(userId);
    };

    //new end

    const cancelModal = () => {
        setSearchTerm("");
        setShowAddMemberModal(false);
        dispatch(setMakeBlur({ makeBlur: false }));
    };

    const fetchMembers = async () => {
        setIsLoading(true);
        setError(null);

        await axios
            .get(`${BASE_URL}/api/projectmembers/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setUsers(res.data.users);
            })
            .catch((error) => {
                setError(error);
            });

        setIsLoading(false);
    };

    const handleSearch = async (searchTerm) => {
        if (!searchTerm) {
            fetchMembers();
        } else {
            setIsLoading(true);
            setError(null);

            var formData = new FormData();
            formData.append("searchTerm", searchTerm);
            formData.append("project_id", projectId);

            await axios
                .post(`${BASE_URL}/api/searchusers`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                    },
                })
                .then((res) => {
                    setUsers(res.data.data);
                })
                .catch((error) => {
                    setError(error);
                });
            setIsLoading(false);
        }
    };

    const handleSearchTermChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
        if (newSearchTerm === "") {
            fetchMembers();
        } else {
            handleSearch(searchTerm);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    return (
        <div>
            {addMemberId && (
                <AddMember
                    addMemberId={addMemberId}
                    setAddMemberId={setAddMemberId}
                    users={users}
                    setUsers={setUsers}
                    projectId={projectId}
                    setIsLoading={setIsLoading}
                    ownerId={ownerId}
                />
            )}

            {removeMemberId && (
                <RemoveMember
                    removeMemberId={removeMemberId}
                    setRemoveMemberId={setRemoveMemberId}
                    users={users}
                    setUsers={setUsers}
                    projectId={projectId}
                    setIsLoading={setIsLoading}
                />
            )}
            <div
                className={`modal fade ${showAddMemberModal ? "show" : ""}`}
                tabIndex="-1"
                role="dialog"
                style={{
                    display: showAddMemberModal ? "block" : "none",
                    marginTop: "2em",
                }}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-between member-modal-header">
                            <h1 className="modal-title fs-6 text-center">
                                Share Board
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

                        <div className="search-member d-flex flex-column align-items-flex-start mb-3">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => handleSearchTermChange(e)}
                                placeholder={
                                    searchTerm === ""
                                        ? "Email address or name"
                                        : ""
                                }
                                className="custom-placeholder"
                            />
                            {isLoading && (
                                <p className="loading-text">Loading...</p>
                            )}
                            {error && (
                                <p className="search-error-text">
                                    An error occurred
                                </p>
                            )}

                            {!isLoading &&
                                !error &&
                                users &&
                                users.length > 0 &&
                                users.map((user, index) => (
                                    <div
                                        className="d-flex align-items-center member-details-row mb-3"
                                        key={index}
                                    >
                                        <div className="d-flex flex-column flex-grow-1">
                                            <span className="member-name">
                                                {user.name}
                                                {user.id === userId && (
                                                    <span>(you)</span>
                                                )}
                                            </span>
                                            <span className="member-email">
                                                {user.email}
                                            </span>
                                        </div>
                                        {user.isMember ? (
                                            <>
                                                {user.id === ownerId ? (
                                                    <span className="owner-text">
                                                        Owner
                                                    </span>
                                                ) : (
                                                    <>
                                                        <span className="already-member">
                                                            Already a member
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary remove-member-button"
                                                            onClick={() =>
                                                                handleRemoveMember(
                                                                    user.id
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn btn-primary add-member-button"
                                                onClick={() =>
                                                    handleAddMember(user.id)
                                                }
                                            >
                                                Add Member
                                            </button>
                                        )}
                                    </div>
                                ))}

                            {!isLoading &&
                                !error &&
                                users &&
                                users.length === 0 && (
                                    <p className="loading-text">
                                        No users found!
                                    </p>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
