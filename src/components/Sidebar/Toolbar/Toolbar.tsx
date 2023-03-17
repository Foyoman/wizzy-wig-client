import React, { useState } from "react";
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

import { FsFile, SortKeys, SortFunction } from "../../../types/FsTypes";
import { useDispatch, useSelector } from "react-redux";
import { sortFs, createFile } from "../../../store/appSlice";
import { RootState } from "../../../store/store";

interface ToolbarProps {
	items: FsFile[],
}

export default function Toolbar (
	{ items }: ToolbarProps
) {
	const [filterEl, setFilterEl] = useState<HTMLElement | null>(null);
	const [createFileEl, setCreateFileEl] = useState<HTMLElement | null>(null);
	const [sort, setSort] = 
		useState<{
			sortKey: SortKeys, reverse: boolean
		} | null>({
			sortKey: "title", reverse: false
		});
	const [title, setTitle] = useState<string | "">("");
	const dispatch = useDispatch();
	const selectedFolder = useSelector((state: RootState) => state.app.selectedFolder);
  const filterOpen = Boolean(filterEl);
	const createOpen = Boolean(createFileEl);

  const handleSelect: SortFunction = (items, sortKey, reverse) => {
		dispatch(sortFs({items, sortKey, reverse}));
		setSort({sortKey: sortKey, reverse: reverse});
    setFilterEl(null);
  };

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(title);
		dispatch(createFile(title));
		setTitle("");
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
					dir: { selectedFolder ? selectedFolder.title : 'root' }
				</p>
			</div>
			<div className="tools">
				<Button
					className="toolbar-button"
					aria-controls={createOpen ? 'basic-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={createOpen ? 'true' : undefined}
					onClick={(e) => setCreateFileEl(e.currentTarget)}
				>
					<NoteAddOutlinedIcon className="icon" />
				</Button>
				<Menu
					className="dropdown-menu"
					anchorEl={createFileEl}
					open={createOpen}
					onClose={() => setCreateFileEl(null)}
					MenuListProps={{
						'aria-labelledby': 'basic-button',
					}}
				>
					<MenuItem className="menu-item">
						<form onSubmit={handleSubmit}>
							<input 
								type="text" 
								value={title} 
								onChange={(e) => setTitle(e.target.value)} 
								placeholder="title" 
							/>
						</form>
					</MenuItem>
				</Menu>
				<CreateNewFolderOutlinedIcon className="icon" />
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