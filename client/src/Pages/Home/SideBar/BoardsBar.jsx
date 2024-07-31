import "../home.scss";
import { BsTrash3 } from "react-icons/bs";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
    setIsCardsLoading,
    setProjects,
    setSelectedProject,
    setSelectedProjectMembers,
    setTasks,
    setStages,
} from "../../../store";
import CreateBoardModal from "../../../Modal/BoardModals/CreateBoardModal";
import DeleteBoard from "../../../component/board/DeleteBoard";

const BoardsBar = () => {
    const [deleteProjectId, setDeleteProjectId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const userId = localStorage.getItem("user_id");
    const token = useSelector((state) => state.token);
    const projects = useSelector((state) => state.projects);

    const selectedProject = useSelector((state) => state.selectedProject);

    const dispatch = useDispatch();

    var colors = [
        "#03a9f4",
        "#007BFF",
        "#009688",
        "#795548",
        "#1F2022",
        "#4b6387",
        "#f44336",
        "#e91e63",
        "#9c27b0",
        "#673ab7",
        "#424242",
        "#C02942",
        "#607d8b",
        "#3f51b5",
        "#2196f3",
    ];

    const handleDeleteProject = (projectId) => {
        setIsLoading(true);
        setDeleteProjectId(projectId);
    };

    const handleClickSingleProject = async (project) => {
        await axios
            .get(`${BASE_URL}/api/projects/` + userId, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                if (res.data?.status && res.status === 200) {
                    console.log(res.data);
                    const allProjects = res.data.data;

                    dispatch(setProjects({ projects: allProjects }));
                    // console.log(allProjects)

                    const filteredProject = allProjects.find(
                        (singleProj) => singleProj.id === project.id
                    );

                    console.log(filteredProject);

                    dispatch(
                        setSelectedProject({
                            selectedProject: filteredProject,
                        })
                    );
                    dispatch(
                        setSelectedProjectMembers({
                            selectedProjectMembers: filteredProject.members,
                        })
                    );

                    dispatch(
                        setStages({
                            stages: filteredProject.stages,
                        })
                    );
                    // dispatch(
                    //     setTasks({
                    //         tasks: filteredProject.stages.tasks,
                    //     })
                    // );
                }
            })
            .catch((error) => {
                if (
                    error.response &&
                    error.response?.data?.status &&
                    !error.response.data.status
                ) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Server is not responding");
                }
            });

        dispatch(setIsCardsLoading({ isCardsLoading: false }));
    };

    const getProjectsData = async () => {
        await axios
            .get(`${BASE_URL}/api/projects/` + userId, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                console.log(res.data);

                if (res.data?.status && res.status === 200) {
                    const allProjects = res.data.data;

                    if (allProjects.length > 0) {
                        dispatch(setProjects({ projects: allProjects }));
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
                            setStages({
                                stages: allProjects[0].stages,
                            })
                        );
                        // dispatch(
                        //     setTasks({
                        //         tasks: allProjects[0].stages.tasks,
                        //     })
                        // );
                    }
                }
            })
            .catch((error) => {
                if (
                    error.response &&
                    error.response?.data?.status &&
                    !error.response.data.status
                ) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Server is not responding");
                }
            });

        dispatch(setIsCardsLoading({ isCardsLoading: false }));
    };

    useEffect(() => {
        getProjectsData();
    }, []);

    return (
        <div>
            {deleteProjectId && (
                <DeleteBoard
                    deleteProjectId={deleteProjectId}
                    setDeleteProjectId={setDeleteProjectId}
                    setIsLoading={setIsLoading}
                />
            )}
            <span className="sidebar-text" style={{ fontWeight: "bold" }}>
                Your projects
            </span>
            {projects && projects.length > 0 && (
                <ul className="list-group list-group-flush">
                    {projects &&
                        projects.map((project, index) => (
                            <li
                                key={project.id}
                                className="list-group-item d-flex justify-content-between align-items-center no-left-padding no-border"
                            >
                                <div
                                    className="d-flex align-items-center"
                                    onClick={() =>
                                        handleClickSingleProject(project)
                                    }
                                >
                                    <div
                                        className="icon-color"
                                        style={{
                                            backgroundColor:
                                                colors[index % colors.length],
                                        }}
                                    ></div>
                                    <span
                                        className={`sidebar-text ${
                                            selectedProject.id === project.id
                                                ? "active-menu"
                                                : ""
                                        }`}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {project.title}
                                    </span>
                                </div>
                                {project.is_owner && (
                                    <BsTrash3
                                        className="custom-sm-trash-icon"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            handleDeleteProject(project.id)
                                        }
                                    />
                                )}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};

export default BoardsBar;
