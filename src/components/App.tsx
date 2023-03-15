import React from "react";

import MarkdownParser from './MarkdownParser/MarkdownParser';
import Navbar from './Navbar/Navbar';
import './App.scss';
import '../assets/styles/global.scss'
import Sidebar from './Sidebar/Sidebar';

import { useSelector } from 'react-redux';
import type { RootState } from "../store/store";

export default function App() {
  const file = useSelector((state: RootState) => state.app.file);
  const showSidebar = useSelector((state: RootState) => state.app.showSidebar);

  const autoSave = (content: string) => {
    console.log('updating save state...');
    // move this into axios request response
    const now = new Date();
    const time = now.toLocaleTimeString("en-GB", { hour12: true });
    console.log('last saved at: ' + time);
  }

  return (
    <>
      <div className="page">
        <Navbar />
        <div className='container'>
          <Sidebar />
          <div 
            className={`md-container ${!showSidebar && 'sidebar-hidden'}`}
          >
            <MarkdownParser 
              updateSaveState={autoSave}
              content={file}
            />
          </div>
        </div>
      </div>
    </>
  )
}
