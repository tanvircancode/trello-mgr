import { BsArrowLeftShort } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
    setShowCopyStage,
    setShowStageAction,
    setStages,
} from "../../store";

import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import "./copyStage.scss";

const CopyStage = () => {
    const dispatch = useDispatch();

    const projects = useSelector((state) => state.projects);
    const selectedProject = useSelector((state) => state.selectedProject);
    const selectedStage = useSelector((state) => state.selectedStage);
    const token = useSelector((state) => state.token);
    const userId = localStorage.getItem("user_id");
    console.log(selectedStage);

    const handleCopyStageClick = (showCopyStage, showStageAction) => {
        dispatch(setShowCopyStage({ showCopyStage }));
        dispatch(setShowStageAction({ showStageAction }));
    };

  
    const handleCreateList = async () => {
        const projectId = selectedProject.id;

        const payload = {
            project_id: projectId,
            user_id: userId,
        };

        await axios
            .post(`${BASE_URL}/api/copystage`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            })
            .then((res) => {
                console.log(res.data);
                if (res.data?.status && res.data?.data) {
                    dispatch(setStages({ stages: res.data.data.stages }));
                    dispatch(setShowCopyStage({ showCopyStage: false }));
                    toast.success(res.data.message);
                } else {
                    toast.error("Server is not responding");
                }
            })
            .catch((error) => {
                if (
                    error.response &&
                    error.response?.status &&
                    error.response.data?.message
                ) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Server is not responding");
                }
            });
    };

    return (
        <div
            className="card"
            style={{
                width: "18rem",
                padding: "0 15px 10px",
                position: "absolute",
                zIndex: 1000,
            }}
        >
            <div
                className="card-header d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
            >
                <BsArrowLeftShort
                    onClick={() => handleCopyStageClick(false, true)}
                />

                <span>Copy list</span>
                <div
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCopyStageClick(false, false)}
                >
                    x
                </div>
            </div>
            <label>
                Name
                <textarea name="copiedName" rows={4} cols={20} />
            </label>

            <br />

            <button
                onClick={handleCreateList}
                type="button"
                className="move-button"
            >
                Create list
            </button>
        </div>
    );
};

export default CopyStage;
