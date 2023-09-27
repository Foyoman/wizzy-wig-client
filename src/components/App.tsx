import { useState, useEffect, useContext } from "react";
import MarkdownParser from "./MarkdownParser/MarkdownParser";
import Navbar from "./Navbar/Navbar";
import "./App.scss";
import "../assets/styles/global.scss";
import Sidebar from "./Sidebar/Sidebar";

// redux
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { setStaticProps } from "../store/appSlice";

import { File } from "../types/FileTypes";
import { fileSys } from "../lib/starter-files";

// auth
import SignUp from "./auth/SignUp";
import Login from "./auth/Login";

// mui
import CircularProgress from "@mui/material/CircularProgress";
import AuthContext from "../context/AuthContext";

export default function App() {
  const dispatch = useDispatch();
  const [starterFiles, setStarterFiles] = useState<File[] | null>(null);
  const showSidebar = useSelector((state: RootState) => state.app.showSidebar);
  const selectedFile = useSelector(
    (state: RootState) => state.app.selectedFile
  );
  const selectedTab = useSelector((state: RootState) => state.app.selectedTab);
  const [content, setContent] = useState<string | undefined>(
    selectedFile?.content as string | undefined
  );
  const tabs = useSelector((state: RootState) => state.app.tabs);

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { user } = useContext<any>(AuthContext);

  // user check
  useEffect(() => {
    // const user = false; // replace with real user check
    if (!user) {
      const fetchFileContents = async (file: File) => {
        if (!file.isFolder) {
          try {
            const filePath = `/files/${file.id}.md`;
            const response = await fetch(filePath);
            const fileContents = await response.text();
            return { ...file, content: fileContents };
          } catch (error) {
            console.error("Error fetching data:", error);
            return file; // Return the original file if there's an error
          }
        } else if (file.isFolder && file.children) {
          const updatedChildren: any = await Promise.all(
            file.children.map((childFile: File) => fetchFileContents(childFile))
          );
          return { ...file, children: updatedChildren };
        }
        return file;
      };

      const updateFileContents = async () => {
        const updatedFileSys = await Promise.all(
          fileSys.map((file) => fetchFileContents(file))
        );
        setStarterFiles(updatedFileSys);
      };

      updateFileContents();
    } else {
      setStarterFiles([]);
    }
  }, []);

  useEffect(() => {
    if (starterFiles) {
      dispatch(setStaticProps(starterFiles));
    }
  }, [starterFiles, dispatch]);

  useEffect(() => {
    setContent(selectedFile?.content as string | undefined);
  }, [selectedFile]);

  const handleLoginClick = (e: Event) => {
    e.preventDefault();
    console.log("login");
    setShowLogin(true);
  };

  const handleSignupClick = (e: Event) => {
    e.preventDefault();
    console.log("signup");
  };

  const closeModal = () => {
    setShowLogin(false);
    setShowSignup(false);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const loginEl = document.querySelector("a[href='#loginEl']");
      const signupEl = document.querySelector("a[href='#signupEl']");

      if (loginEl) {
        loginEl.addEventListener("click", handleLoginClick);
        clearInterval(intervalId);
      }
      if (signupEl) {
        signupEl.addEventListener("click", handleSignupClick);
        clearInterval(intervalId);
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
      const loginEl = document.querySelector("a[href='#loginEl']");
      const signupEl = document.querySelector("a[href='#signupEl']");

      if (loginEl) {
        loginEl.removeEventListener("click", handleLoginClick);
      }

      if (signupEl) {
        signupEl.removeEventListener("click", handleSignupClick);
      }
    };
  }, []);

  const NoFile = () => {
    return (
      <div className="no-file">
        <div>
          <h1>No file is open</h1>
          <p>Select a file from the sidebar or create a new file to start.</p>
        </div>
      </div>
    );
  };

  return starterFiles ? (
    <div className="page">
      <Navbar />
      {/* <SignUp /> */}
      {showLogin ? <Login closeModal={closeModal} /> : null}
      <div className="container">
        <Sidebar />
        <div className={`md-container ${!showSidebar ? "sidebar-hidden" : ""}`}>
          {tabs[selectedTab] ? (
            <MarkdownParser content={content} defaultSplit={[55, 45]} />
          ) : (
            <NoFile />
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="loading">
      <CircularProgress />
    </div>
  );
}
