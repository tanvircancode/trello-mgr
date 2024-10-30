import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {  setFetchSingleCard, setTasks } from "../../store";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

const EditDescription = ({
    setShowDescForm,
    descValue,
    setDescValue,
    setShowEditDesc,
    fetchSingleCard,
}) => {
  

    const userId = localStorage.getItem("user_id");
    const token = useSelector((state) => state.token);
    const taskId = fetchSingleCard.id;
    const projectId = fetchSingleCard.project_id;
    const dispatch = useDispatch();


    const clearAllState = () => {
        setShowDescForm(false);
        setShowEditDesc(false);
        setDescValue("");
       
    };

    const handleEditDescription = async () => {
        var formData = new FormData();

        formData.append("user_id", userId);
        formData.append("id", taskId);
        formData.append("project_id", projectId);
        formData.append("description", descValue);

        await axios
            .put(`${BASE_URL}/api/task`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            })
            .then((res) => {
                
                if (res.data.status) {
                    dispatch(setTasks({ tasks: res.data.project.tasks }));
                    dispatch(setFetchSingleCard({ fetchSingleCard: res.data.task}));
                    
                    // toast.success(res.data.message);
                } else {
                    toast.error("Server is not responding");
                }
                clearAllState();
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

    useEffect(() => {
        handleEditDescription();
    }, []);

    return <div></div>;
};

export default EditDescription;
