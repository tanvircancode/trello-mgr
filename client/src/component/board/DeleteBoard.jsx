
import { useEffect } from "react";
import axios from "axios";
import { useSelector , useDispatch } from "react-redux";

import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import { setMakeBlur, setProjects, setSelectedProject,setTasks, setSelectedProjectMembers } from "../../store";



const DeleteBoard = ({
    deleteProjectId,
    setDeleteProjectId,
    setIsLoading,
}) => {
    
    const dispatch = useDispatch();

    const token = useSelector((state) => state.token);

    const handleDeleteBoard = async () => {
        await axios
            .delete(
                `${BASE_URL}/api/deleteproject/${deleteProjectId}`,
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
                                selectedProjectMembers:
                                    allProjects[0].members,
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
                setDeleteProjectId(null);
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
                setDeleteProjectId(null);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        handleDeleteBoard();
    }, []);
  return (
    <div></div>
  )
}

export default DeleteBoard