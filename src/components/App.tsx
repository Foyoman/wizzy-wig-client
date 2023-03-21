import { useState, useEffect } from 'react';
import MarkdownParser from './MarkdownParser/MarkdownParser';
import Navbar from './Navbar/Navbar';
import './App.scss';
import '../assets/styles/global.scss'
import Sidebar from './Sidebar/Sidebar';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from "../store/store";
import { getStaticProps } from '../store/appSlice';

import fileSys from '../lib/files';

export default function App() {
  const dispatch = useDispatch();
  const showSidebar = useSelector((state: RootState) => state.app.showSidebar);
  const selectedFile = useSelector((state: RootState) => state.app.selectedFile);
  const selectedTab = useSelector((state: RootState) => state.app.selectedTab);
  const [content, setContent] = useState<string | undefined>(selectedFile?.content as string | undefined);
  const tabs = useSelector((state: RootState) => state.app.tabs);

  // user check
  useEffect(() => {
    const user = false; // replace with real user check
    console.log(fileSys);
    if (!user) {
      dispatch(getStaticProps());
    }
  })

  useEffect(() => {
    setContent(selectedFile?.content as string | undefined)
  }, [selectedFile]);

  const NoFile = () => {
    return (
      <div className='no-file'>
        <div>
          <h1>No file is open</h1>
          <p>Select a file from the sidebar or create a new file to start.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="page">
        <Navbar />
        <div className='container'>
          <Sidebar />
          <div 
            className={`md-container ${!showSidebar ? 'sidebar-hidden' : ''}`}
          >
          { tabs[selectedTab] ? 
            <MarkdownParser content={content} />
          : 
            <NoFile />
          }
          </div>
        </div>
      </div>
    </>
  )
}
