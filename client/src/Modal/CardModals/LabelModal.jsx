import { useState, useEffect } from "react";
import "./cardmodal.scss";
import { useDispatch, useSelector } from "react-redux";
import { setMakeCardModalBlur } from "../../store";
import { BlockPicker } from "react-color";
import { BsArrowLeft } from "react-icons/bs";

const LabelModal = ({
    openLabelModal,
    setOpenLabelModal,
    isEditLabel,
    setIsEditLabel,
    openEditLabelModal,
    setOpenEditLabelModal
}) => {
    const [labelColor, setLabelColor] = useState("#f44336");
    const dispatch = useDispatch();

    var colors = [
        "#f44336",
        "#e91e63",
        "#9c27b0",
        "#673ab7",
        "#3f51b5",
        "#2196f3",
        "#03a9f4",
        "#424242",
        "#1F2022",
        "#4b6387",
        "#C02942",
        "#007BFF",
        "#009688",
        "#795548",
        "#607d8b",
    ];

    const cancelModal = () => {
        setOpenLabelModal(false);

        if (isEditLabel) {
            setIsEditLabel(false);
            dispatch(setMakeCardModalBlur({ makeCardModalBlur: true }));
        }
    };

    const cancelModalAll = () => {
        console.log(isEditLabel);
        setOpenLabelModal(false);
        setIsEditLabel(false);
        setOpenEditLabelModal(false);
        dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
    };

    const handleChangeComplete = (color) => {
        setLabelColor(color.hex);
    };

    const handleRemoveColor = () => {
        setLabelColor("");
    };

    const handleCreateLabel = () => {
        //here api top submit
    };
    return (
        <div>
            <div>
                <label className="form-label">Title</label>
                <input type="email" className="form-control" />
            </div>
            <div
                className={`modal fade ${openLabelModal ? "show" : ""}`}
                tabIndex="-1"
                role="dialog"
                style={{
                    display: openLabelModal ? "block" : "none",
                    marginTop: "2em",
                }}
            >
                <div className="modal-dialog modal-sm custom-modal-width">
                    <div className="modal-content">
                        <div className="modal-header d-flex">
                            {isEditLabel && (
                                <BsArrowLeft
                                    className="edit-label-arrow"
                                    onClick={cancelModal}
                                />
                            )}
                            <h1
                                className="modal-title fs-6 text-center"
                                style={{ margin: "0 auto" }}
                            >
                                {isEditLabel ? "Edit label" : "Create label"}
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                style={{ marginLeft: 0, fontSize: "10px" }}
                                onClick={cancelModalAll}
                            ></button>
                        </div>

                        <div className="modal-body">
                            <div className="label-title mb-3">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control label-input"
                                />
                            </div>

                            <BlockPicker
                                colors={colors}
                                color={labelColor}
                                onChangeComplete={handleChangeComplete}
                            />

                            <button
                                type="button"
                                className="btn btn-primary card-button d-flex align-items-center label-color-remove justify-content-center m-0"
                                disabled={!labelColor}
                                onClick={() => handleRemoveColor()}
                            >
                                <span>Remove color</span>
                            </button>

                            {isEditLabel ? (
                                <div className="d-flex label-edit-button">
                                    <button
                                        type="button"
                                        className="btn btn-primary label-save "
                                        onClick={() => handleCreateLabel()}
                                    >
                                        <span>Save</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary label-delete"
                                        onClick={() => handleCreateLabel()}
                                    >
                                        <span>Delete</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-primary create-button"
                                    onClick={() => handleCreateLabel()}
                                >
                                    <span>Create label</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabelModal;
