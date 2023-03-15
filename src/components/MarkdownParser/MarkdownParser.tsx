import React, { useEffect, useRef, useState } from "react";

import "./MarkdownParser.scss"
import './github.scss';

import Split from "react-split";

import { KeyboardTab } from "@mui/icons-material";
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';

import MdPreview from "./MdPreview/MdPreview";
import MdEditor from "./MdEditor/MdEditor";

import { oneDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

// Full Parent Component

interface MarkdownParserProps {
	content?: string;
	theme?: "light" | "dark" | undefined;
	splitDirection?: "vertical" | "horizontal" | undefined;
	updateSaveState?: (content: string) => void;
}

const MarkdownParser = ({ 
	content = "",
	theme = 'dark',
	splitDirection = 'vertical',
	updateSaveState,
}: MarkdownParserProps) => {
	const [markdown, setMarkdown] = useState(content);
	const [saved, setSaved] = useState(true);
	const [split, setSplit] = useState(splitDirection);
	const [lastEditTime, setLastEditTime] = useState(0);
	const [collapsedIndex, setCollapsedIndex] = useState<number>();
	const [componentEl, setComponentEl] = useState<HTMLElement | null>(null);
	const markdownEl = useRef<HTMLDivElement>(null);

	// handle change from child editor component
	const handleEditorChange = (value: string) => {
		setMarkdown(value);
		setLastEditTime(Date.now());
		setSaved(false);
	}

	// trigger autosave after 3 seconds of inactivity
	useEffect(() => {
		if (!updateSaveState || saved) return;
		const timeout = setTimeout(() => {
			const now = Date.now();
			const timeSinceLastEdit = now - lastEditTime;
			if(timeSinceLastEdit >= 3000) {
				updateSaveState('yo');
				setSaved(true);
			}
		}, 3000);

		return () => {
			clearTimeout(timeout);
		};
	}, [lastEditTime, saved, updateSaveState]);

	// markdown and editor theming
	let markdownTheme: { [key: string]: React.CSSProperties };
	let editorTheme: "vs-dark" | "vs-light";
	if (theme === "light") {
		markdownTheme = oneLight;
		editorTheme = 'vs-light';
	} else {
		markdownTheme = oneDark;
		editorTheme = 'vs-dark';
	}

	// adjust the resize bar's classes according to split direction
	useEffect(() => {
		if (!componentEl) {
			const component = document.getElementById('md-parser');
			setComponentEl(component);
		} else {
			const gutter = componentEl.querySelector('.gutter');
			if (split === "horizontal") {
				gutter?.classList.remove('gutter-vertical');
				gutter?.classList.add('gutter-horizontal');
			} else {
				gutter?.classList.remove('gutter-horizontal');
				gutter?.classList.add('gutter-vertical');
			}
		}
	}, [componentEl, split]);

	return (
		<Split 
			id="md-parser"
			className={`md-parser ${theme}`}
			direction={split}
			sizes={[50, 50]}
			minSize={[0, 0]}
			snapOffset={split === 'horizontal' ? 75 : 55}
			collapsed={collapsedIndex}
			onDrag={() => setCollapsedIndex(undefined)} // I'd set it to null but onDrag's type is number | undefined
			gutterSize={20}
			style={{
				flexDirection: split === 'horizontal' ? 'row' : 'column'
			}}
		>
			<div 
				ref={markdownEl} 
				className="md-preview component"
				style={{ 
					height: split === 'horizontal' ? '100%' : '',
					width: split === 'horizontal' ? '' : '100%'
				}}
			>
				<MdPreview theme={markdownTheme} />
				{ split === "horizontal" ?
				<HorizontalSplitIcon 
					className="split-icon" 
					titleAccess="Enable vertical split" 
					onClick={() => setSplit("vertical")}
				/>
				:
				<VerticalSplitIcon 
					className="split-icon" 
					titleAccess="Enable horizontal split"
					onClick={() => setSplit("horizontal")}
				/>
				}
				<KeyboardTab 
					className={`
						collapse-tab 
						${split === 'horizontal' ? 'horizontal' : 'vertical'}
					`}
					onClick={() => setCollapsedIndex(0)} 
					titleAccess="Collapse"
				/>
			</div>
			<div 
				className="md-editor component" 
				style={{ 
					height: split === 'horizontal' ? '100%' : '',
					width: split === 'horizontal' ? '' : '100%'
				}}
			>
				<div className="padding" />
				<MdEditor 
					content={content} 
					theme={editorTheme} 
				/>
				<KeyboardTab 
					className={`
						collapse-tab 
						${split === 'horizontal' ? 'horizontal' : 'vertical'}
					`} 
					onClick={() => setCollapsedIndex(1)}
					titleAccess="Collapse"
				/>
			</div>
		</Split>
	)
}

export default React.memo(MarkdownParser);