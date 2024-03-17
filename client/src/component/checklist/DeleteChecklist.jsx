import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setChecklists, setTasks } from "../../store";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

const DeleteChecklist = ({ deletingChecklist, setDeletingChecklist }) => {
    const token = useSelector((state) => state.token);
    const checklistId = deletingChecklist.id;

    const dispatch = useDispatch();

    const handleDeleteChecklist = async () => {
        await axios
            .delete(`${BASE_URL}/api/deletechecklist/${checklistId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                console.log(res);

                if (res.data.status) {
                    dispatch(setTasks({ tasks: res.data.project.tasks }));
                    dispatch(setChecklists({ checklists: res.data.task.checklists }));
                    // toast.success(res.data.message);
                } else {
                    toast.error("Server is not responding");
                }
                setDeletingChecklist(null);
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
        handleDeleteChecklist();
    }, []);
    return <div></div>;
};

export default DeleteChecklist;
