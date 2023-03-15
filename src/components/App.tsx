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
              content={file}
            />
          </div>
        </div>
      </div>
    </>
  )
}
