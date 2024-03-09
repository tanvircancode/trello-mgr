import { useEffect, useState } from "react";
import "../modal.scss";
import { useSelector, useDispatch } from "react-redux";
import {
    BsBarChartSteps,
    BsTrash,
    BsMegaphoneFill,
    BsCheck2Square,
} from "react-icons/bs";
import EditNameDescModal from "./EditNameDescModal";
import {
    setMakeBlur,
    setMakeCardModalBlur,
    setShowTextarea,
} from "../../store";
import CardModalButton from "./CardModalButton";

const CardMainModal = ({ openNewCardModal, setOpenNewCardModal }) => {
    const [showDescForm, setShowDescForm] = useState(false);
    const [nameForm, setNameForm] = useState(false);
    const [checklistForm, setChecklistForm] = useState(false);
    const [addItem, setAddItem] = useState(false);

    const blur = useSelector((state) => state.makeBlur);
    const cardModalblur = useSelector((state) => state.makeCardModalBlur);

    var doBlur = blur && cardModalblur;

    const [descVal, setDescVal] = useState("valo ni vai");

    const showTextarea = useSelector((state) => state.showTextarea);

    const dispatch = useDispatch();

    const handleShowTextarea = (type, value) => {
        dispatch(
            setShowTextarea({
                type: type,
                value: value,
            })
        );
    };

    const cancelModal = () => {
        setOpenNewCardModal(false);
        dispatch(setMakeBlur({ makeBlur: false }));
    };

    useEffect(() => {
        dispatch(setMakeBlur({ makeBlur: false }));
        dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
    }, []);

    return (
        <div
            className={`modal fade ${openNewCardModal ? "show" : ""} `}
            tabIndex="-1"
            role="dialog"
            style={{ display: openNewCardModal ? "block" : "none" }}
            aria-hidden={!openNewCardModal}
        >
            <div className="modal-dialog modal-dialog-scrollable custom-width">
                <div className={`modal-content `}>
                    <div
                        className={`modal-header custom-modal-bg modal-header-padding ${
                            doBlur ? "is-blur disable-pointer-events" : ""
                        }`}
                    >
                        <h5 className="modal-title">Card Title Here</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={cancelModal}
                        ></button>
                    </div>
                    <div className="modal-body custom-modal-body">
                        <div className="container">
                            <div className="row mb-2">
                                <div
                                    className={`col-md-12 col-sm-12 col-lg-9 d-flex flex-column ${
                                        doBlur
                                            ? "is-blur disable-pointer-events"
                                            : ""
                                    }`}
                                >
                                    <div className="card-detail">
                                        <h3 className="card-detail-header">
                                            Labels
                                        </h3>
                                        <div className="card-detail-label-list">
                                            <span className="card-detail-label-text">
                                                Doing
                                            </span>
                                            <span className="card-detail-label-text">
                                                In Progress
                                            </span>
                                            <span className="card-detail-label-text">
                                                Done
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-detail">
                                        <div className="card-detail-description-header d-flex mb-2">
                                            <div className="d-flex">
                                                <BsBarChartSteps className="card-sm-icon" />

                                                <h3 className="card-detail-header m-0">
                                                    Description
                                                </h3>
                                            </div>
                                            {!showDescForm && (
                                                <button
                                                    type="button"
                                                    className="modal-edit"
                                                    onClick={() =>
                                                        setShowDescForm(true)
                                                    }
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                        <div className="card-detail-text">
                                            {!showDescForm && (
                                                <textarea
                                                    className="form-control custom-fake-form"
                                                    style={{
                                                        resize: "none",
                                                        fontSize: "12px",
                                                        cursor: "pointer",
                                                    }}
                                                    rows="4"
                                                    // value={descVal}
                                                    placeholder="Add a more detailed description"
                                                    onClick={() =>
                                                        setShowDescForm(true)
                                                    }
                                                ></textarea>
                                            )}
                                            {showDescForm && (
                                                <div className="description-form ">
                                                    <textarea
                                                        className="form-control custom-description-form mb-2"
                                                        style={{
                                                            resize: "none",
                                                            fontSize: "13px",
                                                        }}
                                                        rows="2"
                                                        // value={descVal}
                                                        placeholder="Make your description even better. Type '/' to insert content, formatting, and more."
                                                    ></textarea>
                                                    <button
                                                        type="button"
                                                        className="modal-save"
                                                        style={{
                                                            marginRight: "5px",
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="modal-cancel"
                                                        onClick={() =>
                                                            setShowDescForm(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="card-detail">
                                        <div className="d-flex mb-2">
                                            <BsMegaphoneFill className="card-sm-icon" />

                                            <h3 className="card-detail-header m-0">
                                                Priority
                                            </h3>
                                        </div>
                                        <select className="form-select priority-dropdown">
                                            <option value={null}>
                                                --Select--
                                            </option>
                                            <option value={null}>
                                                Highest
                                            </option>
                                        </select>
                                    </div>
                                    <div className="card-detail">
                                        <div className="card-detail-checklist-header d-flex mb-2">
                                            <div className="d-flex w-100">
                                                <BsCheck2Square className="card-sm-icon" />

                                                {/* {showTextarea && (showTextarea.value != 1) && ( */}
                                                {!nameForm && (
                                                    <h3
                                                        className="card-detail-header m-0 cursor-pointer"
                                                        onClick={() =>
                                                            // handleShowTextarea("checklist",1)
                                                            setNameForm(true)
                                                        }
                                                    >
                                                        Checklist Name
                                                    </h3>
                                                )}

                                                {/* )}  */}
                                                {/* {showTextarea && (showTextarea.value == 1) && ( */}

                                                {nameForm && (
                                                    <EditNameDescModal
                                                        name="Checklist Name"
                                                        setNameForm={
                                                            setNameForm
                                                        }
                                                    />
                                                )}
                                                {/* )} */}
                                            </div>
                                            {/* {showTextarea && (showTextarea.value != 1) && ( */}
                                            <div className="d-flex">
                                                {!nameForm && (
                                                    <button
                                                        type="button"
                                                        className="modal-hide-item"
                                                        onClick={() =>
                                                            setNameForm(true)
                                                        }
                                                    >
                                                        Hide checked items
                                                    </button>
                                                )}
                                                {!nameForm && (
                                                    <button
                                                        type="button"
                                                        className="modal-edit"
                                                        onClick={() =>
                                                            setNameForm(true)
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                                {/* )} */}
                                            </div>
                                        </div>

                                        <div className="card-detail-checklist-text ">
                                            <div
                                                className="progress mb-2"
                                                role="progressbar"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                style={{ height: "0.4rem" }}
                                            >
                                                <div
                                                    className="progress-bar"
                                                    style={{ width: "30%" }}
                                                ></div>
                                            </div>
                                            <div className="cheklist-item-list d-flex flex-column gap-2">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="checklist-item-single d-flex gap-3 w-100">
                                                        <input
                                                            className="form-check-input m-0"
                                                            type="checkbox"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            // checked={true}
                                                        />

                                                        {!checklistForm && (
                                                            <label
                                                                className="form-check-label checklist-label"
                                                                onClick={() =>
                                                                    // handleShowTextarea("checklist",1)
                                                                    setChecklistForm(
                                                                        true
                                                                    )
                                                                }
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                                // style={{ textDecoration: true ? 'line-through' : 'none' }}
                                                            >
                                                                hhh
                                                            </label>
                                                        )}

                                                        {checklistForm && (
                                                            <EditNameDescModal
                                                                name="Checklist Name"
                                                                setNameForm={
                                                                    setChecklistForm
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                    {!checklistForm && (
                                                        <BsTrash
                                                            className="card-sm-icon "
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="checklist-item-single d-flex align-items-center gap-3 w-100">
                                                        <input
                                                            className="form-check-input m-0"
                                                            type="checkbox"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}

                                                            // checked={true}
                                                        />
                                                        <label
                                                            className="form-check-label checklist-label"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            // style={{ textDecoration: true ? 'line-through' : 'none' }}
                                                        >
                                                            ttt
                                                        </label>
                                                    </div>
                                                    <BsTrash
                                                        className="card-sm-icon"
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {!addItem && (
                                                <button
                                                    type="button"
                                                    className="add-item"
                                                    onClick={() =>
                                                        setAddItem(true)
                                                    }
                                                >
                                                    Add an item
                                                </button>
                                            )}

                                            {addItem && (
                                                <EditNameDescModal
                                                    name="Checklist Name"
                                                    button="Add item"
                                                    setNameForm={setAddItem}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 col-sm-12 col-lg-3 mt-3">
                                    <CardModalButton />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardMainModal;
