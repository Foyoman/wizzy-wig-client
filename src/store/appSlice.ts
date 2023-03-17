import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { fsFiles } from '../__mocks__/FsFiles';
import { mdFiles } from '../__mocks__/MdFiles';

import { FsFile, SortKeys } from '../types/FsTypes';
import { MdFile } from '../types/MdFile';

import { sortFileSystem, appendChild, appendById } from './helpers';

export interface AppState {
	mdFiles: MdFile[];
	fsFiles: FsFile[];
	file: string;
	markdown: string;
	showSidebar: boolean;
	saved: boolean;
	tabs: Array<FsFile | null> | [];
	selectedTab: number;
	selectedFsFile: FsFile | null;
	selectedMdFile: MdFile | null;
	selectedFolder: FsFile | null;
}

const initialState: AppState = {
	mdFiles: mdFiles,
	fsFiles: sortFileSystem(fsFiles, "title", false),
	file: "",
	markdown: "",
	showSidebar: true,
	saved: true,
	tabs: [null],
	selectedTab: 0,
	selectedFsFile: null,
	selectedMdFile: null,
	selectedFolder: null,
}

export const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		sortFs: (
			state, 
			action: PayloadAction<{ 
				items: FsFile[], 
				sortKey: SortKeys, 
				reverse: boolean 
			}>
		) => {
			const { items, sortKey, reverse } = action.payload;
			state.fsFiles = sortFileSystem(items, sortKey, reverse);
		},
		selectFolder: (
			state,
			action: PayloadAction<FsFile | null>,
		) => {
			const fsFile = action.payload;
			state.selectedFolder = fsFile;
			// console.log(fsFile);
		},
		selectMdFile: (
			state,
			action: PayloadAction<FsFile>,
		) => {
			const fsFile = action.payload;
			for (const file of state.mdFiles) {
				if (file.id === fsFile.fileId) {
					state.selectedMdFile = file;
					state.markdown = file.content;
				}
			}
		},
		updateMarkdown: (
			state, 
			action: PayloadAction<string>
		) => {
			state.markdown = action.payload;
		},
		toggleSidebar: (
			state,
		) => {
			state.showSidebar = !state.showSidebar;
		},
		setSaved: (
			state,
			action: PayloadAction<boolean>
		) => {
			state.saved = action.payload;
		},
		selectTab: (
			state,
			action: PayloadAction<number>
		) => {
			state.selectedTab = action.payload;
		},
		setTab: (
			state,
			action: PayloadAction<FsFile>
		) => {
			const fsFile = action.payload;
			// debugger;
			state.tabs[state.selectedTab] = fsFile;
		},
		newTab: (
			state,
			_,
		) => {
			state.tabs.push(null as never);
			state.selectedTab = state.tabs.length - 1;
		},
		closeTab: (
			state,
			action: PayloadAction<number>
		) => {
			const index = action.payload;
			state.tabs.splice(index, 1);
			if (!state.tabs.length) {
				state.tabs = [null];
			} else if (index < state.selectedTab || state.selectedTab === state.tabs.length) {
				state.selectedTab -= 1;
			} else if (state.tabs.length <= 1) {
				state.selectedTab = 0;
			}
			const fsFile = state.tabs[state.selectedTab];
			if (fsFile) selectMdFile(fsFile);
		},
		createFile: (
			state,
			action: PayloadAction<string>,
		) => {
			const title = action.payload;
			const tempId = "tempid" + Math.random();
			const newFsFile: FsFile = {
				title: title ? title : "Untitled",
				dateCreated: new Date(),
				lastUpdated: new Date(),
				isFolder: false,
				fileId: tempId,
			}
			const newMdFile: MdFile = {
				id: tempId,
				content: "",
			}
			state.mdFiles.push(newMdFile);
			if (state.tabs[state.selectedTab]) {
				state.tabs.push(newFsFile as never);
				state.selectedTab = state.tabs.length - 1;
			} else {
				state.tabs[state.selectedTab] = newFsFile;
			}
			state.selectedMdFile = newMdFile;
			state.markdown = "";
		}
	}
})

export const { 
	sortFs, 
	selectFolder,
	selectMdFile,
	updateMarkdown, 
	toggleSidebar,
	setSaved,
	selectTab,
	setTab,
	newTab,
	closeTab,
	createFile,
} = appSlice.actions;

export default appSlice.reducer;