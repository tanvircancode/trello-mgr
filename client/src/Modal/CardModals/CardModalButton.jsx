import "../modal.scss";
import { useState, useEffect } from "react";

import {
    BsPerson,
    BsSticky,
    BsCheck2Square,
    BsMegaphoneFill,
} from "react-icons/bs";
import MemberModal from "./MemberModal";
import LabelModal from "./LabelModal";
import ChecklistModal from "./ChecklistModal";
import PriorityModal from "./PriorityModal";
import { useDispatch, useSelector } from "react-redux";
import { setMakeBlur, setMakeCardModalBlur } from "../../store";
import EditLabel from "./EditLabel";

const CardModalButton = () => {
    const [openMemberModal, setOpenMemberModal] = useState(false);
    const [openLabelModal, setOpenLabelModal] = useState(false);
    const [openEditLabelModal, setOpenEditLabelModal] = useState(false);
    const [isEditLabel, setIsEditLabel] = useState(false);
    const [openChecklistModal, setOpenChecklistModal] = useState(false);
    const [openPriorityModal, setOpenPriorityModal] = useState(false);

    const blur = useSelector((state) => state.makeBlur);
    const cardModalblur = useSelector((state) => state.makeCardModalBlur);
    


    var doBlur = blur && cardModalblur;

    const dispatch = useDispatch();

    const handleModal = (value) => {
        dispatch(setMakeBlur({ makeBlur: true }));
        dispatch(setMakeCardModalBlur({ makeCardModalBlur: true }));
        
        if (value === "member") {
            setOpenMemberModal(true);
        } else if (value === "label") {
            setOpenEditLabelModal(true);
            // setOpenLabelModal(true);
        } else if (value === "checklist") {
            setOpenChecklistModal(true);
        } else if (value === "priority") {
            setOpenPriorityModal(true);
        }
    };

    return (
        <div>
            <h3 className="add-to-card-header">Actions</h3>
            <div
                className={`btn-group-vertical w-100 ${
                    doBlur ? "is-blur disable-pointer-events" : ""
                }`}
                role="group"
                aria-label="Vertical button group"
            >
             
              <button
                    type="button"
                    className="btn btn-primary card-button d-flex align-items-center"
                    onClick={() => handleModal("member")}
                >
                    <BsPerson className="card-sm-icon" /> Members
                </button>
                
                <button
                    type="button"
                    className="btn btn-primary card-button"
                    onClick={() => handleModal("label")}
                >
                    <BsSticky className="card-sm-icon" /> Labels
                </button>
                <button
                    type="button"
                    className="btn btn-primary card-button"
                    onClick={() => handleModal("checklist")}
                >
                    <BsCheck2Square className="card-sm-icon" /> Checklist
                </button>
                <button
                    type="button"
                    className="btn btn-primary card-button"
                    onClick={() => handleModal("priority")}
                >
                    <BsMegaphoneFill className="card-sm-icon" /> Priority
                </button>
            </div>

            {openMemberModal && (
                <MemberModal
                    openMemberModal={openMemberModal}
                    setOpenMemberModal={setOpenMemberModal}
                />
            )}

            {openLabelModal && (
                <LabelModal
                    openLabelModal={openLabelModal}
                    setOpenLabelModal={setOpenLabelModal}
                    isEditLabel={isEditLabel}
                    setIsEditLabel={setIsEditLabel}
                    openEditLabelModal={openEditLabelModal}
                    setOpenEditLabelModal={setOpenEditLabelModal}
                />
            )}

            {openEditLabelModal && (
                <EditLabel
                    openEditLabelModal={openEditLabelModal}
                    setOpenEditLabelModal={setOpenEditLabelModal}
                />
            )}

            {openChecklistModal && (
                <ChecklistModal
                    openChecklistModal={openChecklistModal}
                    setOpenChecklistModal={setOpenChecklistModal}
                />
            )}

            {openPriorityModal && (
                <PriorityModal
                    openPriorityModal={openPriorityModal}
                    setOpenPriorityModal={setOpenPriorityModal}
                />
            )}
        </div>
    );
};

export default CardModalButton;
