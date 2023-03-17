import React from "react";
import './FileSystem.scss';

import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { FsFile } from "../../../types/FsTypes";

import { useDispatch, useSelector } from 'react-redux';
import { setTab, selectMdFile, selectFolder, selectTab } from "../../../store/appSlice";
import { RootState } from "../../../store/store";

interface FileSystemProps {
	items: FsFile[];
}

const FileSystem = (
	{ items	}: FileSystemProps
) => {
	const dispatch = useDispatch();
	const tabs = useSelector((state: RootState) => state.app.tabs);

	const handleClick = (item: FsFile) => {
		if (item.fileId && !item.isFolder) {
			if (tabs.includes(item as never)) {
				// if open tabs includes file, set tab to that file
				dispatch(selectTab(tabs.indexOf(item as never)))
			} else {
				dispatch(setTab(item));
			}
			dispatch(selectMdFile(item));
		} else if (item.isFolder) {
			dispatch(selectFolder(item));
		}
	}

	const mapDirectory = (
		items: FsFile[],
		nested: boolean,
	) => {
		return items.map((item) => {
			if (item.isFolder) {
				return (
					<TreeItem
						nodeId={`${item.id}`} 
						key={item.id} 
						label={item.title} 
						title={item.title}
						className={`sidebar-item ${ nested && 'nested' }`}
						onClick={() => handleClick(item)}
					>
					{ item.children?.length ? 
						mapDirectory(item.children, true) 
						: 
						<span style={{ display: 'none' }} />
					}
					</TreeItem>
				)
			} else {
				return (
					<TreeItem 
						nodeId={`${item.id}`} 
						key={item.id} 
						label={item.title} 
						title={item.title}
						className={`sidebar-item ${ nested && 'nested' }`}
						onClick={() => handleClick(item)}
					/>
				)
			}
		})
	}
	
	const mappedItems = mapDirectory(items, false);

	return (
		<TreeView 
			className="sidebar-items"
			aria-label="file system navigator"
			defaultCollapseIcon={<ExpandMoreIcon />}
			defaultExpandIcon={<ChevronRightIcon />}
			sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
		>
			{ mappedItems }
		</TreeView>
	)
}

export default React.memo(FileSystem);