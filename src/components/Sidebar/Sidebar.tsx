import './Sidebar.scss';

import FileSystem from "./FileSystem/FileSystem";
import { FsFile } from "../../types/FsTypes";

import Toolbar from "./Toolbar/Toolbar";

import { useSelector } from 'react-redux';
import type { RootState } from "../../store/store";

const appendChild = (item: FsFile, child: FsFile) => {
	if (!item.isFolder) {
    throw new Error(`Item with id: ${item.id} is not a folder.`);
  }
	if (item.children) {
		item.children.push(child);
	} else {
		item.children = [child];
	}
}

const appendById = (
	id: FsFile['id'],
	items: FsFile[],
	child: FsFile,
): FsFile | null => {
	for (const item of items) {
		if (item.id === id) {
			appendChild(item, child);
		}

		if (item.isFolder && item.children) {
			const foundItem = appendById(id, item.children, child);
			if (foundItem) {
				appendChild(foundItem, child);
			}
		}
	}
	return null;
}

export default function Sidebar () {
	const fileSys = useSelector((state: RootState) => state.app.fsFiles);
	const showSidebar = useSelector((state: RootState) => state.app.showSidebar);

	return (
		<div className={`sidebar ${ !showSidebar && 'hide' }`}>
			<Toolbar items={fileSys} />
			<FileSystem items={fileSys} />
		</div>
	)
}