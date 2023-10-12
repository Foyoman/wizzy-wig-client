import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { saveFile, createFile } from "./apiSlice";

import { File, SortKeys } from "../types/index";
import { sortFileSystem, findById } from "./helpers";
import { RootState } from "./store";
import { loginUser, register } from "./authSlice";

export interface AppState {
  user: Boolean;
  files: File[];
  markdown: string | null | undefined;
  showSidebar: boolean;
  allowSave: boolean;
  tabs: Array<File["id"] | null>;
  selectedTab: number;
  selectedItem: File["id"] | null;
  selectedFile: File["id"] | null;
  selectedFolder: File["id"] | null;
}

const initialState: AppState = {
  user: false,
  files: [],
  markdown: "",
  showSidebar: true,
  allowSave: false,
  tabs: [null],
  selectedTab: 0,
  selectedItem: null,
  selectedFile: null,
  selectedFolder: null,
};

const setLastOpenedTabs = (tabs: Array<number | null | undefined>) => {
  const stringifiedTabs = JSON.stringify(tabs);
  localStorage.setItem("lastOpenedTabs", stringifiedTabs);
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setStaticProps: (state, action: PayloadAction<File[]>) => {
      localStorage.removeItem("lastOpenedTabs");
      localStorage.removeItem("lastOpenedTabIndex");

      const starterFiles = action.payload;
      const welcomeFile = starterFiles.find((file) => file.id === 1);
      const rootFilesIds = starterFiles
        .filter((file) => !file.is_folder)
        .map((file) => file.id);

      state.files = sortFileSystem(starterFiles, "title", false);
      state.selectedFile = welcomeFile?.id || null;
      state.tabs = rootFilesIds;
      state.selectedTab = 0;
      state.markdown = welcomeFile?.content;
    },
    setUserData: (state, action: PayloadAction<File[] | []>) => {
      state.user = true;
      const userFiles = action.payload;
      state.files = sortFileSystem(userFiles, "title", false); // use local storage to set user's preferred sort

      const lastOpenedTabsStringified = localStorage.getItem("lastOpenedTabs");
      const lastOpenedTabIndexStringified =
        localStorage.getItem("lastOpenedTabIndex");
      let lastOpenedTabs = [null];
      let lastOpenedTabIndex = 0;

      if (lastOpenedTabsStringified) {
        try {
          lastOpenedTabs = JSON.parse(lastOpenedTabsStringified);
        } catch (error) {
          console.error("Error parsing the stored tabs:", error);
        }
      }

      if (lastOpenedTabIndexStringified) {
        try {
          lastOpenedTabIndex = Number(
            JSON.parse(lastOpenedTabIndexStringified)
          );
        } catch (error) {
          console.error("Error parsing the stored tab index:", error);
        }
      }

      state.tabs = lastOpenedTabs;
      state.selectedTab = lastOpenedTabIndex;

      const lastOpenedFile: File = findById({
        items: userFiles,
        key: "find",
        needle: lastOpenedTabs[lastOpenedTabIndex],
      });
      if (lastOpenedFile) {
        console.log("lastOpenedFile:", lastOpenedFile);
        state.selectedFile = lastOpenedFile.id;
        state.markdown = lastOpenedFile.content;
      }
    },
    sortFs: (
      state,
      action: PayloadAction<{
        items: File[];
        sortKey: SortKeys;
        reverse: boolean;
      }>
    ) => {
      const { items, sortKey, reverse } = action.payload;
      state.files = sortFileSystem(items, sortKey, reverse); // or user's sort pref
    },
    selectFolder: (state, action: PayloadAction<File["id"] | null>) => {
      state.selectedFolder = action.payload || null;
    },
    selectFile: (state, action: PayloadAction<File["id"]>) => {
      const fileId = action.payload;
      state.selectedFile = action.payload || null;
      const fileDetails = findById({
        items: state.files,
        key: "find",
        needle: fileId,
      });
      state.markdown = fileDetails?.content || "";

      if (state.user) setLastOpenedTabs(state.tabs);
    },
    selectItem: (state, action: PayloadAction<File["id"] | null>) => {
      state.selectedItem = action.payload || null;
    },
    updateMarkdown: (
      state,
      action: PayloadAction<{ value: string | null | undefined; file: File }>
    ) => {
      const { value, file } = action.payload;
      // prevents a bug where debounce will overwrite between switching files
      const verified = file.id === state.selectedFile;
      if (verified && state.allowSave) {
        state.markdown = value;
      } else {
        console.log("file verification failed");
      }
    },
    toggleSidebar: (state) => {
      state.showSidebar = !state.showSidebar;
    },
    setAllowSave: (state, action: PayloadAction<boolean>) => {
      state.allowSave = action.payload;
    },
    saveFileState: (state, action: PayloadAction<string>) => {
      findById({
        items: state.files as File[],
        key: "update",
        needle: state.selectedFile,
        updatedContent: action.payload,
      });
    },
    // prevents a bug where debounce would run after switching files, overwriting the file switched to and causing infinite loops
    selectTab: (state, action: PayloadAction<number>) => {
      // select tab by index
      state.selectedTab = action.payload;

      if (state.user) {
        localStorage.setItem("lastOpenedTabIndex", String(action.payload));
      }
    },
    setTab: (state, action: PayloadAction<File["id"] | null>) => {
      const fileId = action.payload;
      // set current tab to the selected file
      state.tabs[state.selectedTab] = fileId;
      selectFile(fileId!);
    },
    setTabs: (state, action: PayloadAction<(File["id"] | null)[]>) => {
      state.tabs = action.payload;
    },
    newTab: (state) => {
      // push a new tab into the tabs array. null to render it as the `open a file` state
      state.tabs.push(null as never);
      // set the current tab to the newly created tab
      const lastIndex = state.tabs.length - 1;
      state.selectedTab = lastIndex;

      if (state.user) {
        localStorage.setItem("lastOpenedTabIndex", String(lastIndex));
        setLastOpenedTabs(state.tabs);
      }
    },
    closeTab: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      // remove the tab from the tabs array by index
      state.tabs.splice(index, 1);

      // keeps at least one tab open set to `open a file` state
      if (!state.tabs.length) {
        state.tabs = [null];
        // if closing a tab before the selected tab, move the selected tab index down to maintain it as the open tab
        // or if the tab you're closing is the last tab and it is also selected, move the selected tab to the new last tab
      } else if (
        index < state.selectedTab ||
        state.selectedTab === state.tabs.length
      ) {
        state.selectedTab -= 1;
        // if only one tab remains after closing a tab, make sure the selected tab stays on this last tab
      } else if (state.tabs.length <= 1) {
        state.selectedTab = 0;
      }

      if (state.user) {
        localStorage.setItem("lastOpenedTabIndex", String(state.selectedTab));
        setLastOpenedTabs(state.tabs);
      }
    },
    createFileState: (state, action: PayloadAction<File>) => {
      // set up new file
      const newFile = action.payload;
      state.allowSave = false;

      // append new file to the file system
      findById({
        items: state.files,
        key: "append",
        needle: state.selectedFolder,
        child: newFile,
      });

      // sort file system after appendage
      state.files = sortFileSystem(state.files, "title", false);

      // update selected item to the newly created file/folder
      state.selectedItem = newFile.id;

      if (!newFile.is_folder) {
        // if the current tab is an open file, open the new file in a new tab
        if (state.tabs[state.selectedTab]) {
          state.tabs.push(newFile.id as never);
          state.selectedTab = state.tabs.length - 1;
        } else {
          // if the current tab is null open the new file in the current tab
          state.tabs[state.selectedTab] = newFile.id;
        }
        state.selectedFile = newFile.id;
        // file initialises empty
        state.markdown = "";
      } else {
        state.selectedFolder = newFile.id;
      }
    },
    deleteFileState: (state, action: PayloadAction<File["id"]>) => {
      const fileToDelete = action.payload;
      findById({ items: state.files, key: "delete", needle: fileToDelete });
      state.selectedFolder = null;
      if (state.tabs.length <= 1) state.selectedTab = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // saving a file
      .addCase(saveFile.fulfilled, (state, action: PayloadAction<File>) => {
        const savedFile = action.payload;
        if (savedFile) {
          findById({
            items: state.files,
            key: "update",
            needle: savedFile.id,
            updatedContent: savedFile.content,
          });
        }
      })

      // creating a file
      .addCase(createFile.fulfilled, (state, action) => {
        const realFile = action.payload;

        findById({
          items: state.files,
          key: "update",
          needle: realFile.temp_id,
          updatedId: realFile.id,
        });

        const tabs = [...state.tabs];
        const newTabs = tabs.map((tab) => {
          if (tab) {
            return tab === realFile.temp_id ? realFile.id : tab;
          }
        });
        state.tabs = newTabs;

        if (state.selectedFile === realFile.temp_id) state.selectedFile = realFile.id;

        localStorage.setItem("lastOpenedTabs", JSON.stringify(newTabs));
        localStorage.setItem("lastOpenedTabIndex", String(state.selectedTab));

        console.log("file created.");
      })

      // logging in
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = true;
        const lastOpenedTabsStringified =
          localStorage.getItem("lastOpenedTabs");
        let lastOpenedTabs = [null];
        if (lastOpenedTabsStringified) {
          try {
            lastOpenedTabs = JSON.parse(lastOpenedTabsStringified);
          } catch (error) {
            console.error("Error parsing the stored tabs:", error);
          }
        }
        state.tabs = lastOpenedTabs;
      })

      // registering a user
      .addCase(register.fulfilled, (state, action) => {
        state.user = true;
        const welcomeFile: File = action.payload.welcome;
        state.files = [welcomeFile];
        state.tabs = [welcomeFile.id];
        state.selectedFile = welcomeFile.id;
        state.markdown = welcomeFile.content;

        const stringifiedTabs = JSON.stringify([welcomeFile.id]);
        localStorage.setItem("lastOpenedTabs", stringifiedTabs);
        localStorage.setItem("lastOpenedTabIndex", "0");
      });
  },
});

export const selectSelectedFile = (state: RootState) => state.app.selectedFile;

export const {
  setStaticProps,
  setUserData,
  sortFs,
  selectFolder,
  selectFile,
  selectItem,
  updateMarkdown,
  toggleSidebar,
  setAllowSave,
  saveFileState,
  selectTab,
  setTab,
  setTabs,
  newTab,
  closeTab,
  createFileState,
  deleteFileState,
} = appSlice.actions;

export default appSlice.reducer;
