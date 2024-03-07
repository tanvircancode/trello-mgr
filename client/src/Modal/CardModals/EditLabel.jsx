import { useState, useEffect } from "react";
import "./cardmodal.scss";
import { useDispatch, useSelector } from "react-redux";
import { setMakeCardModalBlur } from "../../store";

import { BsPencil } from "react-icons/bs";
import LabelModal from "./LabelModal";

const EditLabel = ({ openEditLabelModal, setOpenEditLabelModal }) => {
    const [openLabelModal, setOpenLabelModal] = useState(false);
    const [isEditLabel, setIsEditLabel] = useState(false);

    const dispatch = useDispatch();

    const cancelModal = () => {
        setOpenEditLabelModal(false);

        dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
    };

    const handleCreateLabel = () => {
        setOpenLabelModal(true);
    };

    const handleEditLabel = () => {
        setOpenLabelModal(true);
        setIsEditLabel(true);
    };

    return (
        <div>
            <div>
                <label className="form-label">Title</label>
                <input type="email" className="form-control label-input" />
            </div>
            <div
                className={`modal fade ${openEditLabelModal ? "show" : ""}`}
                tabIndex="-1"
                role="dialog"
                style={{
                    display: openEditLabelModal ? "block" : "none",
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
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="flexCheckChecked"
                                    />
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

            <LabelModal
                openLabelModal={openLabelModal}
                setOpenLabelModal={setOpenLabelModal}
                isEditLabel={isEditLabel}
                setIsEditLabel={setIsEditLabel}
                openEditLabelModal={openEditLabelModal}
                setOpenEditLabelModal={setOpenEditLabelModal}
            />
        </div>
    );
};

export default EditLabel;
