import { useEffect, useState } from "react";
// import ItemList from "./Items/ItemList";
import {
    BsFillPersonPlusFill,
    BsClipboard2PlusFill,
} from "react-icons/bs";
// import FoldersBar from "./SideBar/FoldersBar";
import { BlockPicker } from "react-color";
// import ItemsBar from "./SideBar/ItemsBar";
// import OrganizationsBar from "./SideBar/OrganizationsBar";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import {
   
} from "../../store";
import { setSelectMenu } from "../../store";
import "./home.scss";
import BoardsBar from "./SideBar/BoardsBar";
import BoardList from "./Boards/BoardList";

const Home = () => {
    const userId = localStorage.getItem("user_id");

    const token = useSelector((state) => state.token);
    const blur = useSelector((state) => state.makeBlur);


    const dispatch = useDispatch();

    return (
        <div className="container maxWidthContainer">
            <div className={`row d-flex`}>
                <div className={`col-xs-12 col-sm-4 col-md-4 col-lg-3 p-0  ${blur ? "is-blur disable-pointer-events" : ""}`}>
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
                        <ul className="list-group list-group-flush">
                            {/* <li className="list-group-item ">
                                <BsTrello className="custom-sm-icon" />
                                <span className="sidebar-text">Boards</span>
                            </li> */}
                            <li className="list-group-item no-border">
                                <BsClipboard2PlusFill className="custom-sm-icon" />
                                <span className="sidebar-text">
                                    Create Board
                                </span>
                            </li>
                            <li className="list-group-item no-border">
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
        </div>
    );
};

export default Home;
