import { useEffect, useState } from "react";
import { BsBarChartSteps, BsCheck2Square } from "react-icons/bs";
import "./cards.scss";
import CardMainModal from "../../../Modal/CardModals/CardMainModal";
import { useDispatch, useSelector } from "react-redux";
import { setMakeBlur } from "../../../store";

const Card = () => {
    const [openNewCardModal, setOpenNewCardModal] = useState(false);

    const blur = useSelector((state) => state.makeBlur);
    const dispatch = useDispatch();


    const handleCardClick = () => {
        setOpenNewCardModal(true);
        dispatch(setMakeBlur({ makeBlur: true }));
    }

    useEffect(() => {
        dispatch(setMakeBlur({ makeBlur: false }));
    },[]);

    return (
        <>
            <div
                className={`card custom-card ${blur ? "is-blur disable-pointer-events" : ""}`}
                style={{ width: "18rem" , cursor:'pointer'}}
                onClick={() => handleCardClick()}
            >
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <h6 className="card-subtitle mb-2 text-body-secondary">
                        Card Labels
                    </h6>
                    <div className="desc-label">
                        <BsBarChartSteps className="card-sm-icon" />
                        <BsCheck2Square className="card-sm-icon" />
                    </div>

                    <span>priority</span>
                </div>
            </div>
            <CardMainModal
                openNewCardModal={openNewCardModal}
                setOpenNewCardModal={setOpenNewCardModal}
            />
        </>
    );
};

export default Card;
