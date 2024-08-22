import "./board.scss";
import { useEffect, useState } from "react";
import { BsPersonPlus, BsTrash3 } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import Card from "../Cards";
import AddMemberModal from "../../../Modal/BoardModals/AddMemberModal";
import { setMakeBlur, setSelectedProject } from "../../../store";
import HashLoader from "react-spinners/HashLoader";
import CreateBoardModal from "../../../Modal/BoardModals/CreateBoardModal";
import DeleteBoard from "../../../component/board/DeleteBoard";
import LeaveBoard from "../../../component/board/LeaveBoard";
import List from "../Lists";

const BoardList = () => {
    const dispatch = useDispatch();

    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [openCreateBoardModal, setOpenCreateBoardModal] = useState(false);
    const [deleteProjectId, setDeleteProjectId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [leaveProjectId, setLeaveProjectId] = useState(null);

    const blur = useSelector((state) => state.makeBlur);
    const projects = useSelector((state) => state.projects);
    const isCardsLoading = useSelector((state) => state.isCardsLoading);

    const selectedProject = useSelector((state) => state.selectedProject);
    const tasks = useSelector((state) => state.tasks);

    const handleShare = () => {
        dispatch(setMakeBlur({ makeBlur: true }));
        setShowAddMemberModal(true);
    };

    const handleDelete = () => {
        dispatch(setMakeBlur({ makeBlur: true }));
        setShowAddMemberModal(true);
    };

    const handleCreateProject = () => {
        setOpenCreateBoardModal(true);
        dispatch(setMakeBlur({ makeBlur: true }));
    };

    const handleDeleteProject = (projectId) => {
        setIsLoading(true);
        setDeleteProjectId(projectId);
    };

    const handleLeaveProject = (projectId) => {
        setIsLoading(true);
        setLeaveProjectId(projectId);
    };

    return (
        <>
            {deleteProjectId && (
                <DeleteBoard 
                    deleteProjectId={deleteProjectId}
                    setDeleteProjectId={setDeleteProjectId}
                    setIsLoading={setIsLoading}
                />
            )}

            {leaveProjectId && (
                <LeaveBoard
                    leaveProjectId={leaveProjectId}
                    setLeaveProjectId={setLeaveProjectId}
                    setIsLoading={setIsLoading}
                />
            )}
            {projects && projects.length > 0 && (
                <div className="board-main-content d-flex flex-column">
                    <div
                        className={`board-header-content d-flex ${
                            blur ? "is-blur disable-pointer-events" : ""
                        }`}
                    >
                        <div className="board-header-name d-flex"> 
                            <h1 className="board-name m-0"> 
                                {selectedProject?.title}
                            </h1>
                        </div>

                        {selectedProject && selectedProject.is_owner && (
                            <div className="board-header-button">
                                <button
                                    className={`share-button`}
                                    onClick={() => handleShare()}
                                >
                                    <BsPersonPlus className="share-icon" />{" "}
                                    Share
                                </button>

                                <button
                                    className={`project-delete-button`}
                                    onClick={() =>
                                        handleDeleteProject(selectedProject.id)
                                    }
                                >
                                    <BsTrash3 className="project-delete-icon" /> 
                                    Delete project
                                </button>
                            </div>
                        )}

                        {!selectedProject?.is_owner && (
                            <div className="board-header-button">
                                <button
                                    className={`project-delete-button`}
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        handleLeaveProject(selectedProject.id)
                                    }
                                >
                                    <BsTrash3 className="project-delete-icon" />{" "}
                                    Leave project
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                    <List />

                        
                    </div>

                    {showAddMemberModal && (
                        <AddMemberModal
                            showAddMemberModal={showAddMemberModal}
                            setShowAddMemberModal={setShowAddMemberModal}
                        />
                    )}
                </div>
            )}
           
            {!isCardsLoading && projects && projects.length === 0 && (
                <>
                    <div
                        className={`d-flex flex-column gap-3 justify-content-center align-items-center w-100 h-100 ${
                            blur ? "is-blur disable-pointer-events" : ""
                        }`}
                    >
                        <span style={{ fontWeight: 600 }}>
                            There are no projects to show
                        </span>
                        <button
                            type="button"
                            className="create-project-button"
                            onClick={handleCreateProject}
                        >
                            Create a project
                        </button>
                    </div>
                    {openCreateBoardModal && (
                        <CreateBoardModal
                            openCreateBoardModal={openCreateBoardModal}
                            setOpenCreateBoardModal={setOpenCreateBoardModal}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default BoardList;
