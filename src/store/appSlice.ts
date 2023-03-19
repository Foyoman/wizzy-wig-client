import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { files } from '../__mocks__/Files';
import { File, SortKeys, SaveStates } from '../types/FileTypes';
import { sortFileSystem, findById } from './helpers';

export interface AppState {
	files: File[];
	markdown: string;
	showSidebar: boolean;
	saveState: SaveStates;
	tabs: Array<File | null> | [];
	selectedTab: number;
	selectedFile: File | null;
	selectedFolder: File | null;
}

const initialState: AppState = {
	files: sortFileSystem(files, "title", false),
	markdown: "",
	showSidebar: true,
	saveState: "saved",
	tabs: [null],
	selectedTab: 0,
	selectedFile: null,
	selectedFolder: null,
}

export const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		sortFs: (
			state, 
			action: PayloadAction<{ 
				items: File[], 
				sortKey: SortKeys, 
				reverse: boolean 
			}>
		) => {
			const { items, sortKey, reverse } = action.payload;
			state.files = sortFileSystem(items, sortKey, reverse);
		},
		selectFolder: (
			state,
			action: PayloadAction<File | null>,
		) => {
			const file = action.payload;
			state.selectedFolder = file;
		},
		selectFile: (
			state,
			action: PayloadAction<File>,
		) => {
			const file = action.payload;
			state.selectedFile = file;
			state.markdown = file.content || "";
		},
		updateMarkdown: (
			state, 
			action: PayloadAction<{ value: string, file: File }>
		) => {
			const { value, file } = action.payload;
			// prevents a bug where debounce will overwrite between switching files
			const verified = file.id === state.selectedFile?.id;
			if (verified) {
				state.markdown = value;
			} else {
				console.log('file verification failed');
			}
		},
		toggleSidebar: (
			state,
		) => {
			state.showSidebar = !state.showSidebar;
		},
		setSaveState: (
			state,
			action: PayloadAction<SaveStates>
		) => {
			state.saveState = action.payload;
		},
		saveFile: (
			state,
			action: PayloadAction<string>,
		) => {
			console.log('save reducer')
			state.saveState = "saved";
			findById(state.files, "update", state.selectedFile as File, null, action.payload);
		},
		// prevents a bug where debounce would run after switching files, overwriting the file switched to and causing infinite loops 
		selectTab: (
			state,
			action: PayloadAction<number>
		) => {
			// select tab by index
			state.selectedTab = action.payload;
		},
		setTab: (
			state,
			action: PayloadAction<File>
		) => {
			const file = action.payload;
			// set current tab to the selected file
			state.tabs[state.selectedTab] = file;
			selectFile(file);
		},
		newTab: (
			state,
		) => {
			// push a new tab into the tabs array. null to render it as the `open a file` state
			state.tabs.push(null as never);
			// set the current tab to the newly created tab
			state.selectedTab = state.tabs.length - 1;
		},
		closeTab: (
			state,
			action: PayloadAction<number>
		) => {
			const index = action.payload;
			// remove the tab from the tabs array by index
			state.tabs.splice(index, 1);

			// keeps at least one tab open set to `open a file` state
			if (!state.tabs.length) {
				state.tabs = [null];
				// if closing a tab before the selected tab, move the selected tab index down to maintain it as the open tab
				// or if the tab you're closing is the last tab and it is also selected, move the selected tab to the new last tab
			} else if (index < state.selectedTab || state.selectedTab === state.tabs.length) {
				state.selectedTab -= 1;
				// if only one tab remains after closing a tab, make sure the selected tab stays on this last tab
			} else if (state.tabs.length <= 1) {
				state.selectedTab = 0;
			}

			// if the new current tab is an open file, switch the content to the new current tab
			// ^ I guess the above isn't asynchronous - mutable. obviously?
			const file = state.tabs[state.selectedTab];
			if (file) selectFile(file);
		},
		createFile: (
			state,
			action: PayloadAction<[string, "file" | "folder"]>,
		) => {
			// set up new file
			const [ title, key ] = action.payload;
			const tempId = "tempid" + Math.random();
			const newFile: File = {
				id: tempId,
				title: title ? title : "Untitled",
				dateCreated: new Date(),
				lastUpdated: new Date(),
				isFolder: key === "folder",
				content: key === "file" ? "" : null,
				children: key === "folder" ? [] : null,
			}

			// append new file to the file system
			findById(state.files, "append", state.selectedFolder as File, newFile);
			
			// sort file system after appendage
			state.files = sortFileSystem(state.files, "title", false);
			
			if (key === "file") {
				// if the current tab is an open file, open the new file in a new tab
				if (state.tabs[state.selectedTab]) {
					state.tabs.push(newFile as never);
					state.selectedTab = state.tabs.length - 1;
				} else {
					// if the current tab is null open the new file in the current tab
					state.tabs[state.selectedTab] = newFile;
				}
				state.selectedFile = newFile;
				// file initialises empty
				state.markdown = "";
			}
		},
	}
})

export const { 
	sortFs, 
	selectFolder,
	selectFile,
	updateMarkdown, 
	toggleSidebar,
	setSaveState,
	saveFile,
	selectTab,
	setTab,
	newTab,
	closeTab,
	createFile,
} = appSlice.actions;

export default appSlice.reducer;