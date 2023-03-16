import './Navbar.scss';

import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import LinearProgress from '@mui/joy/LinearProgress';

import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../store/appSlice";
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export default function Navbar () {
	const saved = useSelector((state: RootState) => state.app.saved);
	const dispatch = useDispatch();

	return (
		<div className="navbar">
			<ViewSidebarOutlinedIcon 
				className="toggle-sidebar" 
				onClick={() => dispatch(toggleSidebar())}
			/>
			<div className='save-state'>
				<p>{saved ? 'Saved' : 'Saving'}</p>
				<LinearProgress 
					className={saved ? 'saved' : ''}
					color={'neutral'} 
					variant='plain' 
					size="sm" 
					determinate={saved}
					value={75} 
				/>
			</div>
		</div>
	)
}