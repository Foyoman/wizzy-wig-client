import { useState, useEffect } from 'react';
import MarkdownParser from './MarkdownParser/MarkdownParser';
import Navbar from './Navbar/Navbar';
import './App.scss';
import '../assets/styles/global.scss'
import Sidebar from './Sidebar/Sidebar';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from "../store/store";
import { setSaveState, setStaticProps } from '../store/appSlice';

import { File } from '../types/FileTypes';

import { fileSys } from '../lib/starter-files';


export default function App() {
  const dispatch = useDispatch();
  const [starterFiles, setStarterFiles] = useState<File [] | null>(null);
  const showSidebar = useSelector((state: RootState) => state.app.showSidebar);
  const selectedFile = useSelector((state: RootState) => state.app.selectedFile);
  const selectedTab = useSelector((state: RootState) => state.app.selectedTab);
  // const files = useSelector((state: RootState) => state.app.files);
  const [content, setContent] = useState<string | undefined>(selectedFile?.content as string | undefined);
  const tabs = useSelector((state: RootState) => state.app.tabs);

  
  // user check
  useEffect(() => {
    const user = false; // replace with real user check
    if (!user) {
      const populateFiles = async (files: File[]) => {
        for (let file of files) {
          if (!file.isFolder) {
            try {
              const filePath = `/files/${file.id}.md`
              // const content = await getFileContents(filePath);
              const response = await fetch(filePath);
              const fileContents = await response.text();
              file.content = fileContents;
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          } else if (file.isFolder && file.children) {
            
            await populateFiles(file.children);
          }
          
          console.log(file);
        }
        
        setStarterFiles(files);
        return files;
      };
      
      populateFiles(fileSys);
    }
  }, []);

  useEffect(() => {
    if (starterFiles) {
      dispatch(setStaticProps(starterFiles));
    }
  }, [starterFiles, dispatch])
  
  useEffect(() => {
    setContent(selectedFile?.content as string | undefined)
  }, [selectedFile]);
  
  const handleClick = (e: Event) => {
    e.preventDefault();
    console.log(e.target);
    console.log('hi, clicked')
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const loginEl = document.querySelector("a[href='#loginEl']");
      const signupEl = document.querySelector("a[href='#signupEl']");

      if (loginEl) {
        loginEl.addEventListener('click', handleClick);
        clearInterval(intervalId);
      }
      if (signupEl) {
        signupEl.addEventListener('click', handleClick);
        clearInterval(intervalId);
      }
    }, 100);
  
    return () => {
      clearInterval(intervalId);
      const loginEl = document.querySelector("a[href='#loginEl']");
      const signupEl = document.querySelector("a[href='#signupEl']");

      if (loginEl) {
        loginEl.removeEventListener('click', handleClick);
      }
      if (signupEl) {
        signupEl.removeEventListener('click', handleClick);
      }
    };
  }, []);

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
            <MarkdownParser 
              content={content} 
              defaultSplit={[70, 30]}
            />
          : 
            <NoFile />
          }
          </div>
        </div>
      </div>
    </>
  )
}
