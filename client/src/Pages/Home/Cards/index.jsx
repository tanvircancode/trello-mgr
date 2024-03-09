import { useEffect, useState } from "react";
import { BsBarChartSteps, BsCheck2Square } from "react-icons/bs";
import "./cards.scss";
import CardMainModal from "../../../Modal/CardModals/CardMainModal";
import { useDispatch, useSelector } from "react-redux";
import { setMakeBlur } from "../../../store";

const Card = () => {
    const [openNewCardModal, setOpenNewCardModal] = useState(false);
    const [cardTitle, setCardTitle] = useState("");

    const blur = useSelector((state) => state.makeBlur);
    const dispatch = useDispatch();

    const handleCardClick = () => {
        setOpenNewCardModal(true);
        dispatch(setMakeBlur({ makeBlur: true }));
    };

    const cancelAddCard = () => {
        setCardTitle("");
    };

    const handleCreateBoard = () => {};

    useEffect(() => {
        dispatch(setMakeBlur({ makeBlur: false }));
    }, []);

    return (
        <div className="card-list d-flex flex-wrap gap-3">
            <div
                className={`card custom-card ${
                    blur ? "is-blur disable-pointer-events" : ""
                }`}
                onClick={() => handleCardClick()}
            >
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <h6 className="card-subtitle mb-2 text-body-secondary">
                        Card Label
                    </h6>
                    <div className="desc-label">
                        <BsBarChartSteps className="card-sm-icon" />
                        <BsCheck2Square className="card-sm-icon" />
                    </div>

                    <span>priority</span>
                </div>
            </div>

            <div className="custom-card">
                <input
                    type="text"
                    className="form-control board-title-input"
                    value={cardTitle}
                    placeholder="Add a card"
                    onChange={(e) => setCardTitle(e.target.value)}
                />
                {cardTitle && (
                    <div className="d-flex align-items-center gap-3 mt-2 ">
                        <button
                            type="button"
                            className="btn btn-primary  create-card-button"
                            onClick={handleCreateBoard}
                        >
                            <span className="add-card-text">Add Card</span>
                        </button>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            style={{ fontSize: "12px" }}
                            onClick={cancelAddCard}
                        ></button>
                    </div>
                )}
            </div>

            <CardMainModal
                openNewCardModal={openNewCardModal}
                setOpenNewCardModal={setOpenNewCardModal}
            />
        </div>
    );
};

export default Card;
