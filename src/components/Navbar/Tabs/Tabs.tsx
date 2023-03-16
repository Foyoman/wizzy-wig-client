import React, { useState } from 'react';
import './Tabs.scss';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

export default function Tabs() {
	const [selected, setSelected] = useState<number | null>(null);
	const tabs = ["New tab", "tab 2", "tab 3", "tab 4", "shamalama ding dong"];

	
	interface TabProps {
		title: string;
		selected: boolean;
		index: number;
	}
	
	const Tab = ({title, selected, index}: TabProps) => {
		const handleClick = (index: number) => {
			setSelected(index);
		}

		return (
			<div 
				onClick={() => handleClick(index)} 
				className={`tab  ${ selected ? 'selected' : ''}`} 
				title={title}
			>
				<p>{ title }</p>
				<CloseOutlinedIcon className='close-icon' />
			</div>
		)
	}

	return (
		<div className='tab-bar'>
			<div className='tabs'>
			{ tabs.map((title, index) => 
				<Tab title={title} selected={index === selected} index={index}/>
			)}
			</div>
			<AddOutlinedIcon className='new-tab-icon' />
		</div>
	)
}
