import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface MarkdownState {
	value: string;
}

const initialState: MarkdownState = {
	value: "",
}

export const markdownSlice = createSlice({
	name: 'markdown',
	initialState,
	reducers: {
		updateMarkdown: (
			state, 
			action: PayloadAction<string>
		) => {
			state.value = action.payload;
		}
	}
})

// Action creators are generated for each case reducer function
export const { updateMarkdown } = markdownSlice.actions;

export default markdownSlice.reducer;