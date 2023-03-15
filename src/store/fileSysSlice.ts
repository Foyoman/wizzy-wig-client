import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { fsFiles } from '../__mocks__/FileSystem';

import { FsFile, SortKeys, SortFunction } from '../types/FileSystem';

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

export interface FileSysState {
	value: FsFile[];
}

const initialState: FileSysState = {
	value: sortFileSystem(fsFiles, "title", false),
}

export const fileSysSlice = createSlice({
	name: 'fileSys',
	initialState,
	reducers: {
		sortFs: (
			state, 
			action: PayloadAction<{ items: FsFile[], sortKey: SortKeys, reverse: boolean }>
		) => {
			const { items, sortKey, reverse } = action.payload;
			state.value = sortFileSystem(items, sortKey, reverse);
		}
	}
})

// Action creators are generated for each case reducer function
export const { sortFs } = fileSysSlice.actions;

export default fileSysSlice.reducer;