import { useEffect, useMemo } from "react";
import { debounce } from "lodash";
import Editor, { useMonaco } from "@monaco-editor/react";

import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

import { useDispatch } from "react-redux";
import { updateMarkdown } from "../../../store/appSlice";
import { saveFile } from "../../../store/appSlice";
import { useSelector } from 'react-redux';
import type { RootState } from "../../../store/store";

interface MdEditorProps {
	content: string | undefined;
	theme: "vs-dark" | "vs-light" | undefined;
}

export default function MdEditor(props: MdEditorProps) {
	const { content, theme } = props;
	const markdown = useSelector((state: RootState) => state.app.markdown);
	const selectedFile = useSelector((state: RootState) => state.app.selectedFile);
	const dispatch = useDispatch();
	const monaco = useMonaco();

	// no clue what this does
	useEffect(() => {
		monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
	}, [monaco]);

	// debounce updating markdown to improve performance
	const debouncedSetMarkdown = debounce((value: string) => {
		console.log('running debounced set markdown...');
		dispatch(updateMarkdown({ value: value, file: selectedFile! }));
	}, 1000);

	// handle monaco editor changes
	const handleInputChange = useMemo(() => { 
		return (value: string | undefined, e?: editor.IModelContentChangedEvent) => {
			dispatch(saveFile(value || ""));
			// dispatch(setSaveState("modified"));
			if (value && value.length > 500) {
				debouncedSetMarkdown(value);
			} else if (value || value === "") {
				dispatch(updateMarkdown({ value: value, file: selectedFile! }));
			}
		};
	}, [debouncedSetMarkdown, dispatch, selectedFile]);

	// trigger autosave after 3 seconds of inactivity
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		const lastEditTime = Date.now();
		const timeout = setTimeout(() => {
			const now = Date.now();
			const timeSinceLastEdit = now - lastEditTime;
			if (timeSinceLastEdit >= 1000) {
				dispatch(saveFile(markdown));
			}
		}, 1000);

		return () => {
			clearTimeout(timeout);
		};
	}, [dispatch, markdown]);

	const MemoizedEditor = useMemo(() => {
		return (
			<Editor 
				height="100%"
				width="100%"
				defaultLanguage="markdown"
				defaultValue=""
				theme={theme}
				value={content}
				onChange={(value, e) => handleInputChange(value, e)}
				options={{
					selectOnLineNumbers: true,
					wordWrap: "on",
				}}
				className="md-editor"
			/>
		)
	}, [content, handleInputChange, theme]);

	return MemoizedEditor;
}
