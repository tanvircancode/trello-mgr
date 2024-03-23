import "./board.scss";
import { useEffect, useState } from "react";
import { BsPersonPlus, BsTrash3 } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import Card from "../Cards";
import AddMemberModal from "../../../Modal/BoardModals/AddMemberModal";
import { setMakeBlur, setSelectedProject } from "../../../store";
import HashLoader from "react-spinners/HashLoader";
import CreateBoardModal from "../../../Modal/BoardModals/CreateBoardModal";

const BoardList = () => {
    const dispatch = useDispatch();

    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [openCreateBoardModal, setOpenCreateBoardModal] = useState(false);

    const blur = useSelector((state) => state.makeBlur);
    const projects = useSelector((state) => state.projects);
    const isCardsLoading = useSelector((state) => state.isCardsLoading);

    console.log(projects);

    const selectedProject = useSelector((state) => state.selectedProject);
    const tasks = useSelector((state) => state.tasks);

    console.log(selectedProject);

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
   

    // useEffect(() => {}, [selectedProject]);

    return (
        <>
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
                                    // className={`share-button ${showAddMemberModal ? "active" : ""}`}
                                    onClick={() => handleShare()}
                                >
                                    <BsPersonPlus className="share-icon" />{" "}
                                    Share
                                </button>

                                <button
                                    className={`project-delete-button`}
                                    // className={`share-button ${showAddMemberModal ? "active" : ""}`}
                                    onClick={() => handleDelete()}
                                >
                                    {/* make a condition for Leave project */}
                                    <BsTrash3 className="project-delete-icon" />{" "}
                                    Delete project
                                </button>
                            </div>
                        )}
                        {!(selectedProject?.is_owner) && (
                            <div className="board-header-button">
                                <button
                                    className={`project-delete-button`}
                                    // className={`share-button ${showAddMemberModal ? "active" : ""}`}
                                    onClick={() => handleDelete()}
                                >
                                    {/* make a condition for Leave project */}
                                    <BsTrash3 className="project-delete-icon" />{" "}
                                    Leave project
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        {/* make a loop */}
                        <Card />
                    </div>

                    {showAddMemberModal && (
                        <AddMemberModal
                            showAddMemberModal={showAddMemberModal}
                            setShowAddMemberModal={setShowAddMemberModal}
                        />
                    )}
                </div>
            )}
            {isCardsLoading && (
                <div style={{ width: "100px", margin: "50px auto auto" }}>
                    <HashLoader color="#36d7b7" />
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
