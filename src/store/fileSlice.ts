import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { mdFiles } from '../__mocks__/MdFiles';

export interface FileState {
	value: string;
}

const initialState: FileState = {
	value: "",
}

export const fileSlice = createSlice({
	name: 'file',
	initialState,
	reducers: {
		updateFile: (
			state, 
			action: PayloadAction<string>
		) => {
			for (const file of mdFiles) {
				if (file.id === action.payload) {
					state.value = file.content;
				}
			}
		}
	}
})

// Action creators are generated for each case reducer function
export const { updateFile } = fileSlice.actions;

export default fileSlice.reducer;