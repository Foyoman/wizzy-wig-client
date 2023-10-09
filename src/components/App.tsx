import { useState, useEffect, useContext } from "react";
import MarkdownParser from "./MarkdownParser/MarkdownParser";
import Navbar from "./Navbar/Navbar";
import "./App.scss";
import "../assets/styles/global.scss";
import Sidebar from "./Sidebar/Sidebar";

// redux
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { setStaticProps, setUserData } from "../store/appSlice";

// types/files
import { ClickEvent } from "../types/ReactTypes";
import { File } from "../types/FileTypes";
import { fileSys } from "../lib/fileSys";

// auth
import SignUp from "./auth/SignUp";
import Login from "./auth/Login";
import useAxios from "../utils/useAxios";

// helpers
import { findById, getFileDetails } from "../store/helpers";

// mui
import CircularProgress from "@mui/material/CircularProgress";
import AuthContext from "../context/AuthContext";


export default function App() {
  const dispatch: AppDispatch = useDispatch();
  const showSidebar = useSelector((state: RootState) => state.app.showSidebar);
  const selectedFile = useSelector(
    (state: RootState) => state.app.selectedFile
  );
  const selectedTab = useSelector((state: RootState) => state.app.selectedTab);
  const files = useSelector((state: RootState) => state.app.files);
  const [content, setContent] = useState<string | undefined>(
    getFileDetails(files, selectedFile)?.content as string | undefined
  );
  const tabs = useSelector((state: RootState) => state.app.tabs);

  const [loaded, setLoaded] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // auth
  const { user } = useContext<any>(AuthContext);
  const api = useAxios();

  const formatFiles = (files: File[]) => {
    const filesCopy = new Array(...files);
    const fileStructure = [];

    for (const file of filesCopy) {
      if (!file.parent) {
        fileStructure.push(file);
      } else {
        const parent = filesCopy.find((findFile) => {
          return findFile.id == file.parent;
        });

        const childIds = parent?.children?.map((child) => child.id);

        if (parent && !childIds?.includes(file.id)) {
          if (parent.children?.length) {
            parent.children.push(file);
          } else {
            parent.children = [file];
          }
        }
      }
    }

    return fileStructure;
  };

  const getFiles = async () => {
    const response = await api.get("/api/files/");

    if (response.status === 200) {
      const userFileSystem = formatFiles(response.data);
      dispatch(setUserData(userFileSystem));
    }

    setLoaded(true); // move to getFiles as it's async
  };

  const fetchFileContents = async (file: File) => {
    if (!file.is_folder) {
      try {
        const fileName = file.title.replace(/\s+/g, "-").toLowerCase();
        const filePath = `/files/${fileName}.md`;
        const response = await fetch(filePath);
        const fileContents = await response.text();
        return { ...file, content: fileContents };
      } catch (error) {
        console.error("Error fetching data:", error);
        return file; // Return the original file if there's an error
      }
    } else {
      return file;
    }
  };

  const updateFileContents = async (files: File[]) => {
    const updatedFileSys = await Promise.all(
      files.map((file) => fetchFileContents(file))
    );
    const formattedFileSys = formatFiles(updatedFileSys);
    dispatch(setStaticProps(formattedFileSys));
    setLoaded(true);
  };

  useEffect(() => {
    const fileSysCopy = new Array(...fileSys)

    if (!user) {
      updateFileContents(fileSysCopy);
    } else {
      getFiles();
    }
  }, [user]);

  useEffect(() => {
    setContent(getFileDetails(files, selectedFile)?.content as string | undefined);
  }, [selectedFile]);

  const handleLoginClick: ClickEvent = (e) => {
    e?.preventDefault();
    setShowLogin(true);
    setShowSignUp(false);
  };

  const handleSignupClick: ClickEvent = (e) => {
    e?.preventDefault();
    setShowSignUp(true);
    setShowLogin(false);
  };

  const closeModal: ClickEvent = (e) => {
    e?.preventDefault();
    setShowLogin(false);
    setShowSignUp(false);
  };

  const switchModal: ClickEvent = (e) => {
    e?.preventDefault();
    setShowLogin(!showLogin);
    setShowSignUp(!showSignUp);
  };

  useEffect(() => {
    if (user) return;

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
  }, [selectedFile, selectedTab]);

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

  return loaded ? (
    <div className="page">
      <Navbar />
      {/* <SignUp /> */}
      {showSignUp ? (
        <SignUp closeModal={closeModal} switchModal={switchModal} />
      ) : null}
      {showLogin ? (
        <Login closeModal={closeModal} switchModal={switchModal} />
      ) : null}
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
