import React, { useEffect, useRef, useState } from "react";

import "./MarkdownParser.scss";

import Split from "react-split";

import { KeyboardTab } from "@mui/icons-material";
import HorizontalSplitIcon from "@mui/icons-material/HorizontalSplit";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";

import MdPreview from "./MarkdownPreview/MarkdownPreview";
import MdEditor from "./MarkdownEditor/MarkdownEditor";

import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

interface MarkdownParserProps {
  content?: string;
  theme?: "light" | "dark" | undefined;
  splitDirection?: "vertical" | "horizontal" | undefined;
  defaultSplit?: [number, number];
}

const MarkdownParser = ({
  // content = "",
  theme = "dark",
  splitDirection = "horizontal",
  defaultSplit = [50, 50],
}: MarkdownParserProps) => {
  const [split, setSplit] = useState(splitDirection);
  const [collapsedIndex, setCollapsedIndex] = useState<number>();
  const [componentEl, setComponentEl] = useState<HTMLElement | null>(null);
  const markdownEl = useRef<HTMLDivElement>(null);

  // markdown and editor theming
  let markdownTheme: { [key: string]: React.CSSProperties };
  let editorTheme: "vs-dark" | "vs-light";
  if (theme === "light") {
    markdownTheme = oneLight;
    editorTheme = "vs-light";
  } else {
    markdownTheme = oneDark;
    editorTheme = "vs-dark";
  }

  // adjust the resize bar's classes according to split direction
  useEffect(() => {
    if (!componentEl) {
      const component = document.getElementById("md-parser");
      setComponentEl(component);
    } else {
      const gutter = componentEl.querySelector(".gutter");
      if (split === "horizontal") {
        gutter?.classList.remove("gutter-vertical");
        gutter?.classList.add("gutter-horizontal");
      } else {
        gutter?.classList.remove("gutter-horizontal");
        gutter?.classList.add("gutter-vertical");
      }
    }
  }, [componentEl, split]);

  return (
    <Split
      id="md-parser"
      className={`md-parser ${theme}`}
      direction={split}
      sizes={defaultSplit}
      minSize={[0, 0]}
      snapOffset={split === "horizontal" ? 75 : 55}
      collapsed={collapsedIndex}
      onDrag={() => setCollapsedIndex(undefined)} // would set to null or -1 but Split doesn't accept
      gutterSize={16}
      style={{
        flexDirection: split === "horizontal" ? "row" : "column",
      }}
    >
      <div
        ref={markdownEl}
        className="md-preview component"
        style={{
          height: split === "horizontal" ? "100%" : "",
          width: split === "horizontal" ? "" : "100%",
        }}
      >
        <MdPreview theme={markdownTheme} />
        {split === "horizontal" ? (
          <HorizontalSplitIcon
            className="split-icon"
            titleAccess="Enable vertical split"
            onClick={() => setSplit("vertical")}
          />
        ) : (
          <VerticalSplitIcon
            className="split-icon"
            titleAccess="Enable horizontal split"
            onClick={() => setSplit("horizontal")}
          />
        )}
        <KeyboardTab
          className={`
						collapse-tab 
						${split === "horizontal" ? "horizontal" : "vertical"}
					`}
          onClick={() => setCollapsedIndex(0)}
          titleAccess="Collapse"
        />
      </div>
      <div
        className="md-editor component"
        style={{
          height: split === "horizontal" ? "100%" : "",
          width: split === "horizontal" ? "" : "100%",
        }}
      >
        <div className="padding" />
        <MdEditor theme={editorTheme} />
        <KeyboardTab
          className={`
						collapse-tab 
						${split === "horizontal" ? "horizontal" : "vertical"}
					`}
          onClick={() => setCollapsedIndex(1)}
          titleAccess="Collapse"
        />
      </div>
    </Split>
  );
};

export default React.memo(MarkdownParser);
