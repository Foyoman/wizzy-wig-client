import React, { useState } from "react";
import "./FileSystem.scss";

import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { File } from "../../../types/index";

import { useDispatch, useSelector } from "react-redux";
import {
  setTab,
  selectFolder,
  selectTab,
  selectFile,
  selectItem,
  setAllowSave,
  openInNewTab,
} from "../../../store/appSlice";
import { AppDispatch, RootState } from "../../../store/store";
import { Divider, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";

interface FileSystemProps {
  items: File[];
}

const FileSystem = ({ items }: FileSystemProps) => {
  const dispatch: AppDispatch = useDispatch();
  const tabs = useSelector((state: RootState) => state.app.tabs);
  const allowSave = useSelector((state: RootState) => state.app.allowSave);

  const [dotsEl, setDotsEl] = useState<{
    el: (EventTarget & SVGSVGElement) | null;
    id: number | undefined | null;
  }>({
    el: null,
    id: null,
  });
  const dotsOpen = Boolean(dotsEl.el);

  const handleSelect = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    item: File,
    parent: File | null
  ) => {
    e.stopPropagation();
    if (allowSave) return;
    dispatch(selectItem(item.id));
    if (!item.is_folder) {
      dispatch(selectFolder(parent?.id));
      if (tabs.includes(item.id as never)) {
        // if open tabs includes file, set tab to that file
        dispatch(selectTab(tabs.indexOf(item.id as never)));
      } else {
        dispatch(setTab(item.id));
      }
      dispatch(selectFile(item.id));
    } else {
      dispatch(selectFolder(item.id));
    }
  };

  const handleAuxClick = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    item: File
  ) => {
    e.stopPropagation();
    if (e.button === 1) {
      dispatch(openInNewTab(item));
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
      if (item.is_folder) {
        return (
          <div key={item.id} className="folder-wrapper wrapper">
            <TreeItem
              nodeId={`${item.id}`}
              label={item.title}
              title={item.title}
              className={`file ${nested && "nested"}`}
              onClick={(e) => handleSelect(e, item, parent)}
            >
              {item.children?.length ? (
                mapDirectory(item.children, item, true)
              ) : (
                <span style={{ display: "none" }} />
              )}
            </TreeItem>
            <MoreVertIcon className="dots" />
          </div>
        );
      } else {
        return (
          <div key={item.id} className="file-wrapper wrapper">
            <TreeItem
              nodeId={`${item.id}`}
              label={item.title}
              title={item.title}
              className={`file ${nested && "nested"}`}
              onClick={(e) => handleSelect(e, item, parent)}
              onClickCapture={() => dispatch(setAllowSave(false))}
              onAuxClick={(e) => handleAuxClick(e, item)}
              onAuxClickCapture={() => dispatch(setAllowSave(false))}
            />
            <MoreVertIcon
              className="dots"
              style={{
                display: dotsOpen && item.id === dotsEl.id ? "block" : "",
              }}
              onClick={(e) => setDotsEl({ el: e.currentTarget, id: item.id })}
            />
            <Menu
              className="dot-menu"
              anchorEl={dotsEl.el}
              open={dotsOpen && item.id === dotsEl.id}
              onClose={() => setDotsEl({ el: null, id: null })}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuList id="menu-list" dense>
                <MenuItem className="menu-item">
                  <ListItemText>Move</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem className="menu-item">
                  <ListItemText>Rename</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem className="menu-item">
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem className="menu-item">
                  <ListItemText>Hello</ListItemText>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        );
      }
    });
  };

  const mappedItems = mapDirectory(items, null, false);

  return (
    <TreeView
      className="file-system"
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
