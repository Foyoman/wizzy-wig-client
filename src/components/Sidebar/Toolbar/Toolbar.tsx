import React, { useEffect, useRef, useState } from "react";
import './Toolbar.scss';

import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";
import Check from '@mui/icons-material/Check';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

import { File, SortKeys, SortFunction } from "../../../types/FileTypes";
import { useDispatch, useSelector } from "react-redux";
import { sortFs, createFile } from "../../../store/appSlice";
import { RootState } from "../../../store/store";

interface ToolbarProps {
	items: File[],
}

export default function Toolbar (
	{ items }: ToolbarProps
) {
	const [filterEl, setFilterEl] = useState<HTMLElement | null>(null);
	const filterOpen = Boolean(filterEl);

	const [createFileEl, setCreateFileEl] = useState<HTMLElement | null>(null);
	const [fileTitle, setFileTitle] = useState<string | "">("");
	const createFileOpen = Boolean(createFileEl);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [createFolderEl, setCreateFolderEl] = useState<HTMLElement | null>(null);
	const [folderTitle, setFolderTitle] = useState<string | "">("");
	const createFolderOpen = Boolean(createFolderEl);
	const folderInputRef = useRef<HTMLInputElement | null>(null);

	const [sort, setSort] = 
		useState<{
			sortKey: SortKeys, reverse: boolean
		} | null>({
			sortKey: "title", reverse: false
		});

	const dispatch = useDispatch();
	const selectedFolder = useSelector((state: RootState) => state.app.selectedFolder);

	const handleCreateFile = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		setCreateFileEl(e.currentTarget);
		setTimeout(() => {
			fileInputRef.current?.focus();
		}, 1);
	}

	const handleCreateFolder = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		setCreateFolderEl(e.currentTarget);
		setTimeout(() => {
			folderInputRef.current?.focus();
		}, 1);
	}

	const handleCreateFileClose = () => {
		setCreateFileEl(null);
		setFileTitle("");
	}

	const handleCreateFolderClose = () => {
		setCreateFolderEl(null);
		setFolderTitle("");
	}

  const handleSelect: SortFunction = (items, sortKey, reverse) => {
		dispatch(sortFs({items, sortKey, reverse}));
		setSort({sortKey: sortKey, reverse: reverse});
    setFilterEl(null);
  }

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>, key: "file" | "folder") => {
		e.preventDefault();
		let title: string;
		if (key === "file") {
			title = fileTitle;
			setCreateFileEl(null);
			setFileTitle("");
		} else {
			title = folderTitle;
			setCreateFolderEl(null);
			setFolderTitle("");
		}
		dispatch(createFile([title, key]));
	}

	interface CheckedProps extends JSX.IntrinsicAttributes {
		visible?: boolean;
	}

	const Checked = ({ visible = false }: CheckedProps) => {
    return (
      <ListItemIcon 
				style={{ 
					visibility: visible ? 'visible' : 'hidden'
				}}
			>
        <Check />
      </ListItemIcon>
    )
  }

	return (
		<div className="toolbar">
			<div className="selected-folder">
				<p>
					dir: { selectedFolder ? selectedFolder.title : 'root (~)' }
				</p>
			</div>
			<div className="tools">
				{/* create new file */}
				<Button
					className="toolbar-button"
					aria-controls={createFileOpen ? 'basic-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={createFileOpen ? 'true' : undefined}
					onClick={handleCreateFile}
				>
					<NoteAddOutlinedIcon className="icon" />
				</Button>
				<Menu
					className="dropdown-menu"
					anchorEl={createFileEl}
					open={createFileOpen}
					onClose={handleCreateFileClose}
					MenuListProps={{
						'aria-labelledby': 'basic-button',
					}}
				>
					<MenuItem className="menu-item">
						<form onSubmit={(e) => handleSubmit(e, "file")}>
							<input 
								// autoFocus
								id="input-el"
								ref={fileInputRef}
								type="text" 
								value={fileTitle} 
								onChange={(e) => setFileTitle(e.target.value)} 
								placeholder="title" 
							/>
						</form>
					</MenuItem>
				</Menu>
				{/* create new folder */}
				<Button
					className="toolbar-button"
					aria-controls={createFolderOpen ? 'basic-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={createFolderOpen ? 'true' : undefined}
					onClick={handleCreateFolder}
				>
					<CreateNewFolderOutlinedIcon className="icon" />
				</Button>
				<Menu
					className="dropdown-menu"
					anchorEl={createFolderEl}
					open={createFolderOpen}
					onClose={handleCreateFolderClose}
					MenuListProps={{
						'aria-labelledby': 'basic-button',
					}}
				>
					<MenuItem className="menu-item">
						<form onSubmit={(e) => handleSubmit(e, "folder")}>
							<input 
								// autoFocus
								id="input-el"
								ref={folderInputRef}
								type="text" 
								value={folderTitle} 
								onChange={(e) => setFolderTitle(e.target.value)} 
								placeholder="title" 
							/>
						</form>
					</MenuItem>
				</Menu>
				{/* filter menu */}
				<Button
					className="toolbar-button"
					aria-controls={filterOpen ? 'basic-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={filterOpen ? 'true' : undefined}
					onClick={(e) => setFilterEl(e.currentTarget)}
				>
					<SortOutlinedIcon className="icon" />
				</Button>
				<Menu
					className="dropdown-menu"
					anchorEl={filterEl}
					open={filterOpen}
					onClose={() => setFilterEl(null)}
					MenuListProps={{
						'aria-labelledby': 'basic-button',
					}}
				>
					<MenuList id="menu-list" dense>
						<MenuItem 
							className="menu-item" 
							onClick={() => handleSelect(items, "title", false)}
						>
							<Checked visible={sort?.sortKey === "title" && !sort?.reverse} />
							<ListItemText>File Name (A - Z)</ListItemText>
						</MenuItem>
						<MenuItem 
							className="menu-item" 
							onClick={() => handleSelect(items, "title", true)}
						>
							<Checked visible={sort?.sortKey === "title" && sort?.reverse} />
							<ListItemText>File Name (Z - A)</ListItemText>
						</MenuItem>
						<Divider />
						<MenuItem 
							className="menu-item" 
							onClick={() => handleSelect(items, "lastUpdated", false)}
						>
							<Checked visible={sort?.sortKey === "lastUpdated" && !sort?.reverse} />
							<ListItemText>Date Modified (Newest First)</ListItemText>
						</MenuItem>
						<MenuItem 
							className="menu-item" 
							onClick={() => handleSelect(items, "lastUpdated", true)}
						>
							<Checked visible={sort?.sortKey === "lastUpdated" && sort?.reverse} />
							<ListItemText>Date Modified (Oldest First)</ListItemText>
						</MenuItem>
						<Divider />
						<MenuItem 
							className="menu-item" 
							onClick={() => handleSelect(items, "dateCreated", false)}
						>
							<Checked visible={sort?.sortKey === "dateCreated" && !sort?.reverse} />
							<ListItemText>Date Created (Newest First)</ListItemText>
						</MenuItem>
						<MenuItem 
							className="menu-item" 
							onClick={() => handleSelect(items, "dateCreated", true)}
						>
							<Checked visible={sort?.sortKey === "dateCreated" && sort?.reverse} />
							<ListItemText>Date Created (Oldest First)</ListItemText>
						</MenuItem>
					</MenuList>
				</Menu>
			</div>
		</div>
	)
}