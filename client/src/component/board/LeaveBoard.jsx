import { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import {
    setMakeBlur,
    setProjects,
    setSelectedProject,
    setTasks,
    setSelectedProjectMembers,
} from "../../store";

const LeaveBoard = ({ leaveProjectId, setLeaveProjectId, setIsLoading }) => {
    const dispatch = useDispatch();

    const token = useSelector((state) => state.token);
    const userId = localStorage.getItem("user_id");

    const handleLeaveBoard = async () => {
        await axios
            .delete(
                `${BASE_URL}/api/leaveproject/${leaveProjectId}/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((res) => {
                

                if (res.data?.status) {
                    const allProjects = res.data.data;
                    dispatch(setProjects({ projects: allProjects }));
                    if (allProjects.length > 0) {
                        dispatch(
                            setSelectedProject({
                                selectedProject: allProjects[0],
                            })
                        );
                        dispatch(
                            setSelectedProjectMembers({
                                selectedProjectMembers: allProjects[0].members,
                            })
                        );

                        dispatch(
                            setTasks({
                                tasks: allProjects[0].tasks,
                            })
                        );
                    }
                    toast.success(res.data?.message);
                } else {
                    toast.error("Server is not responding");
                }
                setLeaveProjectId(null);
                setIsLoading(false);
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
                setLeaveProjectId(null);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        handleLeaveBoard();
    }, []);
    return <div></div>;
};

export default LeaveBoard;
