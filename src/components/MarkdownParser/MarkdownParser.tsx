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
  theme?: "light" | "dark" | undefined;
  splitDirection?: "vertical" | "horizontal" | undefined;
  defaultSplit?: [number, number];
}

const MarkdownParser = ({
  theme = "dark",
  splitDirection = "horizontal",
  defaultSplit = [50, 50],
}: MarkdownParserProps) => {
  const [splitDir, setSplitDir] = useState(splitDirection);
  const [splitSize, setSplitSize] = useState<[number, number] | null>(null);
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

  const handleCollapse = (i: 0 | 1) => {
    const index = i === 0 ? 1 : 0;
    if (collapsedIndex === index) {
      setCollapsedIndex(undefined);
      setSplitSize([50, 50]);
    } else {
      setCollapsedIndex(i);
      setSplitSize(null);
    }
  };

  // adjust the resize bar's classes according to split direction
  useEffect(() => {
    if (!componentEl) {
      const component = document.getElementById("md-parser");
      setComponentEl(component);
    } else {
      const gutter = componentEl.querySelector(".gutter");
      if (splitDir === "horizontal") {
        gutter?.classList.remove("gutter-vertical");
        gutter?.classList.add("gutter-horizontal");
      } else {
        gutter?.classList.remove("gutter-horizontal");
        gutter?.classList.add("gutter-vertical");
      }
    }
  }, [componentEl, splitDir]);

  return (
    <Split
      id="md-parser"
      className={`md-parser ${theme}`}
      direction={splitDir}
      sizes={splitSize || defaultSplit}
      minSize={[0, 0]}
      snapOffset={splitDir === "horizontal" ? 75 : 55}
      collapsed={collapsedIndex}
      onDrag={() => setCollapsedIndex(undefined)} // would set to null or -1 but Split doesn't accept
      gutterSize={16}
      style={{
        flexDirection: splitDir === "horizontal" ? "row" : "column",
      }}
    >
      <div
        ref={markdownEl}
        className="md-preview component"
        style={{
          height: splitDir === "horizontal" ? "100%" : "",
          width: splitDir === "horizontal" ? "" : "100%",
        }}
      >
        <MdPreview theme={markdownTheme} />
        {splitDir === "horizontal" ? (
          <VerticalSplitIcon
            className="split-icon"
            onClick={() => setSplitDir("vertical")}
          />
        ) : (
          <HorizontalSplitIcon
            className="split-icon"
            onClick={() => setSplitDir("horizontal")}
          />
        )}
        <KeyboardTab
          className={`
						collapse-tab 
						${splitDir === "horizontal" ? "horizontal" : "vertical"}
					`}
          onClick={() => handleCollapse(0)}
          titleAccess="Collapse"
        />
      </div>
      <div
        className="md-editor component"
        style={{
          height: splitDir === "horizontal" ? "100%" : "",
          width: splitDir === "horizontal" ? "" : "100%",
        }}
      >
        <div className="padding" />
        <MdEditor theme={editorTheme} />
        <KeyboardTab
          className={`
						collapse-tab 
						${splitDir === "horizontal" ? "horizontal" : "vertical"}
					`}
          onClick={() => handleCollapse(1)}
          titleAccess="Collapse"
        />
      </div>
    </Split>
  );
};

export default React.memo(MarkdownParser);
