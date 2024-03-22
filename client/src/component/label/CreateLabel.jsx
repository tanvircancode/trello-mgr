import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
    setMakeCardModalBlur,
    setLabels,
    setTasks,
    setMakeBlur,
} from "../../store";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";


const CreateLabel = ({
    title,
    setTitle,
    labelColor,
    taskId,
    is_active,
    projectId,
    openLabelModal,
    setOpenLabelModal,
    isEditLabel,
    setIsEditLabel,
    openEditLabelModal,
    setOpenEditLabelModal,
    editingLabel,
    setEditingLabel,
    setShowCreateLabel
}) => {
    const userId = localStorage.getItem("user_id");
    const token = useSelector((state) => state.token);

    const dispatch = useDispatch();

    const cancelModalAll = () => {
        console.log(isEditLabel);
        setOpenLabelModal(false);
        setIsEditLabel(false);
        setOpenEditLabelModal(false);
        dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
    };


    const handleCreateLabel = async () => {

        var formData = new FormData();
        formData.append("name", title);
        formData.append("color", labelColor);
        formData.append("user_id", userId);
        formData.append("task_id", taskId);
        formData.append("is_active", is_active);
        formData.append("project_id", projectId);
        console.log(labelColor)


       await axios
            .post(`${BASE_URL}/api/label`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            })
            .then((res) => {
                console.log(res);

                if (res.data.status && res.status === 200) {
                    dispatch(setTasks({ tasks: res.data.project.tasks }));
                    dispatch(setLabels({ labels: res.data.task.labels }));
                    // toast.success(res.data.message);
                } else {
                    toast.error("Server is not responding");
                }
                cancelModalAll();
                // setOpenLabelModal(false);
                // dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
                setTitle("");
                setShowCreateLabel(false);
            })
            .catch((error) => {
                // console.log(error)
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

    useEffect(() => {
        handleCreateLabel();
    }, []);

    return <div></div>;
};

export default CreateLabel;
