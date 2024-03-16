

import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPriorities, setTasks } from "../../store";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";


export const DeletePriority = ({deletingPriority, setDeletingPriority}) => {

    console.log(deletingPriority);
    const token = useSelector((state) => state.token);
    const priorityId = deletingPriority.id;


    const dispatch = useDispatch();

    const handleDeletePriority = async () => {
        
        await axios
            .delete(`${BASE_URL}/api/deletepriority/${priorityId}`,  {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
            .then((res) => {
                // console.log(res);

                if (res.data.status) {
                    dispatch(setTasks({ tasks: res.data.project.tasks }));
                    dispatch(setPriorities({ priorities: res.data.task.priorities }));
                    // toast.success(res.data.message);
                } else {
                    toast.error("Server is not responding");
                }
                setDeletingPriority(null);
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
        handleDeletePriority();
    }, []);


  return (
    <div></div>
  )
}
