import { useEffect, useMemo, useCallback, useContext, useRef } from "react";
import { debounce } from "lodash";
import Editor, { useMonaco, OnMount, Monaco } from "@monaco-editor/react";
import { IKeyboardEvent } from "monaco-editor-core";

import { editor } from "monaco-editor/esm/vs/editor/editor.api";

import { useDispatch } from "react-redux";
import {
  setAllowSave,
  updateMarkdown,
  saveFileState,
} from "../../../store/appSlice";
import { saveFile, setSaveState } from "../../../store/apiSlice";
import { useSelector } from "react-redux";
import { AppDispatch, type RootState } from "../../../store/store";

import AuthContext from "../../../context/AuthContext";

import { File } from "../../../types/FileTypes";
import { findById, getFileDetails } from "../../../store/helpers";

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
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
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
      const fileDetails = getFileDetails(files, selectedFile!);
      dispatch(updateMarkdown({ value: value, file: fileDetails! }));
    }, 1000),
    [dispatch, selectedFile]
  );

  // handle editor changes
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleInputChange = useMemo(() => {
    return (
      value: string | null | undefined,
      e?: editor.IModelContentChangedEvent
    ) => {
      if (!allowSave) return;

      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }

      dispatch(saveFileState(value || ""));

      if (value && value.length > 500) {
        debouncedSetMarkdown(value);
      } else {
        dispatch(
          updateMarkdown({
            value: value,
            file: getFileDetails(files, selectedFile)!,
          })
        );
      }

      if (user) {
        dispatch(setSaveState("modified"));
        autosaveTimeoutRef.current = setTimeout(() => {
          console.log("sending save...");
          const updatedFile: File = {
            ...getFileDetails(files, selectedFile)!,
            content: value,
          };
          dispatch(saveFile(updatedFile));
        }, 1000);
      }
    };
  }, [allowSave, debouncedSetMarkdown, dispatch, selectedFile]);

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
