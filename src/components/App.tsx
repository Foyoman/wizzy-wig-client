import { useState, useEffect } from 'react';
import MarkdownParser from './MarkdownParser/MarkdownParser';
import Navbar from './Navbar/Navbar';
import './App.scss';
import '../assets/styles/global.scss'
import Sidebar from './Sidebar/Sidebar';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from "../store/store";
import { setStaticProps } from '../store/appSlice';

import { File } from '../types/FileTypes';
import { fileSys } from '../lib/starter-files';

import CircularProgress from '@mui/material/CircularProgress';

import countapi from 'countapi-js';

export default function App() {
  const dispatch = useDispatch();
  const [starterFiles, setStarterFiles] = useState<File [] | null>(null);
  const showSidebar = useSelector((state: RootState) => state.app.showSidebar);
  const selectedFile = useSelector((state: RootState) => state.app.selectedFile);
  const selectedTab = useSelector((state: RootState) => state.app.selectedTab);
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

  // count page visits
  useEffect(() => {
    const countKey = process.env.REACT_APP_COUNT_KEY as string;

    const getOrdinal = (n: number) => {
      let ord: 'th' | 'st' | 'nd' | 'rd' = 'th';
    
      if (n % 10 === 1 && n % 100 !== 11) {
        ord = 'st';
      } else if (n % 10 === 2 && n % 100 !== 12) {
        ord = 'nd';
      } else if (n % 10 === 3 && n % 100 !== 13) {
        ord = 'rd';
      }
    
      return String(n) + ord;
    }

    if (localStorage.getItem('status') !== 'visited') {
      countapi.update('wizzy-wig.netlify.app', countKey, 1)
        .then((result) => {
          const ordinal = getOrdinal(result.value);
          console.log(`congratulations, you are the ${ordinal} unique visitor`);
        }
      )
    } else {
      countapi.get('wizzy-wig.netlify.app', countKey)
        .then((result) => {
          console.log(`this page has had ${result.value} unique visit${result.value !== 1 ? 's' : ''}`);
        }
      )
    }

    // uncomment to reset counter
    // countapi.set('wizzy-wig.netlify.app', countKey, 0)
    //   .then((result) => {
    //     console.log(result);
    //   }
    // )

    localStorage.setItem('status', 'visited');
  }, [])
  
  const handleClick = (e: Event) => {
    e.preventDefault();
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

  if (!starterFiles) {
    return (
      <div className='loading'>
        <CircularProgress />
      </div>
    )
  } else {
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
                defaultSplit={[55, 45]}
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

}
