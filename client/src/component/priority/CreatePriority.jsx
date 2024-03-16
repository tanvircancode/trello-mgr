import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
    setMakeCardModalBlur,
    setLabels,
    setTasks,
    setMakeBlur,
    setPriorities,
} from "../../store";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

const CreatePriority = ({ title, setShowCreatePriority , setPriorityTitle}) => {
    const userId = localStorage.getItem("user_id");
    const token = useSelector((state) => state.token);
    const fetchSingleCard = useSelector((state) => state.fetchSingleCard);
    

    const dispatch = useDispatch();


    const handleCreatePriority = async () => {
    
        var formData = new FormData();
        formData.append("name", title);
        formData.append("color", "#3B444C");
        formData.append("user_id", userId);
        formData.append("task_id", fetchSingleCard.id);
        formData.append("project_id", fetchSingleCard.project_id);
        formData.append("is_active", 0);
       
        await axios
            .post(`${BASE_URL}/api/priority`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            })
            .then((res) => {
                // console.log(res);

                if (res.data.status && res.status === 200) {
                    dispatch(setTasks({ tasks: res.data.project.tasks }));
                    dispatch(setPriorities({ priorities: res.data.task.priorities }));
                    // toast.success(res.data.message);
                } else {
                    toast.error("Server is not responding");
                }
              
                setShowCreatePriority(false);
               
                setPriorityTitle("");
               
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
        handleCreatePriority();
    }, []);

    return <div></div>;
};

export default CreatePriority;
