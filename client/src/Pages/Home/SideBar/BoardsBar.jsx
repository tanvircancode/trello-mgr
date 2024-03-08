import "../home.scss";
import { BsTrash3 } from "react-icons/bs";

const BoardsBar = () => {
    return (
        <div>
            <span className="sidebar-text" style={{ fontWeight: "bold" }}>
                Your Boards
            </span>
            <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center no-left-padding no-border">
                    <div className="d-flex align-items-center">
                        <div
                            className="icon-color"
                            style={{ backgroundColor: "#D9E3F0" }}
                        ></div>
                        <span className="sidebar-text">A list item</span>
                    </div>
                    <BsTrash3 className="custom-sm-trash-icon" />
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center no-left-padding no-border">
                    <div className="d-flex">
                        <div
                            className="icon-color"
                            style={{ backgroundColor: "#D9E3F0" }}
                        ></div>
                        <span className="sidebar-text">A list item</span>
                    </div>
                    <BsTrash3 className="custom-sm-trash-icon" />
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center no-left-padding no-border">
                    <div className="d-flex">
                        <div
                            className="icon-color"
                            style={{ backgroundColor: "#D9E3F0" }}
                        ></div>
                        <span className="sidebar-text">A list item</span>
                    </div>
                    <BsTrash3 className="custom-sm-trash-icon" />
                </li>
            </ul>
        </div>
    );
};

export default BoardsBar;
