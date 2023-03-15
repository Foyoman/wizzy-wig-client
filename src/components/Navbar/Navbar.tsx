import React from "react";
import './Navbar.scss';

import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';

import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../store/appSlice";

export default function Navbar () {
	const dispatch = useDispatch();

	return (
		<div className="navbar">
			<ViewSidebarOutlinedIcon 
				className="toggle-sidebar" 
				onClick={() => dispatch(toggleSidebar())}
			/>
		</div>
	)
}