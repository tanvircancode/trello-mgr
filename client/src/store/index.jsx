import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    setDotModal: false,
    makeBlur: false,
    makeCardModalBlur: false,
    projects: [],
    tasks: [],
    labels: [],
    priorities: [],
    checklists: [],
    selectedProjectMembers: [],
    selectedTaskMembers: [],
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
           
            state.selectedProjectMembers = [],
            state.selectedTaskMembers = [],
            state.priorities = [],
            state.checklists = [],
            state.isCardsLoading = true
        },
        //start trello

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
        setSelectedProjectMembers: (state, action) => {
            if (action.payload === null) {
                state.selectedProjectMembers = [];
            } else {
                state.selectedProjectMembers = action.payload.selectedProjectMembers;
            }
        },
        
        setSelectedTaskMembers: (state, action) => {
            if (action.payload === null) {
                state.selectedTaskMembers = [];
            } else {
                state.selectedTaskMembers = action.payload.selectedTaskMembers;
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
    setSelectedProjectMembers,
    setSelectedTaskMembers,
    setSelectedProject,
    setIsCardsLoading,
    setFetchSingleCard,
    setMakeBlur,
    setMakeCardModalBlur
} = trelloSlice.actions;

export default trelloSlice.reducer;
