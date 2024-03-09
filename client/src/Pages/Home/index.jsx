import { useEffect, useState } from "react";
import { BsFillPersonPlusFill, BsClipboard2PlusFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

import "./home.scss";
import BoardsBar from "./SideBar/BoardsBar";
import BoardList from "./Boards/BoardList";
import CreateBoardModal from "../../Modal/BoardModals/CreateBoardModal";
import { setMakeBlur } from "../../store";

const Home = () => {
    const [openCreateBoardModal, setOpenCreateBoardModal] = useState(false);

    const token = useSelector((state) => state.token);
    const blur = useSelector((state) => state.makeBlur);

    const dispatch = useDispatch();

    const handleCreateProject = () => {
        setOpenCreateBoardModal(true);
        dispatch(setMakeBlur({ makeBlur: true }));
    };

    return (
        <div className="container maxWidthContainer">
            <div className={`row d-flex`}>
                <div
                    className={`col-xs-12 col-sm-4 col-md-4 col-lg-3 p-0  ${
                        blur ? "is-blur disable-pointer-events" : ""
                    }`}
                >
                    <div className="card w-100" style={{ borderLeft: "none" }}>
                        <div
                            className={`card-header text-uppercase d-flex align-items-center logo-div-bg ${
                                blur ? "is-blur" : ""
                            }`}
                        >
                            <span className="trello-logo"></span>
                            <span
                                className="sidebar-text"
                                style={{ fontWeight: "bold" }}
                            >
                                Trello Workspace
                            </span>
                        </div>
                        <ul className="list-group list-group-flush ">
                            <li
                                className="list-group-item no-border list-cursor-pointer"
                                onClick={handleCreateProject}
                            >
                                <BsClipboard2PlusFill className="custom-sm-icon" />
                                <span className="sidebar-text">
                                    Create Project
                                </span>
                            </li>
                            <li className="list-group-item no-border list-cursor-pointer">
                                <BsFillPersonPlusFill className="custom-sm-icon" />

                                <span className="sidebar-text">Requests</span>
                            </li>
                            <li className="list-group-item">
                                <BoardsBar />
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-xs-12  col-sm-8 col-md-8 col-lg-9 custom-item-list p-0">
                    <BoardList />
                </div>
            </div>

            {openCreateBoardModal && (
                <CreateBoardModal
                    openCreateBoardModal={openCreateBoardModal}
                    setOpenCreateBoardModal={setOpenCreateBoardModal}
                />
            )}
        </div>
    );
};

export default Home;
