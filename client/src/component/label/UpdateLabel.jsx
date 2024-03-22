import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLabels, setTasks } from "../../store";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

const UpdateLabel = ({
    title,
    setTitle,
    labelColor,
    editingLabel,
    setEditingLabel,
    isEditLabel,
    setIsEditLabel,
    setOpenLabelModal,
    setShowUpdateLabel,
}) => {
    console.log(editingLabel);
    const userId = localStorage.getItem("user_id");
    const token = useSelector((state) => state.token);
    const labelId = editingLabel.id;
    console.log(labelColor)

    const cancelModalAll = () => {
        setOpenLabelModal(false);
        setIsEditLabel(false);
        setShowUpdateLabel(false);
        setTitle("");
        setEditingLabel(null);
    };

    const dispatch = useDispatch();

    const handleUpdateLabel = async () => {
        if(!labelColor) {
            labelColor = "";
        console.log(labelColor)

        }
        
        var formData = new FormData();
        formData.append("name", title);
        formData.append("color", labelColor);
        formData.append("user_id", userId);
        formData.append("task_id", editingLabel.task_id);
        formData.append("is_active", editingLabel.is_active ? 1 : 0);

        await axios
            .put(`${BASE_URL}/api/label/${labelId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            })
            .then((res) => {
                // console.log(res);

                if (res.data.status) {
                    dispatch(setTasks({ tasks: res.data.project.tasks }));
                    dispatch(setLabels({ labels: res.data.task.labels }));
                    // toast.success(res.data.message);
                } else {
                    toast.error("Server is not responding");
                }
                cancelModalAll();
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
        setTitle("");
        setIsEditLabel(false);
        setShowUpdateLabel(false);
    };

    useEffect(() => {
        handleUpdateLabel();
    }, []);

    return <div></div>;
};

export default UpdateLabel;
