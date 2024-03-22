import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

const AddMember = ({
    users,
    setUsers,
    addMemberId,
    setAddMemberId,
    projectId,
    setIsLoading,
    ownerId,
}) => {
    const token = useSelector((state) => state.token);

    const handleAddMember = async () => {
        var formData = new FormData();

        formData.append("user_id", addMemberId);
        formData.append("project_id", projectId);
        formData.append("owner_id", ownerId);

        await axios
            .post(`${BASE_URL}/api/addmember`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            })
            .then((res) => {
                console.log(res);

                if (res.data.status) {
                    setUsers(
                        users.map((user) => {
                            if (user.id === addMemberId) {
                                return { ...user, isMember: true };
                            }
                            return user;
                        })
                    );
                } else {
                    toast.error("Server is not responding");
                }
                setAddMemberId(null);
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
                setAddMemberId(null);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        handleAddMember();
    }, []);

    return <div></div>;
};

export default AddMember;
