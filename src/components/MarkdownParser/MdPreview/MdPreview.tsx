import React, { useMemo } from "react";
import "./MdPreview.scss";
import "./github.scss";

import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import java from "react-syntax-highlighter/dist/cjs/languages/prism/java";
import c from "react-syntax-highlighter/dist/cjs/languages/prism/c";
import cpp from "react-syntax-highlighter/dist/cjs/languages/prism/cpp";
import csharp from "react-syntax-highlighter/dist/cjs/languages/prism/csharp";
import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
import scss from "react-syntax-highlighter/dist/cjs/languages/prism/scss";
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import rangeParser from "parse-numeric-range";

SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("c", c);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("csharp", csharp);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("scss", scss);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("bash", bash);

interface MdPreviewProps {
  // content: string | undefined;
  theme: { [key: string]: React.CSSProperties };
}

export default function MdPreview({ theme }: MdPreviewProps) {
  const content = useSelector((state: RootState) => state.app.markdown);
  // syntax highlighter configuration for react-markdown
  const MemoizedMarkdownComponents = useMemo(() => {
    return {
      code({ node, inline, className, children, ...props }: any) {
        const code = String(children).replace(/\n$/, "");

        const match = /language-(\w+)/.exec(className || "");
        const hasMeta = node?.data?.meta;

        const applyHighlights: object = (applyHighlights: number) => {
          if (hasMeta) {
            const RE = /{([\d,-]+)}/;
            const metadata = node.data.meta?.replace(/\s/g, "");
            const strlineNumbers = RE?.test(metadata)
              ? RE.exec(metadata)![1]
              : "0";
            const highlightLines = rangeParser(strlineNumbers);
            const highlight = highlightLines;
            const data: string | null = highlight.includes(applyHighlights)
              ? "highlight"
              : null;
            return { data };
          } else {
            return {};
          }
        };

        const style = {
          style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
        };

        Object.assign(applyHighlights, style);

        return match ? (
          <SyntaxHighlighter
            style={theme}
            language={match[1]}
            PreTag="div"
            className="codeStyle"
            showLineNumbers={true}
            wrapLines={hasMeta ? true : false}
            // wrapLines={true}
            useInlineStyles={true}
            lineProps={applyHighlights}
            {...props}
          >
            {code}
          </SyntaxHighlighter>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
    };
  }, [theme]);

  const MemoizedPreview = useMemo(() => {
    return (
      <ReactMarkdown
        components={MemoizedMarkdownComponents}
        className="markdown-body"
      >
        {content || ""}
      </ReactMarkdown>
    );
  }, [MemoizedMarkdownComponents, content]);

  return MemoizedPreview;
}
