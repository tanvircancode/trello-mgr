import { BsPencil, BsTrash } from "react-icons/bs";
import "./cardmodal.scss";
import { useDispatch, useSelector } from "react-redux";
import { setMakeCardModalBlur } from "../../store";
import { useState, useEffect } from "react";
import PriorityEditModal from "./PriorityEditModal";

const Prioritymodal = ({ openPriorityModal, setOpenPriorityModal }) => {

  const [priorityTitle, setPriorityTitle] = useState("");

    const [openEditPriorityModal, setOpenEditPriorityModal] = useState(false);
    const dispatch = useDispatch();


    const cancelModal = () => {
      setOpenPriorityModal(false);
      dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));

    };

    const handleEditPriority = () => {
      setOpenEditPriorityModal(true);
    };

    return (
        <div>
            {/* <div>
                <label className="form-label">Title</label>
                <input type="email" className="form-control label-input" />
            </div> */}
            <div
                className={`modal fade ${openPriorityModal ? "show" : ""}`}
                tabIndex="-1"
                role="dialog"
                style={{
                    display: openPriorityModal ? "block" : "none",
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
                                Priorities
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
                                <label className="form-label">Options</label>
                                {/* loop-here */}
                                <div className="d-flex align-items-center gap-3">
                                    <span
                                        className="styled-span w-100"
                                        htmlFor="flexCheckChecked"
                                    >
                                        Highest
                                    </span>
                                    <BsPencil
                                        className="edit-priority-pencil"
                                        onClick={() => handleEditPriority()}
                                    />
                                    <BsTrash
                                        className="delete-priority-trash"
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <input
                                    type="text"
                                    className="form-control w-100 priority-input"
                                    placeholder="Add item..."
                                    onChange={(e) => setPriorityTitle(e.target.value)}
                                />
                                <button
                                    className="btn btn-primary priority-add"
                                    type="button"
                                    disabled={!priorityTitle}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PriorityEditModal
                openEditPriorityModal={openEditPriorityModal}
                setOpenEditPriorityModal={setOpenEditPriorityModal}
            />
        </div>
    );
};

export default Prioritymodal;
