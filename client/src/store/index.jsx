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
        setOrgAndFolderLoading: (state, action) => {
            state.orgAndFolderLoading = action.payload.orgAndFolderLoading;
        },

        setOrganizations: (state, action) => {
            state.organizations = action.payload.organizations;
        },
        setSelectMenu: (state, action) => {
            if (state.selectMenu === null || state.selectMenu === undefined) {
                state.selectMenu = { menuType: "", typeValue: "" };
            }
            state.selectMenu.menuType = action.payload.menuType;
            state.selectMenu.typeValue = action.payload.typeValue;
        },
        setReloadPage: (state, action) => {
            state.reloadPage = action.payload.reloadPage;
        },

        setSelectedItems: (state, action) => {
            if (action.payload === null) {
                state.selectedItems = [];
            } else {
                state.selectedItems = action.payload.selectedItems;
            }
        },
        setPopup: (state, action) => {
            if (action.payload === null) {
                state.popup = null;
            } else {
                state.popup = action.payload.popup;
            }
        },
        setFetchSingleItem: (state, action) => {
            if (action.payload === null) {
                state.fetchSingleItem = null;
            } else if (action.payload.fetchSingleItem) {
                state.fetchSingleItem = action.payload.fetchSingleItem;
            } else {
                const { propertyName, value, type } = action.payload;

                if (type === null) {
                    state.fetchSingleItem[propertyName] = value;
                } else if (type === 1) {
                    state.fetchSingleItem.login[propertyName] = value;
                } else if (type === 2) {
                    state.fetchSingleItem.card[propertyName] = value;
                } else if (type === 3) {
                    state.fetchSingleItem.identity[propertyName] = value;
                }
            }
        },
    },
});

export const {
    setLogin,
    setLogout,
    setProjects,
    setTasks,
    setSelectedProject,
    setIsCardsLoading,
    setFetchSingleCard,
    setOrganizations,
    setSelectMenu,
    setOrgAndFolderLoading,
    setReloadPage,
    setShowTextarea,
    setMakeBlur,
    setMakeCardModalBlur,
    setPopup,
    setDotModal,
    setSelectedItems,
    setFetchSingleItem,
} = trelloSlice.actions;

export default trelloSlice.reducer;
