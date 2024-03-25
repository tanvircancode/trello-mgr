import { useState, useEffect } from "react";
import "../modal.scss";
import { useDispatch, useSelector } from "react-redux";
import { setMakeCardModalBlur } from "../../store";
import { BlockPicker } from "react-color";
import { BsArrowLeft } from "react-icons/bs";
import { toast } from "react-toastify";

import CreateLabel from "../../component/label/CreateLabel";
import UpdateLabel from "../../component/label/UpdateLabel";
import DeleteLabel from "../../component/label/DeleteLabel";

const LabelModal = ({
    openLabelModal,
    setOpenLabelModal,
    isEditLabel,
    setIsEditLabel,
    openEditLabelModal,
    setOpenEditLabelModal,
    editingLabel,
    setEditingLabel,
    isCreateLabel,
    setIsCreateLabel,
}) => {
    const [title, setTitle] = useState("");
    const [labelColor, setLabelColor] = useState("#f44336");

    const [showCreateLabel, setShowCreateLabel] = useState(false);
    const [showUpdateLabel, setShowUpdateLabel] = useState(false);
    const [showDeleteLabel, setShowDeleteLabel] = useState(false);

    const dispatch = useDispatch();

    const fetchSingleCard = useSelector((state) => state.fetchSingleCard);
    // console.log(fetchSingleCard);

    const taskId = fetchSingleCard.id;
    const projectId = fetchSingleCard.project_id;

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
        setIsCreateLabel(false);
        setTitle("");
        setEditingLabel(null);
        setOpenLabelModal(false);
        setShowUpdateLabel(false);
        if (isEditLabel) {
            setIsEditLabel(false);
            dispatch(setMakeCardModalBlur({ makeCardModalBlur: true }));
        }
    };

    const cancelModalAll = () => {
        // console.log(isEditLabel);
        setOpenLabelModal(false);
        setIsEditLabel(false);
        setShowUpdateLabel(false);
        setOpenEditLabelModal(false);
        dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
        setIsCreateLabel(false);
    };

    const handleChangeCompleteLabel = (color) => {
        // console.log(color.hex);
        setLabelColor(color.hex);
    };

    const handleRemoveColorLabel = () => {
        setLabelColor("");
    };

    const handleCreateLabel = () => {
        if (title.length === 0 || title.length > 50) {
            toast.error("Invalid title");
        } else {
            setShowCreateLabel(true);
        }
    };

    const handleSaveLabel = () => {
        if (title.length === 0 || title.length > 50) {
            toast.error("Invalid title");
        } else {
            setShowUpdateLabel(true);
        }
    };

    const handleDeleteLabel = (label) => {
        setShowDeleteLabel(true);
    };

    useEffect(() => {
        if (editingLabel) {
            setTitle(editingLabel.name);
            setLabelColor(editingLabel.color);
        }
    }, [editingLabel, isEditLabel]);

    return (
        <>
            {showCreateLabel && (
                <CreateLabel
                    title={title}
                    setTitle={setTitle}
                    labelColor={labelColor}
                    taskId={taskId}
                    is_active={1}
                    projectId={projectId}
                    openLabelModal={openLabelModal}
                    setOpenLabelModal={setOpenLabelModal}
                    isEditLabel={isEditLabel}
                    setIsEditLabel={setIsEditLabel}
                    openEditLabelModal={openEditLabelModal}
                    setOpenEditLabelModal={setOpenEditLabelModal}
                    editingLabel={editingLabel}
                    setEditingLabel={setEditingLabel}
                    setShowCreateLabel={setShowCreateLabel}
                />
            )}

            {showUpdateLabel && (
                <UpdateLabel
                    title={title}
                    setTitle={setTitle}
                    labelColor={labelColor}
                    editingLabel={editingLabel}
                    setEditingLabel={setEditingLabel}
                    isEditLabel={isEditLabel}
                    setIsEditLabel={setIsCreateLabel}
                    setOpenLabelModal={setOpenLabelModal}
                    setShowUpdateLabel={setShowUpdateLabel}
                />
            )}

            {showDeleteLabel && (
                <DeleteLabel
                    editingLabel={editingLabel}
                    setShowDeleteLabel={setShowDeleteLabel}
                    setOpenLabelModal={setOpenLabelModal}
                    setIsEditLabel={setIsCreateLabel}
                    setOpenEditLabelModal={setOpenEditLabelModal}
                />
            )}

            <div>
                {!showDeleteLabel && (
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
                                        {isEditLabel &&
                                        editingLabel &&
                                        !isCreateLabel
                                            ? "Edit label"
                                            : "Create label"}
                                    </h1>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        style={{
                                            marginLeft: 0,
                                            fontSize: "10px",
                                        }}
                                        onClick={cancelModalAll}
                                    ></button>
                                </div>

                                <div className="modal-body">
                                    {isEditLabel &&
                                    editingLabel &&
                                    !isCreateLabel ? (
                                        <div className="label-title mb-3">
                                            <label className="form-label">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control label-input"
                                                value={title}
                                                onChange={(e) => {
                                                    setTitle(e.target.value);
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="label-title mb-3">
                                            <label className="form-label">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control label-input"
                                                value={title}
                                                onChange={(e) =>
                                                    setTitle(e.target.value)
                                                }
                                            />
                                        </div>
                                    )}

                                    {isEditLabel &&
                                        editingLabel &&
                                        !isCreateLabel && (
                                            <>
                                                <BlockPicker
                                                    colors={colors}
                                                    color={
                                                        labelColor || "#000000"
                                                    }
                                                    onChangeComplete={
                                                        handleChangeCompleteLabel
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-primary card-button d-flex align-items-center label-color-remove justify-content-center m-0"
                                                    disabled={!labelColor}
                                                    onClick={() =>
                                                        handleRemoveColorLabel()
                                                    }
                                                >
                                                    <span>Remove color</span>
                                                </button>
                                            </>
                                        )}

                                    {openLabelModal && isCreateLabel && (
                                        <>
                                            <BlockPicker
                                                colors={colors}
                                                color={labelColor || "#000000"}
                                                onChangeComplete={
                                                    handleChangeCompleteLabel
                                                }
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-primary card-button d-flex align-items-center label-color-remove justify-content-center m-0"
                                                disabled={!labelColor}
                                                onClick={() =>
                                                    handleRemoveColorLabel()
                                                }
                                            >
                                                <span>Remove color</span>
                                            </button>
                                        </>
                                    )}

                                    {isEditLabel &&
                                    editingLabel &&
                                    !isCreateLabel ? (
                                        <div className="d-flex label-edit-button">
                                            <button
                                                type="button"
                                                className="btn btn-primary label-save "
                                                onClick={() =>
                                                    handleSaveLabel()
                                                }
                                                disabled={!title && !labelColor}
                                            >
                                                <span>Save</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary label-delete"
                                                onClick={() =>
                                                    handleDeleteLabel(
                                                        editingLabel
                                                    )
                                                }
                                            >
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-primary create-button"
                                            onClick={() => handleCreateLabel()}
                                            disabled={!title && !labelColor}
                                        >
                                            <span>Create label </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default LabelModal;
