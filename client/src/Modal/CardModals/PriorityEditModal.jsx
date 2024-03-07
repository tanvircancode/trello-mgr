
import { BsPencil } from "react-icons/bs";
import "./cardmodal.scss";
import { useDispatch, useSelector } from "react-redux";
import { setMakeCardModalBlur } from "../../store";
import { useState, useEffect } from "react";



const PriorityEditModal = ({
    openEditPriorityModal,
    setOpenEditPriorityModal,
}) => {
    const cancelModal = () => {
       
    };
    return (
        <div>
            <div>
                <label className="form-label">Title</label>
                <input type="email" className="form-control label-input" />
            </div>
            <div
                className={`modal fade ${openEditPriorityModal ? "show" : ""}`}
                tabIndex="-1"
                role="dialog"
                style={{
                    display: openEditPriorityModal ? "block" : "none",
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
                                Labels
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
                            <div className="label-title mb-3">
                                <label className="form-label">Labels</label>
                                <div className="d-flex align-items-center gap-3">
                                   

                                    <span
                                        className="styled-span w-100"
                                        htmlFor="flexCheckChecked"
                                    >
                                        Doing
                                    </span>

                                    <BsPencil
                                        className="edit-label-pencil"
                                        onClick={() => handleEditLabel()}
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary card-button d-flex align-items-center label-create justify-content-center"
                                onClick={() => handleCreateLabel()}
                            >
                                <span>Create label</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriorityEditModal;
