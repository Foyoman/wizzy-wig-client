import './Navbar.scss';
import Tabs from './Tabs/Tabs';

import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import LinearProgress from '@mui/joy/LinearProgress';

import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../store/appSlice";
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export default function Navbar () {
	const saveState = useSelector((state: RootState) => state.app.saveState);
	const dispatch = useDispatch();

	return (
		<div className="navbar">
			<div className='utils'>
				<ViewSidebarOutlinedIcon 
					className="toggle-sidebar" 
					onClick={() => dispatch(toggleSidebar())}
					/>
				<div className='save-state'>
					<LinearProgress 
						className={saveState}
						color={'neutral'} 
						variant='plain' 
						size='sm'
						determinate={saveState === 'saved'}
						value={saveState === 'saved' ? 100 : 75} 
					/>
					<p>{saveState}</p>
				</div>
			</div>
			<Tabs />
		</div>
	)
}