import React, { useRef, useState } from "react";
import "./Toolbar.scss";

import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";
import Check from "@mui/icons-material/Check";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import { File, SortKeys, SortFunction, NewFile } from "../../../types/index";
import { useDispatch, useSelector } from "react-redux";
import {
  sortFs,
  createFileState,
  deleteFileState,
  setTabs,
  selectFile,
  selectTab,
  selectItem,
} from "../../../store/appSlice";
import { createFile, deleteFile } from "../../../store/apiSlice";
import { AppDispatch, RootState } from "../../../store/store";
import { getFileDetails } from "../../../store/helpers";

interface ToolbarProps {
  items: File[];
}

export default function Toolbar({ items }: ToolbarProps) {
  const selectedItem = useSelector(
    (state: RootState) => state.app.selectedItem
  );
  const tabs = useSelector((state: RootState) => state.app.tabs);
  const selectedTab = useSelector((state: RootState) => state.app.selectedTab);
  const files = useSelector((state: RootState) => state.app.files);

  const [filterEl, setFilterEl] = useState<HTMLElement | null>(null);
  const filterOpen = Boolean(filterEl);

  // custom hook?
  const [createFileEl, setCreateFileEl] = useState<HTMLElement | null>(null);
  const [fileTitle, setFileTitle] = useState<string | "">("");
  const createFileOpen = Boolean(createFileEl);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [createFolderEl, setCreateFolderEl] = useState<HTMLElement | null>(
    null
  );
  const [folderTitle, setFolderTitle] = useState<string | "">("");
  const createFolderOpen = Boolean(createFolderEl);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const [deleteEl, setDeleteEl] = useState<HTMLElement | null>(null);
  const deleteOpen = Boolean(deleteEl);

  const user = useSelector((state: RootState) => state.auth.user);

  const storeSort = useSelector((state: RootState) => state.app.sort);
  const [sort, setSort] = useState<{
    sortKey: SortKeys;
    reverse: boolean;
  } | null>({
    sortKey: storeSort.sortKey || "title",
    reverse: storeSort.reverse || false,
  });

  const dispatch: AppDispatch = useDispatch();
  const selectedFolder = useSelector(
    (state: RootState) => state.app.selectedFolder
  );

  const handleCreateFile = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setCreateFileEl(e.currentTarget);
    setTimeout(() => {
      fileInputRef.current?.focus();
    }, 1);
  };

  const handleCreateFolder = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setCreateFolderEl(e.currentTarget);
    setTimeout(() => {
      folderInputRef.current?.focus();
    }, 1);
  };

  const handleDeleteEl = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setDeleteEl(e.currentTarget);
  };

  const handleCreateFileClose = () => {
    setCreateFileEl(null);
    setFileTitle("");
  };

  const handleCreateFolderClose = () => {
    setCreateFolderEl(null);
    setFolderTitle("");
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    dispatch(deleteFileState(selectedItem));
    if (user) dispatch(deleteFile(selectedItem));

    let newTabs: (File["id"] | null)[];
    const nestedFiles: File[] = [];

    const fileDetails = getFileDetails(files, selectedItem);

    if (fileDetails?.is_folder) {
      const findNestedFiles = (item: File) => {
        item.children?.forEach((child) => {
          if (child.is_folder) {
            findNestedFiles(child);
          } else {
            nestedFiles.push(child);
          }
        });
      };

      findNestedFiles(fileDetails);
      const nestedFilesIds = nestedFiles.map((file) => file.id);
      newTabs = tabs.filter((tab) => !nestedFilesIds.includes(tab!));

      const deletedIndices = [];
      for (let i = 0; i < nestedFiles.length; i++) {
        if (tabs.includes(nestedFilesIds[i] as never)) {
          deletedIndices.push(tabs.indexOf(nestedFilesIds[i] as never));
        }
      }

      const tabShift = deletedIndices.filter((n) => n <= selectedTab).length;
      const indexShift = selectedTab - tabShift;
      dispatch(selectTab(indexShift >= 0 ? indexShift : 0));

      if (newTabs[indexShift]) {
        dispatch(selectFile(newTabs[indexShift]!));
      }
    } else {
      newTabs = tabs.filter((tab) => tab !== selectedItem);

      if (newTabs.length > 1) {
        const shift = tabs.length - 1 > selectedTab ? 0 : 1;
        dispatch(selectTab(selectedTab - shift));

        if (newTabs[selectedTab - shift]) {
          dispatch(selectFile(newTabs[selectedTab - shift]!));
        }
      } else {
        dispatch(selectTab(0));
      }
    }

    if (!newTabs.length) newTabs = [null];
    dispatch(setTabs(newTabs));
    dispatch(selectItem(null));

    setDeleteEl(null);
  };

  const handleSortSelect: SortFunction = (items, sortKey, reverse) => {
    dispatch(sortFs({ items, sortKey, reverse }));
    setSort({ sortKey: sortKey, reverse: reverse });
    setFilterEl(null);
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    key: "file" | "folder"
  ) => {
    e.preventDefault();
    if (!selectedItem) console.log("no selected item");
    let title: string;
    if (key === "file") {
      title = fileTitle;
      setCreateFileEl(null);
      setFileTitle("");
    } else {
      title = folderTitle;
      setCreateFolderEl(null);
      setFolderTitle("");
    }

    const tempId = Date.now() + Math.round(Math.random() * 1000);
    const newFile: Omit<File, "date_created" | "last_modified"> = {
      title: title ? title : "Untitled",
      content: key === "file" ? "" : null,
      is_folder: key === "folder",
      parent: selectedFolder || null,
      children: key === "folder" ? [] : null,
    };

    const newFileState: File = {
      ...newFile,
      id: tempId,
      date_created: new Date().toISOString(),
      last_modified: new Date().toISOString(),
    };

    const newFileToPost: NewFile = {
      ...newFile,
      temp_id: tempId,
    };

    dispatch(createFileState(newFileState));
    if (user) dispatch(createFile(newFileToPost));
  };

  interface CheckedProps extends JSX.IntrinsicAttributes {
    visible?: boolean;
  }

  const Checked = ({ visible = false }: CheckedProps) => {
    return (
      <ListItemIcon
        style={{
          visibility: visible ? "visible" : "hidden",
        }}
      >
        <Check />
      </ListItemIcon>
    );
  };

  return (
    <div className="toolbar">
      <div className="selected-folder">
        <p title={getFileDetails(files, selectedFolder)?.title || ""}>
          dir:{" "}
          {selectedFolder
            ? getFileDetails(files, selectedFolder)?.title
            : "root (~)"}
        </p>
      </div>
      <div className="tools">
        {/* create new file */}
        <Button
          className="toolbar-button"
          aria-controls={createFileOpen ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={createFileOpen ? "true" : undefined}
          onClick={handleCreateFile}
        >
          <NoteAddOutlinedIcon className="icon" />
        </Button>
        <Menu
          className="dropdown-menu"
          anchorEl={createFileEl}
          open={createFileOpen}
          onClose={handleCreateFileClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem className="menu-item">
            <form onSubmit={(e) => handleSubmit(e, "file")}>
              <input
                // autoFocus
                id="input-el"
                ref={fileInputRef}
                type="text"
                maxLength={30}
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
                placeholder="Untitled"
              />
            </form>
          </MenuItem>
        </Menu>
        {/* create new folder */}
        <Button
          className="toolbar-button"
          aria-controls={createFolderOpen ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={createFolderOpen ? "true" : undefined}
          onClick={handleCreateFolder}
        >
          <CreateNewFolderOutlinedIcon className="icon" />
        </Button>
        <Menu
          className="dropdown-menu"
          anchorEl={createFolderEl}
          open={createFolderOpen}
          onClose={handleCreateFolderClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem className="menu-item">
            <form onSubmit={(e) => handleSubmit(e, "folder")}>
              <input
                // autoFocus
                id="input-el"
                ref={folderInputRef}
                type="text"
                maxLength={30}
                value={folderTitle}
                onChange={(e) => setFolderTitle(e.target.value)}
                placeholder="Untitled"
              />
            </form>
          </MenuItem>
        </Menu>
        {/* delete */}
        <Button
          className="toolbar-button"
          aria-controls={deleteOpen ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={deleteOpen ? "true" : undefined}
          onClick={handleDeleteEl}
        >
          <DeleteOutlinedIcon className="icon" />
        </Button>
        <Menu
          className="dropdown-menu"
          anchorEl={deleteEl}
          open={deleteOpen}
          onClose={() => setDeleteEl(null)}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem className="menu-item">
            {selectedItem ? (
              <div className="delete-confirm">
                <div className="file-to-delete">
                  <p>
                    {getFileDetails(files, selectedItem)?.is_folder
                      ? "Folder "
                      : "File "}
                    to delete:
                  </p>
                  <p>{getFileDetails(files, selectedItem)?.title}</p>
                </div>
                <p>Are you sure?</p>
                <div className="confirm-buttons">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                  >
                    Confirm
                  </Button>
                  <Button variant="outlined" onClick={() => setDeleteEl(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="delete-confirm">
                <p>Select an item to delete</p>
                <Button variant="outlined" onClick={() => setDeleteEl(null)}>
                  Ok
                </Button>
              </div>
            )}
          </MenuItem>
        </Menu>
        {/* filter menu */}
        <Button
          className="toolbar-button"
          aria-controls={filterOpen ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={filterOpen ? "true" : undefined}
          onClick={(e) => setFilterEl(e.currentTarget)}
        >
          <SortOutlinedIcon className="icon" />
        </Button>
        <Menu
          className="dropdown-menu"
          anchorEl={filterEl}
          open={filterOpen}
          onClose={() => setFilterEl(null)}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuList id="menu-list" dense>
            <MenuItem
              className="menu-item"
              onClick={() => handleSortSelect(items, "title", false)}
            >
              <Checked visible={sort?.sortKey === "title" && !sort?.reverse} />
              <ListItemText>File Name (A - Z)</ListItemText>
            </MenuItem>
            <MenuItem
              className="menu-item"
              onClick={() => handleSortSelect(items, "title", true)}
            >
              <Checked visible={sort?.sortKey === "title" && sort?.reverse} />
              <ListItemText>File Name (Z - A)</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              className="menu-item"
              onClick={() => handleSortSelect(items, "last_modified", false)}
            >
              <Checked
                visible={sort?.sortKey === "last_modified" && !sort?.reverse}
              />
              <ListItemText>Date Modified (Newest First)</ListItemText>
            </MenuItem>
            <MenuItem
              className="menu-item"
              onClick={() => handleSortSelect(items, "last_modified", true)}
            >
              <Checked
                visible={sort?.sortKey === "last_modified" && sort?.reverse}
              />
              <ListItemText>Date Modified (Oldest First)</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              className="menu-item"
              onClick={() => handleSortSelect(items, "date_created", false)}
            >
              <Checked
                visible={sort?.sortKey === "date_created" && !sort?.reverse}
              />
              <ListItemText>Date Created (Newest First)</ListItemText>
            </MenuItem>
            <MenuItem
              className="menu-item"
              onClick={() => handleSortSelect(items, "date_created", true)}
            >
              <Checked
                visible={sort?.sortKey === "date_created" && sort?.reverse}
              />
              <ListItemText>Date Created (Oldest First)</ListItemText>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
}
