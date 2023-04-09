import React, { useEffect, useRef } from 'react';
import './Tabs.scss';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useDispatch } from 'react-redux';
import { selectTab, newTab, closeTab, selectFile } from '../../../store/appSlice';
import { File } from '../../../types/FileTypes';

export default function Tabs() {
	const dispatch = useDispatch();
	const tabs = useSelector((state: RootState) => state.app.tabs);
	const selectedTab = useSelector((state: RootState) => state.app.selectedTab);
	const tabBarEl: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

	// scroll to end of tab bar if new tab is created
	useEffect(() => {
		tabBarEl.current!.scrollLeft = 
			tabBarEl.current!.scrollWidth - tabBarEl.current!.offsetWidth;
	}, [tabs.length])

	useEffect(() => {
		tabBarEl.current!.addEventListener('wheel', handleScroll);
	})

	// allows tab-bar to be scrolled horizontally even with vertical scroll
	const handleScroll = (e: WheelEvent) => {
		e.preventDefault();
		tabBarEl.current!.scrollLeft += e.deltaY;
	}

	const closeHelper = (index: number) => {
		if (tabs.length - 1 === index && tabs[selectedTab - 1]) {
			dispatch(selectFile(tabs[selectedTab - 1] as File));
		}
		// console.log(tabs[selectedTab - 1])
		dispatch(closeTab(index));
	}

	const handleAuxClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		index: number
	) => {
		if (e.button === 1) {
			closeHelper(index);
		}
	}

	interface TabProps {
		file?: File;
		title?: string;
		selected: boolean;
		index: number;
	}
	
	const Tab = ({file, title = "New tab", selected, index}: TabProps) => {
		const handleSelect = (index: number) => {
			dispatch(selectTab(index));
			if (file) {
				dispatch(selectFile(file));
			}
		}

		const handleClose = (
			e: React.MouseEvent<SVGSVGElement, MouseEvent>, 
			index: number
		) => {
			e.stopPropagation();
			closeHelper(index);
		}

		return (
			<div 
				onClick={() => handleSelect(index)} 
				onAuxClick={(e) => handleAuxClick(e, index)}
				className={`
					tab  
					${ selected ? 'selected' : ''}
					${ index >= tabs.length - 1 ? 'last-index' : '' }
				`} 
				title={title}
			>
				<p>{ title }</p>
				<CloseOutlinedIcon className='close-icon' onClick={(e) => handleClose(e, index)} />
			</div>
		)
	}

	return (
		<div className="tab-container">
			<div className='tab-bar' ref={tabBarEl} id='tab-bar'>
				<div className='tabs'>
				{tabs.map((file, index) => {
					if (file) {
						return (
							<Tab 
								file={file} 
								title={file.title} 
								selected={index === selectedTab} 
								index={index}
								key={index}
							/>
						)
					} else {
						return (
							<Tab 
								title="New tab" 
								selected={index === selectedTab} 
								index={index} 
								key={index}
							/>
						)
					}
				})}
				</div>
			</div>
			<div className="new-tab">
				<AddOutlinedIcon 
					className='new-tab-icon' 
					onClick={() => dispatch(newTab())} 
				/>
			</div>
		</div>
	)
}
