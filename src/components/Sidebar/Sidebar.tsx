import './Sidebar.scss';

import FileSystem from "./FileSystem/FileSystem";
import { FsFile } from "../../types/FsTypes";

import Toolbar from "./Toolbar/Toolbar";

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from "../../store/store";
import { selectFolder } from '../../store/appSlice';

export default function Sidebar () {
	const fileSys = useSelector((state: RootState) => state.app.fsFiles);
	const showSidebar = useSelector((state: RootState) => state.app.showSidebar);
	const dispatch = useDispatch();

	return (
		<div 
			className={`sidebar ${ !showSidebar ? 'hide' : '' }`}
			onClick={() => dispatch(selectFolder(null))}
		>
			<Toolbar items={fileSys} />
			<FileSystem items={fileSys} />
		</div>
	)
}