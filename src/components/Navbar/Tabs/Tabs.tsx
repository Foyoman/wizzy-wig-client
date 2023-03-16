import React, { useState } from 'react';
import './Tabs.scss';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useDispatch } from 'react-redux';
import { selectTab, newTab, closeTab, selectMdFile } from '../../../store/appSlice';
import { FsFile } from '../../../types/FsTypes';

export default function Tabs() {
	const dispatch = useDispatch();
	const tabs = useSelector((state: RootState) => state.app.tabs);
	const selectedTab = useSelector((state: RootState) => state.app.selectedTab);
	
	interface TabProps {
		fsFile?: FsFile;
		title?: string;
		selected: boolean;
		index: number;
	}
	
	const Tab = ({fsFile, title = "New tab", selected, index}: TabProps) => {
		const handleSelect = (index: number) => {
			// setSelected(index);
			dispatch(selectTab(index));
			if (fsFile) {
				dispatch(selectMdFile(fsFile));
			}
		}

		const handleClose = (
			e: React.MouseEvent<SVGSVGElement, MouseEvent>, 
			index: number
		) => {
			e.stopPropagation();
			dispatch(closeTab(index));
		}

		return (
			<div 
				onClick={() => handleSelect(index)} 
				className={`tab  ${ selected ? 'selected' : ''}`} 
				title={title}
			>
				<p>{ title }</p>
				<CloseOutlinedIcon className='close-icon' onClick={(e) => handleClose(e, index)} />
			</div>
		)
	}

	return (
		<div className='tab-bar'>
			<div className='tabs'>
			{tabs.map((file, index) => {
				if (file) {
					return (
						<Tab 
							fsFile={file} 
							title={file.title} 
							selected={index === selectedTab} 
							index={index}
						/>
					)
				} else {
					return (
						<Tab 
							title="New tab" 
							selected={index === selectedTab} 
							index={index} 
						/>
					)
				}
			})}
			</div>
			<AddOutlinedIcon className='new-tab-icon' onClick={() => dispatch(newTab(""))} />
		</div>
	)
}
