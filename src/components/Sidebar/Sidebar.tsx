import './Sidebar.scss';

import FileSystem from "./FileSystem/FileSystem";
import { FsFile } from "../../types/FsTypes";

import Toolbar from "./Toolbar/Toolbar";

import { useSelector } from 'react-redux';
import type { RootState } from "../../store/store";

export default function Sidebar () {
	const fileSys = useSelector((state: RootState) => state.app.fsFiles);
	const showSidebar = useSelector((state: RootState) => state.app.showSidebar);

	return (
		<div className={`sidebar ${ !showSidebar ? 'hide' : '' }`}>
			<Toolbar items={fileSys} />
			<FileSystem items={fileSys} />
		</div>
	)
}