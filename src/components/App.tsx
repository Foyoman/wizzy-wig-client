import MarkdownParser from './MarkdownParser/MarkdownParser';
import Navbar from './Navbar/Navbar';
import './App.scss';
import '../assets/styles/global.scss'
import Sidebar from './Sidebar/Sidebar';

import { useSelector } from 'react-redux';
import type { RootState } from "../store/store";

export default function App() {
  const showSidebar = useSelector((state: RootState) => state.app.showSidebar);
  const markdown = useSelector((state: RootState) => state.app.markdown);
  const selectedTab = useSelector((state: RootState) => state.app.selectedTab);
  const tabs = useSelector((state: RootState) => state.app.tabs);


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
            <MarkdownParser content={markdown} />
          : 
            <NoFile />
          }
          </div>
        </div>
      </div>
    </>
  )
}
