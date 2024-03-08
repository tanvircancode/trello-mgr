
import { BsPencil } from "react-icons/bs";
import "./cardmodal.scss";
import { useDispatch, useSelector } from "react-redux";
import { setMakeCardModalBlur } from "../../store";
import { useState, useEffect } from "react";
import { BlockPicker } from "react-color";



const PriorityEditModal = ({
    openEditPriorityModal,
    setOpenEditPriorityModal,
}) => {

    const [labelColor, setLabelColor] = useState("#f44336");
    const handleChangeComplete = (color) => {
        setLabelColor(color.hex);
    };

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
        setOpenEditPriorityModal(false);
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
                                Priority
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
                                    className="btn btn-primary create-button mt-3"
                                    // onClick={() => handleCreateLabel()}
                                >
                                    <span>Update</span>
                                </button>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriorityEditModal;
