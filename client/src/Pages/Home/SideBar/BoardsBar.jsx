import "../home.scss";
import { BsTrash3 } from "react-icons/bs";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
    setIsCardsLoading,
    setIsLoggedUserOwner,
    setProjects,
    setSelectedProject,
    setSelectedProjectMembers,
    setTasks,
} from "../../../store";

const BoardsBar = () => {
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

    const handleClickSingleProject = async (project) => {
        await axios
            .get(`${BASE_URL}/api/projects/` + userId, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                console.log(res);
                if (res.data?.status && res.status === 200) {
                    const allProjects = res.data.data;

                    dispatch(setProjects({ projects: allProjects }));
                    console.log(projects);

                    const filteredProject = allProjects.find(
                        (singleProj) => singleProj.id === project.id
                    );
                    console.log(filteredProject)
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
                        setTasks({
                            tasks: filteredProject.tasks,
                        })
                    );

                    if (filteredProject.user_id === userId) {
                        dispatch(
                            setIsLoggedUserOwner({
                                isLoggedUserOwner: true,
                            })
                        );
                    }
                }
            })
            .catch((error) => {
                console.log(error);

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
                console.log(res);
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
                            setTasks({
                                tasks: allProjects[0].tasks,
                            })
                        );

                        if (allProjects[0].user_id === userId) {
                            dispatch(
                                setIsLoggedUserOwner({
                                    isLoggedUserOwner: true,
                                })
                            );
                        }
                        console.log(selectedProject);
                    }
                }
            })
            .catch((error) => {
                console.log(error);

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
        // setLoading(false);
        // console.log(projects);
    };

    useEffect(() => {
        getProjectsData();
    }, []);

    return (
        <div>
            <span className="sidebar-text" style={{ fontWeight: "bold" }}>
                Your projects
            </span>
            {projects && projects.length > 0 && (
                <ul className="list-group list-group-flush">
                    {projects && projects.map((project, index) => (
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
                                <BsTrash3 className="custom-sm-trash-icon" />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BoardsBar;
