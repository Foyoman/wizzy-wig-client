import { useEffect, useMemo, useCallback, useContext } from "react";
import { debounce } from "lodash";
import Editor, { useMonaco, OnMount, Monaco } from "@monaco-editor/react";
import { IKeyboardEvent } from "monaco-editor-core";

import { editor } from "monaco-editor/esm/vs/editor/editor.api";

import { useDispatch } from "react-redux";
import {
  setAllowSave,
  updateMarkdown,
  saveFile,
  saveFileContent,
} from "../../../store/appSlice";
import { useSelector } from "react-redux";
import { AppDispatch, type RootState } from "../../../store/store";

import AuthContext from "../../../context/AuthContext";

import { File } from "../../../types/FileTypes";

interface MdEditorProps {
  theme: "vs-dark" | "vs-light" | undefined;
}

export default function MdEditor(props: MdEditorProps) {
  const { theme } = props;
  const markdown = useSelector((state: RootState) => state.app.markdown) as
    | string
    | undefined;
  const selectedFile = useSelector(
    (state: RootState) => state.app.selectedFile
  );
  const files = useSelector((state: RootState) => state.app.files);
  const allowSave = useSelector((state: RootState) => state.app.allowSave);
  const dispatch = useDispatch<AppDispatch>();
  const monaco = useMonaco();

  const { user } = useContext<any>(AuthContext);

  // no clue what this does
  useEffect(() => {
    monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }, [monaco]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleEditorDidMount: OnMount = (
    editor: editor.IStandaloneCodeEditor,
    _monaco: Monaco
  ) => {
    const model = editor.getModel();

    if (model) {
      // Add event listener for keydown
      editor.onKeyDown((_event: IKeyboardEvent) => {
        dispatch(setAllowSave(true));
      });
    }
  };

  // debounce updating markdown to improve performance
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetMarkdown = useCallback(
    debounce((value: string) => {
      console.log("setting debounced");
      dispatch(updateMarkdown({ value: value, file: selectedFile! }));
    }, 1000),
    [dispatch, selectedFile]
  );

  // handle monaco editor changes
  const handleInputChange = useMemo(() => {
    return (
      value: string | null | undefined,
      e?: editor.IModelContentChangedEvent
    ) => {
      if (!allowSave) return;
      dispatch(saveFile(value || ""));

      // dispatch(setSaveState("modified"));
      if (value && value.length > 500) {
        console.log("running debounced");
        // console.log(selectedFile);
        debouncedSetMarkdown(value);
      } else {
        dispatch(updateMarkdown({ value: value, file: selectedFile! }));
      }
    };
  }, [allowSave, debouncedSetMarkdown, dispatch, selectedFile]);

  const updateFile = (content: string) => {
    const updatedFile: File = { ...selectedFile!, content: content };
    dispatch(saveFileContent(updatedFile));
  }

  // trigger autosave after 1 second of inactivity // TODO: async save to db
  useEffect(() => {
    if (!allowSave || !user) return;
    const lastEditTime = Date.now();
    const timeout = setTimeout(() => {
      const now = Date.now();
      const timeSinceLastEdit = now - lastEditTime!;
      if (timeSinceLastEdit >= 1000) {
        return;
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [allowSave, dispatch, markdown]);

  const MemoizedEditor = useMemo(() => {
    return (
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="markdown"
        defaultValue=""
        theme={theme}
        value={markdown}
        onChange={(value, e) => handleInputChange(value, e)}
        options={{
          selectOnLineNumbers: true,
          wordWrap: "on",
        }}
        className="md-editor"
        onMount={handleEditorDidMount}
      />
    );
  }, [markdown, handleEditorDidMount, handleInputChange, theme]);

  return MemoizedEditor;
}
