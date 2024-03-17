import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    setDotModal: false,
    makeBlur: false,
    makeCardModalBlur: false,
    showTextarea: { type: null, value: null }, //confuse
    projects: [],
    tasks: [],
    labels: [],
    priorities: [],
    checklists: [],
    fetchSingleCard: null,
    selectedProject: null,
    isCardsLoading: true,
};

export const trelloSlice = createSlice({
    name: "trello",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
            state.projects = [];
            state.tasks = [];
            state.labels = [];
            state.fetchSingleCard = null;
            state.selectedProject = null;
        },
        //start trello

        setShowTextarea: (state, action) => {
            if (
                state.showTextarea === null ||
                state.showTextarea === undefined
            ) {
                state.showTextarea = { type: null, value: null };
            }
            state.showTextarea.type = action.payload.type;
            state.showTextarea.value = action.payload.value;
        },
        setMakeBlur: (state, action) => {
            state.makeBlur = action.payload.makeBlur;
        },
        setMakeCardModalBlur: (state, action) => {
            state.makeCardModalBlur = action.payload.makeCardModalBlur;
        },
        setProjects: (state, action) => {
            if (action.payload === null) {
                state.projects = [];
            } else {
                state.projects = action.payload.projects;
            }
        },
        setTasks: (state, action) => {
            if (action.payload === null) {
                state.tasks = [];
            } else {
                state.tasks = action.payload.tasks;
            }
        },
        setLabels: (state, action) => {
            if (action.payload === null) {
                state.labels = [];
            } else {
                state.labels = action.payload.labels;
            }
        },
        setPriorities: (state, action) => {
            if (action.payload === null) {
                state.priorities = [];
            } else {
                state.priorities = action.payload.priorities;
            }
        },
        setChecklists: (state, action) => {
            if (action.payload === null) {
                state.checklists = [];
            } else {
                state.checklists = action.payload.checklists;
            }
        },
       
        setSelectedProject: (state, action) => {
            if (action.payload === null) {
                state.selectedProject = null;
            } else {
                state.selectedProject = action.payload.selectedProject;
            }
        },
        setIsCardsLoading: (state, action) => {
            state.isCardsLoading = action.payload.isCardsLoading;
        },
        setFetchSingleCard: (state, action) => {
            if (action.payload === null) {
                state.fetchSingleCard = null;
            } else if (action.payload.fetchSingleCard) {
                state.fetchSingleCard = action.payload.fetchSingleCard;
            }
        },
        // end trello
    },
});

export const {
    setLogin,
    setLogout,
    setProjects,
    setTasks,
    setLabels,
    setPriorities,
    setChecklists,
   
    setSelectedProject,
    setIsCardsLoading,
    setFetchSingleCard,
    setShowTextarea,
    setMakeBlur,
    setMakeCardModalBlur,
} = trelloSlice.actions;

export default trelloSlice.reducer;
