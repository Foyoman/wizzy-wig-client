import { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import Editor, { EditorProps, useMonaco } from "@monaco-editor/react";

import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

import { useDispatch } from "react-redux";
import { updateMarkdown, verifiedDebounce } from "../../../store/appSlice";
import { setSaveState, saveFile } from "../../../store/appSlice";
import { useSelector } from 'react-redux';
import type { RootState } from "../../../store/store";
import { File } from "../../../types/FileTypes";

interface MdEditorProps {
	content: string | undefined;
	theme: "vs-dark" | "vs-light" | undefined;
}

export default function MdEditor(props: MdEditorProps) {
	const { content, theme } = props;
	const selectedFile = useSelector((state: RootState) => state.app.selectedFile);
	const dispatch = useDispatch();
	const monaco = useMonaco();

	// no clue what this does
	useEffect(() => {
		monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
	}, [monaco]);

	// debounce updating markdown to improve performance
	const debouncedSetMarkdown = debounce((value: string) => {
		// dispatch(fileVerification(fileToVerify))
		console.log('running debounced set markdown...');
		dispatch(verifiedDebounce({ file: selectedFile!, value: value }));
		// dispatch(updateMarkdown(value));
	}, 1000);

	// handle monaco editor changes
	const handleInputChange = useMemo(() => { 
		return (value: string | undefined, e?: editor.IModelContentChangedEvent) => {
			// console.log(e);
			// dispatch(saveFile(null));
			dispatch(setSaveState("modified"));
			if (value === "") {
				dispatch(updateMarkdown(""));
			} else if (value) {
				if (value.length > 500) {
					debouncedSetMarkdown(value);
					// dispatch(verifiedDebounce({ file: selectedFile!, value: value }))
				} else {
					dispatch(updateMarkdown(value));
				}
			}
		};
	}, [debouncedSetMarkdown, dispatch, selectedFile]);

	// trigger autosave after 3 seconds of inactivity
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const triggerSave = () => {
		console.log('saving content...');
		dispatch(setSaveState("saving"));
		dispatch(saveFile(null));
		// const now = new Date();
		// console.log('last saved at: ' + now);
	}

	useEffect(() => {
		const lastEditTime = Date.now();
		const timeout = setTimeout(() => {
			const now = Date.now();
			const timeSinceLastEdit = now - lastEditTime;
			if(timeSinceLastEdit >= 1000) {
				triggerSave();
			}
		}, 1000);

		return () => {
			clearTimeout(timeout);
		};
	}, [dispatch, triggerSave]);

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
