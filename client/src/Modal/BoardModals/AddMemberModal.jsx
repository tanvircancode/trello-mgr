// import SearchMember from "./SearchMember";
import { useState, useEffect } from "react";
import "./boardmodal.scss";
import { setMakeBlur } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../config";
import AddMember from "../../component/member/AddMember";

const AddMemberModal = ({ showAddMemberModal, setShowAddMemberModal }) => {
    const dispatch = useDispatch();
    //new

    // const [onAddMember, setOnAddMember] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [addMemberId, setAddMemberId] = useState(null);
    const token = useSelector((state) => state.token);


    const selectedProject = useSelector((state) => state.selectedProject);
    const projectId = selectedProject.id;

    const handleAddMember = (userId) => {
        setIsLoading(true);
        setAddMemberId(userId);
    };

    //new end

    const cancelModal = () => {
        setShowAddMemberModal(false);
        dispatch(setMakeBlur({ makeBlur: false }));
    };

    const handleSearch = async () => {
        setIsLoading(true);
        setError(null); // Clear any previous errors

        var formData = new FormData();
        formData.append("searchTerm", searchTerm);
        formData.append("projectId", projectId);

        await axios
            .post(`${BASE_URL}/api/searchusers`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            })
            .then((res) => {
                console.log(res);
                setUsers(res.data.users);
            })
            .catch((error) => {
                console.log(error);
                setError(error);
            });
        setIsLoading(false);
    };

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
        handleSearch(); // Trigger search on every change
    };

    useEffect(() => {

    },[users])

    return (
        <div>
            {addMemberId && <AddMember addMemberId={addMemberId} setAddMemberId={setAddMemberId}
             users={users} setUsers={setUsers} projectId={projectId} 
             setIsLoading={setIsLoading} isLoading={isLoading}
            />}
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
                        {/* <SearchMember
                            searchTerm={searchTerm}
                            onSearchChange={handleSearchChange}
                            members={filteredMembers}
                            onAddMember={handleAddMember}
                        /> */}
                        <div className="search-member d-flex flex-column align-items-flex-start mb-3">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchTermChange}
                                placeholder="Search users..."
                            />
                            {isLoading && <p className="loading-text">Loading...</p>}
                            {error && <p>Error: {error.message}</p>}
                            {/* <ul>
                                {users.map((user) => (
                                    <li key={user.id}>
                                        {user.name}
                                        {user.isMember ? (
                                            <span>Already a member</span>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    handleAddMember(user.id)
                                                }
                                            >
                                                Add Member
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul> */}
                            {users &&
                                users.map((user, index) => (
                                    <div
                                        className="d-flex align-items-center member-details-row mb-3"
                                        key={index}
                                    >
                                        <div className="d-flex flex-column flex-grow-1">
                                            <span className="member-name">
                                                {user.name}
                                            </span>
                                            <span className="member-email">
                                                {user.email}
                                            </span>
                                        </div>
                                        {user.isMember ? (
                                            <span className="already-member">Already a member</span>
                                        ) : (
                                            <button
                                                type="button"
                                                className=" btn btn-primary add-member-button"
                                                onClick={() =>
                                                    handleAddMember(user.id)
                                                }
                                            >
                                                Add Member
                                            </button>
                                        )}
                                    </div>
                                ))}
                            {/* member 1 */}

                            {/* <div className="d-flex align-items-center member-details-row mb-3">
                                <div className="d-flex flex-column flex-grow-1">
                                    <span className="member-name">
                                        Tanvir Ahmed Chowdhury
                                    </span>
                                    <span className="member-email">
                                        tanvir@gmail.com
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className=" btn btn-primary add-member-button"
                                >
                                    Add Member
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
