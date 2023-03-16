import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { fsFiles } from '../__mocks__/FileSystem';
import { mdFiles } from '../__mocks__/MdFiles';

import { FsFile, SortKeys, SortFunction } from '../types/FileSystem';
import { MdFile } from '../types/MdFile';

export const sortFileSystem: SortFunction = (fileSystem, sortKey, reverse) => {
	const [folders, files] = fileSystem.reduce(
		(acc, item) => {
			if (item.isFolder) {
				acc[0].push(item);
			} else {
				acc[1].push(item);
			}
			return acc;
		},
		[[], []] as [FsFile[], FsFile[]]
	);

	const sortedFolders = folders
		.map((folder) => {
			const sortedChildren = sortFileSystem(folder.children || [], sortKey, reverse);
			return { ...folder, children: sortedChildren };
		})
		.sort((a, b) => { 
			if (sortKey === "title") {
				return a.title.localeCompare(b.title)
			} else {
				const dateA = a[sortKey];
				const dateB = b[sortKey];
				if (dateA < dateB) {
					return 1;
				}
				if (dateA > dateB) {
					return -1;
				}
				return 0;
			}
		});
	
	let sortedFiles: FsFile[];
	if (sortKey === "title") {
		sortedFiles = files.sort((a, b) => a.title.localeCompare(b.title));
	} else {
		sortedFiles = files.sort((a, b) => {
			const dateA = a[sortKey];
			const dateB = b[sortKey];
			if (dateA < dateB) {
				return 1;
			}
			if (dateA > dateB) {
				return -1;
			}
			return 0;
		});
	}

	if (reverse) {
		return [...sortedFolders.reverse(), ...sortedFiles.reverse()];
	} else {
		return [...sortedFolders, ...sortedFiles];
	}
}

export interface AppState {
	fsFiles: FsFile[];
	file: string;
	markdown: string;
	showSidebar: boolean;
	saved: boolean;
	tabs: Array<FsFile | null> | [];
	selectedTab: number;
	selectedFsFile: FsFile | null;
	selectedMdFile: MdFile | null;
}

const initialState: AppState = {
	fsFiles: sortFileSystem(fsFiles, "title", false),
	file: "",
	markdown: "",
	showSidebar: true,
	saved: true,
	tabs: [null],
	selectedTab: 0,
	selectedFsFile: null,
	selectedMdFile: null,
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
		selectMdFile: (
			state,
			action: PayloadAction<FsFile>,
		) => {
			const fsFile = action.payload;
			for (const file of mdFiles) {
				if (file.id === fsFile.fileId) {
					state.selectedMdFile = file;
					state.markdown = file.content;
					// console.log(state.markdown);
					console.log(file.content);
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
			state.tabs[state.selectedTab] = fsFile;
		},
		newTab: (
			state,
			_,
		) => {
			state.tabs.push(null as never);
		},
		closeTab: (
			state,
			action: PayloadAction<number>
		) => {
			const index = action.payload;
			state.tabs.splice(index, 1);
			if (state.selectedTab === state.tabs.length) {
				state.selectedTab -= 1;
			}
			if (state.tabs.length <= 1) {
				state.selectedTab = 0;
			}
			if (!state.tabs.length) {
				state.tabs = [null];
				// state.selectedTab = 0;
			}
		}
	}
})

// Action creators are generated for each case reducer function
export const { 
	sortFs, 
	selectMdFile,
	updateMarkdown, 
	toggleSidebar,
	setSaved,
	selectTab,
	setTab,
	newTab,
	closeTab,
} = appSlice.actions;

export default appSlice.reducer;