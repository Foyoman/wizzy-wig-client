import { useEffect, useMemo } from "react";
import { debounce } from "lodash";
import Editor, { useMonaco } from "@monaco-editor/react";

import { useDispatch } from "react-redux";
import { updateMarkdown } from "../../../store/appSlice";
import { setSaveState, saveFile } from "../../../store/appSlice";
import { useSelector } from 'react-redux';
import type { RootState } from "../../../store/store";

interface MdEditorProps {
	content: string | undefined;
	theme: "vs-dark" | "vs-light" | undefined;
}

export default function MdEditor(props: MdEditorProps) {
	const { content, theme } = props;
	const markdown = useSelector((state: RootState) => state.app.markdown);
	const dispatch = useDispatch();
	const monaco = useMonaco();

	// no clue what this does
	useEffect(() => {
		monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
	}, [monaco]);

	// debounce updating markdown to improve performance
	const debouncedSetMarkdown = debounce((value: string) => {
		console.log('running debounced set markdown...');
		dispatch(updateMarkdown(value));
	}, 1000);

	// handle monaco editor changes
	const handleInputChange = useMemo(() => { 
		return (value: string | undefined) => {
			dispatch(setSaveState("modified"));
			if (value) {
				if (value.length <= 500) {
					dispatch(updateMarkdown(value));
				} else {
					debouncedSetMarkdown(value);
				}
			} else {
				dispatch(updateMarkdown(""));
			}
		};
	}, [debouncedSetMarkdown, dispatch]);

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
			if(timeSinceLastEdit >= 3000) {
				triggerSave();
			}
		}, 3000);

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
				onChange={handleInputChange}
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
