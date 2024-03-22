import { useEffect } from "react";
import axios from "axios";
import { useSelector , useDispatch } from "react-redux";

import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import { setTasks } from "../../store";

const RemoveMember = ({
    users,
    setUsers,
    removeMemberId,
    setRemoveMemberId,
    projectId,
    setIsLoading,
}) => {
    console.log(removeMemberId);
    console.log(projectId);
    const dispatch = useDispatch();

    const token = useSelector((state) => state.token);

    const handleRemoveMember = async () => {
        await axios
            .delete(
                `${BASE_URL}/api/removemember/${projectId}/${removeMemberId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((res) => {
                console.log(res);

                if (res.data.status) {
                    setUsers(
                        users.filter((user) => user.id !== removeMemberId)
                    );
                    dispatch(setTasks({ tasks: res.data.project.tasks }));
                    // dispatch(
                    //     setSelectedTaskMembers({
                    //         selectedTaskMembers: updatedTaskUsers,
                    //     })
                    // );
                } else {
                    toast.error("Server is not responding");
                }
                setRemoveMemberId(null);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                if (
                    error.response &&
                    error.response?.status &&
                    error.response.data?.message
                ) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Server is not responding");
                }
                setRemoveMemberId(null);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        handleRemoveMember();
    }, []);

    return <div></div>;
};
export default RemoveMember;
