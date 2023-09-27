import React from "react";
import "./FileSystem.scss";

import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { File } from "../../../types/FileTypes";

import { useDispatch, useSelector } from "react-redux";
import {
  setTab,
  selectFolder,
  selectTab,
  selectFile,
  selectItem,
} from "../../../store/appSlice";
import { RootState } from "../../../store/store";

interface FileSystemProps {
  items: File[];
}

const FileSystem = ({ items }: FileSystemProps) => {
  const dispatch = useDispatch();
  const tabs = useSelector((state: RootState) => state.app.tabs);

  const handleSelect = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    item: File,
    parent: File | null
  ) => {
    e.stopPropagation();
    dispatch(selectItem(item));
    if (!item.isFolder) {
      dispatch(selectFolder(parent));
      const tabIds = tabs.map((tab) => {
        return tab ? tab.id : null;
      });
      if (tabIds.includes(item.id as never)) {
        // if open tabs includes file, set tab to that file
        dispatch(selectTab(tabIds.indexOf(item.id as never)));
      } else {
        dispatch(setTab(item));
      }
      dispatch(selectFile(item));
    } else {
      dispatch(selectFolder(item));
    }
  };

  const handleDeselect = () => {
    dispatch(selectFolder(null));
    dispatch(selectItem(null));
  };

  const mapDirectory = (
    items: File[],
    parent: File | null,
    nested: boolean
  ) => {
    return items.map((item) => {
      if (item.isFolder) {
        return (
          <TreeItem
            nodeId={`${item.id}`}
            key={item.id}
            label={item.title}
            title={item.title}
            className={`sidebar-item ${nested && "nested"}`}
            onClick={(e) => handleSelect(e, item, parent)}
          >
            {item.children?.length ? (
              mapDirectory(item.children, item, true)
            ) : (
              <span style={{ display: "none" }} />
            )}
          </TreeItem>
        );
      } else {
        return (
          <TreeItem
            nodeId={`${item.id}`}
            key={item.id}
            label={item.title}
            title={item.title}
            className={`sidebar-item ${nested && "nested"}`}
            onClick={(e) => handleSelect(e, item, parent)}
          />
        );
      }
    });
  };

  const mappedItems = mapDirectory(items, null, false);

  return (
    <TreeView
      className="sidebar-items"
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
      onClick={handleDeselect}
    >
      {mappedItems}
    </TreeView>
  );
};

export default React.memo(FileSystem);
