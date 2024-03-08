import { useState, useEffect } from "react";
import "./cardmodal.scss";
import { useDispatch } from "react-redux";
import { setMakeCardModalBlur } from "../../store";
import { BlockPicker } from "react-color";

 const ChecklistModal = ({openChecklistModal, setOpenChecklistModal}) => {

  const dispatch = useDispatch();

  const cancelModal = () => {
    setOpenChecklistModal(false);

    dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
};

  return (
    <div>
    <div>
        <label className="form-label">Title</label>
        <input type="email" className="form-control" />
    </div>
    <div
        className={`modal fade ${openChecklistModal ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{
            display: openChecklistModal ? "block" : "none",
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
                        Add Checklist
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
                            className="form-control"
                            style={{ padding: "0.2rem" }}
                        />
                    </div>

                    
              
                    <button
                        type="button"
                        className="btn btn-primary card-button d-flex align-items-center create-button justify-content-center"
                        onClick={() => handleAddChecklist()}
                    >
                      <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}
export default ChecklistModal;
