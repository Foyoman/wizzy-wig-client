import React from "react";
import './FileSystem.scss';

import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { FsFile } from "../../../types/FileSystem";

import { useDispatch } from 'react-redux';
import { selectTab, setTab, selectMdFile } from "../../../store/appSlice";

interface FileSystemProps {
	items: FsFile[];
}

const FileSystem = (
	{ items	}: FileSystemProps
) => {
	const dispatch = useDispatch();

	const handleClick = (item: FsFile) => {
		console.log(item);
		if (item.fileId && !item.isFolder) {
			// dispatch(selectTab(item));
			dispatch(setTab(item));
			dispatch(selectMdFile(item));
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