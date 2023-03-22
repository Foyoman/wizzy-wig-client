import { useState, useEffect } from 'react';
import MarkdownParser from './MarkdownParser/MarkdownParser';
import Navbar from './Navbar/Navbar';
import './App.scss';
import '../assets/styles/global.scss'
import Sidebar from './Sidebar/Sidebar';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from "../store/store";
// import { getStaticProps } from '../store/appSlice';

import { File } from '../types/FileTypes';


export default function App() {
  const dispatch = useDispatch();
  const showSidebar = useSelector((state: RootState) => state.app.showSidebar);
  const selectedFile = useSelector((state: RootState) => state.app.selectedFile);
  const selectedTab = useSelector((state: RootState) => state.app.selectedTab);
  const [content, setContent] = useState<string | undefined>(selectedFile?.content as string | undefined);
  const tabs = useSelector((state: RootState) => state.app.tabs);

  const fileSys: File[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      dateCreated: new Date('03/20/23'),
      lastUpdated: new Date('03/20/23'),
      isFolder: false,
      content: ''
    },
    {
      id: 'aboutme',
      title: 'About Me',
      dateCreated: new Date('03/20/23'),
      lastUpdated: new Date('03/20/23'),
      isFolder: false,
      content: ''
    },
    {
      id: 'directory',
      title: 'Directory',
      dateCreated: new Date('03/20/23'),
      lastUpdated: new Date('03/20/23'),
      isFolder: true,
      children: [
        {
          id: 'practical-recursion-map',
          title: 'Practical recursion: mapping components',
          dateCreated: new Date('03/20/23'),
          lastUpdated: new Date('03/20/23'),
          isFolder: false,
          content: ''
        },
        {
          id: 'subdirectory',
          title: 'Subdirectory',
          dateCreated: new Date('03/20/23'),
          lastUpdated: new Date('03/20/23'),
          isFolder: true,
          children: [
            {
              id: 'practical-recursion-sort',
              title: 'Practical recursion: sorting files',
              dateCreated: new Date('03/20/23'),
              lastUpdated: new Date('03/20/23'),
              isFolder: false,
              content: ''
            }
          ]
        }
      ]
    }
  ]

  async function getFileContents(filePath: string) {
    const response = await fetch(filePath);
    const fileContents = await response.text();
    return fileContents;
  }
  
  const populateFiles = async (files: File[]) => {
    for (let file of files) {
      if (!file.isFolder) {
        const filePath = `/files/${file.id}.md`
        const content = await getFileContents(filePath);
        const response = await fetch(filePath);
        const fileContents = await response.text();

        console.log(content)
        console.log(response);
        console.log(fileContents)
        // file.content = content;
      } else if (file.isFolder && file.children) {

        // populateFiles(file.children);
      }
    }
  
    return files;
  };

  const files = populateFiles(fileSys);
  // user check
  useEffect(() => {
    const user = false; // replace with real user check
    if (!user) {
      // dispatch(getStaticProps());
      console.log(files);
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
