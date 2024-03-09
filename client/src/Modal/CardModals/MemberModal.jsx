import { useState, useEffect } from "react";
import "../modal.scss";
import { useDispatch, useSelector } from "react-redux";
import { setMakeBlur, setMakeCardModalBlur } from "../../store";
import { BsPersonAdd, BsPersonDash } from "react-icons/bs";

const MemberModal = ({ openMemberModal, setOpenMemberModal }) => {
    const dispatch = useDispatch();

    const cancelModal = () => {
        setOpenMemberModal(false);

        dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
    };

    return (
        <div
            className={`modal fade ${openMemberModal ? "show" : ""}`}
            tabIndex="-1"
            role="dialog"
            style={{
                display: openMemberModal ? "block" : "none",
                marginTop: "5em",
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
                            <div className="task-member-list">
                                <li
                                    className="list-group-item task-member-header"
                                    aria-current="true"
                                >
                                    Task members
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center no-border no-border-bottom member-list-text">
                                    A list item
                                    <BsPersonDash
                                        className="member-list-dash-icon"
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    />
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center no-border no-border-bottom member-list-text">
                                    A second list item
                                    <BsPersonDash
                                        className="member-list-dash-icon"
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    />
                                </li>
                            </div>

                            <div className="task-member-list">
                                <li
                                    className="list-group-item task-member-header"
                                    aria-current="true"
                                >
                                    Project members
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center no-border no-border-bottom member-list-text">
                                    A list item
                                    <BsPersonAdd
                                        className="member-list-plus-icon"
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    />
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center no-border no-border-bottom member-list-text">
                                    A second list item
                                    <BsPersonAdd
                                        className="member-list-plus-icon"
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    />
                                </li>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberModal;
