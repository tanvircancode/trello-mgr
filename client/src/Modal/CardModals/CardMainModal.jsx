import { useEffect, useState, useRef } from "react";
import "../modal.scss";
import { useSelector, useDispatch } from "react-redux";
import {
    BsBarChartSteps,
    BsTrash,
    BsMegaphoneFill,
    BsPencil,
    BsCheck2Square,
} from "react-icons/bs";
import EditNameDescModal from "./EditNameDescModal";
import { setMakeBlur, setMakeCardModalBlur } from "../../store";
import CardModalButton from "./CardModalButton";
import EditDescription from "../../component/description/EditDescription";
import PrioritySelection from "../../component/priority/PrioritySelection";
import DeleteChecklist from "../../component/checklist/DeleteChecklist";
import AddItem from "../../component/checklist/AddItem";
import SelectionItem from "../../component/checklist/SelectionItem";
import DeleteItem from "../../component/checklist/DeleteItem";

const CardMainModal = ({ openNewCardModal, setOpenNewCardModal }) => {
    const textareaRef = useRef(null);
    const [showEditDesc, setShowEditDesc] = useState(false);
    const [showDescForm, setShowDescForm] = useState(false);

    const [nameFormText, setNameFormText] = useState("");

    //for sending props
    const [editingChecklistId, setEditingChecklistId] = useState(null);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingItemId, setEditingItemId] = useState(null);

    const [deletingChecklist, setDeletingChecklist] = useState(null);

    const [selectItem, setSelectItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);

    const [addItem, setAddItem] = useState(false);

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

    const blur = useSelector((state) => state.makeBlur);
    const cardModalblur = useSelector((state) => state.makeCardModalBlur);
    const fetchSingleCard = useSelector((state) => state.fetchSingleCard);
    const selectedTaskMembers = useSelector(
        (state) => state.selectedTaskMembers
    );


    const labels = useSelector((state) => state.labels);
    const anyLabelActive = labels.find((label) => label.is_active);

    const priorities = useSelector((state) => state.priorities);
    const selectedProjectMembers = useSelector((state) => state.selectedProjectMembers);

    // console.log(priorities);

    const checklists = useSelector((state) => state.checklists);
    const tasks = useSelector((state) => state.tasks);

    console.log(selectedProjectMembers);
    console.log(selectedTaskMembers);
    

    var doBlur = blur && cardModalblur;

    const [descValue, setDescValue] = useState("");

    const dispatch = useDispatch();

    const cancelModal = () => {
        setOpenNewCardModal(false);
        dispatch(setMakeBlur({ makeBlur: false }));
        setShowDescForm(false);
        setShowEditDesc(false);
        setDescValue("");
        setNameFormText("");
        setEditingItemId(null);
        setEditingTaskId(null);
        setEditingChecklistId(null);
    };

    const handleDescSubmit = () => {
        setShowEditDesc(true);
    };
    const handleDescCancel = () => {
        setShowDescForm(false);
        setShowEditDesc(false);
        setDescValue("");
        if (fetchSingleCard?.description) {
            setDescValue(fetchSingleCard.description);
        }
    };

    const clickTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.focus();

            //     const descriptionLength = fetchSingleCard?.description ? fetchSingleCard.description.length : 0;
            // textareaRef.current.setSelectionRange(descriptionLength, descriptionLength);
        }
        setShowDescForm(true);
        if (fetchSingleCard?.description) {
            setDescValue(fetchSingleCard.description);
        }
    };

    const handleTextareaChange = (e) => {
        setDescValue(e.target.value);
    };

    //new
    const handleEditChecklist = (checklist) => {
        setAddItem(false);
        setEditingChecklistId(checklist.id);
        setEditingTaskId(checklist.task_id);
        setNameFormText(checklist.name);
    };

    const handleDeleteChecklist = (checklist) => {
        // console.log(priority);
        setDeletingChecklist(checklist);
    };

    const handleAddItem = (checklist) => {
        setAddItem(true);
        setEditingChecklistId(checklist);
        setNameFormText("");

        dispatch(setMakeBlur({ makeBlur: true }));
        dispatch(setMakeCardModalBlur({ makeCardModalBlur: true }));
    };

    const handleDeleteItem = (item) => {
        setDeleteItem(item);
    };

    const handleEditItem = (item) => {
        setSelectItem({ ...item, modal: true });
        dispatch(setMakeBlur({ makeBlur: true }));
        dispatch(setMakeCardModalBlur({ makeCardModalBlur: true }));
    };

    //handling checkbox
    const handleCheckboxChange = (item, checked) => {
        setSelectItem({ ...item, checked: checked });
    };
    //handling checkbox end

    //new end

    useEffect(() => {
        dispatch(setMakeBlur({ makeBlur: false }));
        dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
        if (fetchSingleCard?.description) {
            setDescValue(fetchSingleCard.description);
        }
    }, []);

    return (
        <div>
            {showEditDesc && (
                <EditDescription
                    setShowDescForm={setShowDescForm}
                    descValue={descValue}
                    setDescValue={setDescValue}
                    setShowEditDesc={setShowEditDesc}
                    fetchSingleCard={fetchSingleCard}
                />
            )}

            {deletingChecklist && (
                <DeleteChecklist
                    deletingChecklist={deletingChecklist}
                    setDeletingChecklist={setDeletingChecklist}
                />
            )}

            {deleteItem && (
                <DeleteItem
                    deleteItem={deleteItem}
                    setDeleteItem={setDeleteItem}
                />
            )}

            {fetchSingleCard && (
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
                                    doBlur
                                        ? "is-blur disable-pointer-events"
                                        : ""
                                }`}
                            >
                                <h5 className="modal-title modal-custom-title">
                                    {fetchSingleCard.title}
                                </h5>
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
                                            <>
                                                {selectedTaskMembers &&
                                                    selectedTaskMembers.length >
                                                        0 && (
                                                        <div className="card-detail">
                                                            <h3 className="card-detail-header">
                                                                Members
                                                            </h3>
                                                            <div className="card-detail-label-list">
                                                                {selectedTaskMembers.map(
                                                                    (
                                                                        member,
                                                                        index
                                                                    ) => {
                                                                        const memberName =
                                                                            member.name
                                                                                .split(
                                                                                    " "
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        word
                                                                                    ) =>
                                                                                        word[0]
                                                                                )
                                                                                .join(
                                                                                    ""
                                                                                );

                                                                        return (
                                                                            <button
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="circular-button"
                                                                                style={{
                                                                                    backgroundColor:
                                                                                        "#56aaed",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    memberName
                                                                                }
                                                                            </button>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                {labels &&
                                                    anyLabelActive &&
                                                    labels.length > 0 && (
                                                        <div className="card-detail">
                                                            <h3 className="card-detail-header">
                                                                Labels
                                                            </h3>
                                                            <div className="card-detail-label-list">
                                                                {labels.map(
                                                                    (
                                                                        label,
                                                                        index
                                                                    ) =>
                                                                        label.is_active && (
                                                                            <span
                                                                                className="card-detail-label-text"
                                                                                key={
                                                                                    index
                                                                                }
                                                                                style={{
                                                                                    backgroundColor:
                                                                                        label.color !==
                                                                                            null &&
                                                                                        label.color !==
                                                                                            "null"
                                                                                            ? label.color
                                                                                            : "#3B444C",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    label?.name
                                                                                }
                                                                            </span>
                                                                        )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                            </>
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
                                                                clickTextarea()
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
                                                                fontSize:
                                                                    "12px",
                                                                fontWeight:
                                                                    "500",
                                                                pointerEvents:
                                                                    "none",
                                                                cursor: "default",
                                                            }}
                                                            rows="4"
                                                            placeholder={
                                                                fetchSingleCard?.description ??
                                                                "Add a more detailed description"
                                                            }
                                                        ></textarea>
                                                    )}
                                                    {showDescForm && (
                                                        <div className="description-form ">
                                                            <textarea
                                                                ref={
                                                                    textareaRef
                                                                }
                                                                className="form-control custom-description-form mb-2"
                                                                style={{
                                                                    resize: "none",
                                                                    fontSize:
                                                                        "13px",
                                                                    pointerEvents:
                                                                        "auto",
                                                                }}
                                                                rows="2"
                                                                value={
                                                                    descValue
                                                                }
                                                                onChange={
                                                                    handleTextareaChange
                                                                }
                                                            ></textarea>
                                                            <button
                                                                type="button"
                                                                className="modal-save"
                                                                style={{
                                                                    marginRight:
                                                                        "5px",
                                                                }}
                                                                onClick={() =>
                                                                    handleDescSubmit()
                                                                }
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="modal-cancel"
                                                                onClick={() =>
                                                                    handleDescCancel()
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

                                                <PrioritySelection
                                                    priorities={priorities}
                                                />
                                            </div>

                                            {/* checklist start */}

                                            {checklists &&
                                                checklists.length > 0 &&
                                                checklists.map(
                                                    (checklist, index) => {
                                                        const totalItems =
                                                            checklist.checklistitems
                                                                ? checklist
                                                                      .checklistitems
                                                                      .length
                                                                : 0;
                                                        // Calculate the number of completed checklist items
                                                        const completedItems =
                                                            checklist.checklistitems &&
                                                            checklist.checklistitems.filter(
                                                                (item) =>
                                                                    item.is_completed
                                                            ).length;
                                                        // Calculate the completion percentage
                                                        const completionPercentage =
                                                            totalItems > 0
                                                                ? Math.round(
                                                                      (completedItems /
                                                                          totalItems) *
                                                                          100
                                                                  )
                                                                : 0;
                                                        return (
                                                            <div
                                                                key={index}
                                                                className="card-detail"
                                                            >
                                                                <div className="card-detail-checklist-header d-flex mb-2">
                                                                    <div className="d-flex w-100">
                                                                        <BsCheck2Square className="card-sm-icon" />

                                                                        <h3
                                                                            className="card-detail-header m-0"
                                                                            style={{
                                                                                display:
                                                                                    editingChecklistId ===
                                                                                    checklist.id
                                                                                        ? "none"
                                                                                        : "block",
                                                                                cursor: "pointer",
                                                                            }}
                                                                            onClick={() =>
                                                                                handleEditChecklist(
                                                                                    checklist
                                                                                )
                                                                            }
                                                                        >
                                                                            {
                                                                                checklist.name
                                                                            }
                                                                        </h3>

                                                                        {editingChecklistId ===
                                                                            checklist.id && (
                                                                            <EditNameDescModal
                                                                                setNameFormText={
                                                                                    setNameFormText
                                                                                }
                                                                                nameFormText={
                                                                                    nameFormText
                                                                                }
                                                                                setEditingChecklistId={
                                                                                    setEditingChecklistId
                                                                                }
                                                                                editingChecklistId={
                                                                                    editingChecklistId
                                                                                }
                                                                                setEditingTaskId={
                                                                                    setEditingTaskId
                                                                                }
                                                                                editingTaskId={
                                                                                    editingTaskId
                                                                                }
                                                                            />
                                                                        )}
                                                                    </div>

                                                                    <div className="d-flex">
                                                                        {!(
                                                                            editingChecklistId ===
                                                                            checklist.id
                                                                        ) && (
                                                                            <button
                                                                                type="button"
                                                                                className="modal-edit"
                                                                                onClick={() =>
                                                                                    handleDeleteChecklist(
                                                                                        checklist
                                                                                    )
                                                                                }
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="card-detail-checklist-text ">
                                                                    <div className="d-flex align-items-center mb-3">
                                                                        <span className="progress-text">{`${completionPercentage}%`}</span>

                                                                        <div
                                                                            className="progress"
                                                                            role="progressbar"
                                                                            aria-valuemin="0"
                                                                            aria-valuemax="100"
                                                                            style={{
                                                                                height: "0.4rem",
                                                                                width: "100%",
                                                                            }}
                                                                        >
                                                                            <div
                                                                                className="progress-bar"
                                                                                style={{
                                                                                    width: `${completionPercentage}%`,
                                                                                }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="cheklist-item-list d-flex flex-column gap-1">
                                                                        {/* checklist item start */}
                                                                        {checklist
                                                                            ?.checklistitems
                                                                            ?.length >
                                                                            0 &&
                                                                            checklist.checklistitems.map(
                                                                                (
                                                                                    item,
                                                                                    idx
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            idx
                                                                                        }
                                                                                        className="d-flex justify-content-between align-items-center mb-2"
                                                                                    >
                                                                                        <div className="checklist-item-single d-flex gap-3 w-100">
                                                                                            <input
                                                                                                className="form-check-input m-0"
                                                                                                type="checkbox"
                                                                                                checked={
                                                                                                    item.is_completed
                                                                                                }
                                                                                                style={{
                                                                                                    cursor: "pointer",
                                                                                                }}
                                                                                                onChange={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    handleCheckboxChange(
                                                                                                        item,
                                                                                                        e
                                                                                                            .target
                                                                                                            .checked
                                                                                                    )
                                                                                                }
                                                                                            />

                                                                                            <label
                                                                                                className="form-check-label checklist-label"
                                                                                                style={{
                                                                                                    display:
                                                                                                        editingItemId ===
                                                                                                        item.id
                                                                                                            ? "none"
                                                                                                            : "block",

                                                                                                    textDecoration:
                                                                                                        item.is_completed
                                                                                                            ? "line-through"
                                                                                                            : "none",
                                                                                                }}
                                                                                            >
                                                                                                {
                                                                                                    item.name
                                                                                                }
                                                                                            </label>

                                                                                            {editingItemId ===
                                                                                                item.id && (
                                                                                                <EditNameDescModal />
                                                                                            )}
                                                                                        </div>
                                                                                        {!(
                                                                                            editingItemId ===
                                                                                            item.id
                                                                                        ) && (
                                                                                            <>
                                                                                                <BsPencil
                                                                                                    className="edit-item-pencil"
                                                                                                    onClick={() =>
                                                                                                        handleEditItem(
                                                                                                            item
                                                                                                        )
                                                                                                    }
                                                                                                />
                                                                                                <BsTrash
                                                                                                    className="card-sm-icon item-trash"
                                                                                                    style={{
                                                                                                        cursor: "pointer",
                                                                                                    }}
                                                                                                    onClick={() =>
                                                                                                        handleDeleteItem(
                                                                                                            item
                                                                                                        )
                                                                                                    }
                                                                                                />
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        {/* checklist item end */}
                                                                    </div>

                                                                    <button
                                                                        type="button"
                                                                        className="add-item"
                                                                        onClick={() =>
                                                                            handleAddItem(
                                                                                checklist
                                                                            )
                                                                        }
                                                                    >
                                                                        Add an
                                                                        item
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                        </div>

                                        {/* checklist end */}

                                        <div className="col-md-12 col-sm-12 col-lg-3 mt-3">
                                            <CardModalButton />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {addItem && (
                <AddItem
                    addItem={addItem}
                    setAddItem={setAddItem}
                    editingChecklistId={editingChecklistId}
                    setEditingChecklistId={setEditingChecklistId}
                />
            )}
            {selectItem && (
                <SelectionItem
                    selectItem={selectItem}
                    setSelectItem={setSelectItem}
                />
            )}
        </div>
    );
};

export default CardMainModal;
