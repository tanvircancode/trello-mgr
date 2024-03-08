import "./board.scss";
import { useState } from "react";
import { BsPersonPlus, BsTrash3 } from "react-icons/bs";
import { useSelector , useDispatch} from "react-redux";
import Card from "../Cards";
import AddMemberModal from "../../../Modal/BoardModals/AddMemberModal";
import { setMakeBlur, setMakeCardModalBlur } from "../../../store";

const BoardList = () => {

    const dispatch = useDispatch();

    const [showAddMemberModal, setShowAddMemberModal] = useState(false);

    const blur = useSelector((state) => state.makeBlur);

    const handleShare = () => {
            dispatch(setMakeBlur({ makeBlur: true }));
        setShowAddMemberModal(true);
    };

    const handleDelete = () => {
        dispatch(setMakeBlur({ makeBlur: true }));
    setShowAddMemberModal(true);
};

    return (
        <div className="board-main-content d-flex flex-column">
            <div
                className={`board-header-content d-flex ${
                    blur ? "is-blur disable-pointer-events" : ""
                }`}
            >
                <div className="board-header-name d-flex">
                    <h1 className="board-name m-0">Board Name</h1>
                </div>
                
                <div className="board-header-button">
                    <button
                        className={`share-button`}
                        // className={`share-button ${showAddMemberModal ? "active" : ""}`}
                        onClick={() => handleShare()}
                    >
                        <BsPersonPlus className="share-icon" /> Share
                    </button>
                    
                    <button
                        className={`project-delete-button`}
                        // className={`share-button ${showAddMemberModal ? "active" : ""}`}
                        onClick={() => handleDelete()}
                    >
                        {/* make a condition for Leave project */}
                        <BsTrash3 className="project-delete-icon" /> Delete project
                    </button>
                </div>
            </div>

            <div className="card-list d-flex flex-wrap">
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
    );
};

export default BoardList;
