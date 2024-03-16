import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setTasks, setPriorities } from "../../store";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

const PrioritySelection = () => {
    const priorities = useSelector((state) => state.priorities);
    const userId = localStorage.getItem("user_id");
    const token = useSelector((state) => state.token);

    const dispatch = useDispatch();

    const [selectedPriorityId, setSelectedPriorityId] = useState(null);

    const handleChange = async (event) => {
        const newPriorityId = event.target.value;

        setSelectedPriorityId(newPriorityId);

        const taskId = priorities[0].task_id;

        var formData = new FormData();
        formData.append("id", newPriorityId);
        formData.append("user_id", userId);
        formData.append("task_id", taskId);

        await axios
            .put(`${BASE_URL}/api/changepriority`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            })
            .then((res) => {
                // console.log(res);

                if (res.data.status) {
                    dispatch(setTasks({ tasks: res.data.project.tasks }));
                    dispatch(
                        setPriorities({ priorities: res.data.task.priorities })
                    );
                    // toast.success(res.data.message);
                } else {
                    toast.error("Server is not responding");
                }
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

    const getPriorityColor = () => {
        const activePriorityColor = priorities.find((p) => p.is_active);
        return activePriorityColor?.color || null;
    };

    useEffect(() => {
        const fetchActivePriority = async () => {
            if (priorities?.length) {
                const activePriority = priorities.find((p) => p.is_active);
                setSelectedPriorityId(activePriority?.id || null);
            }
        };
        fetchActivePriority();
    }, [priorities]);

    return (
        <select
            className="form-select priority-dropdown"
            style={{
                backgroundColor: selectedPriorityId === null ? '#3B444C' : getPriorityColor(),
                color: "#ffffff",
                paddingLeft: "12px",
                fontWeight:'600'
            }}
            value={selectedPriorityId}
            onChange={handleChange}
        >
            <option value={null} style={{backgroundColor:'#3B444C', color: "#ffffff"}}>--Select--</option>
            {priorities.map((priority) => (
                <option
                    key={priority.id}
                    value={priority.id}
                    style={{
                        backgroundColor: "#3B444C",
                        color: "#ffffff",
                        fontWeight:'600'
                    }}
                >
                    {priority.name}
                </option>
            ))}
        </select>
    );
};

export default PrioritySelection;
