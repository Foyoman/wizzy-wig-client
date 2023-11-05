import React, { useEffect, useRef } from "react";
import "./Tabs.scss";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch } from "react-redux";
import {
  selectTab,
  newTab,
  closeTab,
  selectFile,
  selectItem,
  setAllowSave,
} from "../../../store/appSlice";

import { File } from "../../../types/index";
import { getFileDetails } from "../../../store/helpers";

export default function Tabs() {
  const dispatch: AppDispatch = useDispatch();
  const tabs = useSelector((state: RootState) => state.app.tabs);
  const selectedTab = useSelector((state: RootState) => state.app.selectedTab);
  const tabBarEl: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

  const files = useSelector((state: RootState) => state.app.files);
  const allowSave = useSelector((state: RootState) => state.app.allowSave);

  // scroll to end of tab bar if new tab is created
  useEffect(() => {
    tabBarEl.current!.scrollLeft =
      tabBarEl.current!.scrollWidth - tabBarEl.current!.offsetWidth;
  }, [tabs.length]);

  useEffect(() => {
    tabBarEl.current!.addEventListener("wheel", handleScroll, {
      passive: true,
    });
  });

  // allows tab-bar to be scrolled horizontally even with vertical scroll
  const handleScroll = (e: WheelEvent) => {
    e.preventDefault();
    tabBarEl.current!.scrollLeft += e.deltaY;
  };

  const closeHelper = (index: number) => {
    dispatch(closeTab(index));
    console.log("closing");
    if (selectedTab === index) {
      if (index === tabs.length - 1) {
        dispatch(selectFile(tabs[selectedTab - 1]!));
      } else {
        dispatch(selectFile(tabs[index + 1]!));
      }
    }
  };

  interface TabProps {
    fileId?: File["id"];
    title?: string;
    selected: boolean;
    index: number;
  }

  const Tab = ({ fileId, title = "New tab", selected, index }: TabProps) => {
    const handleSelect = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
      index: number
    ) => {
      e.stopPropagation();
      console.log(e.button);
      if (e.button === 1) {
        closeHelper(index);
      } else {
        if (allowSave) return;
        console.log(fileId);
        dispatch(selectTab(index));
        if (fileId) {
          dispatch(selectFile(fileId));
          dispatch(selectItem(fileId));
        }
      }
    };

    const handleClose = (
      e: React.MouseEvent<SVGSVGElement, MouseEvent>,
      index: number
    ) => {
      e.stopPropagation();
      console.log("close");
      closeHelper(index);
    };

    const handleMouseDown = () => {
      dispatch(setAllowSave(false));
    };

    return (
      <div
        title={title}
        onMouseUp={(e) => handleSelect(e, index)}
        onMouseDown={handleMouseDown}
        className={`
					tab  
					${selected ? "selected" : ""}
					${index >= tabs.length - 1 ? "last-index" : ""}
				`}
      >
        <p>{title}</p>
        <CloseOutlinedIcon
          className="close-icon"
          onClick={(e) => handleClose(e, index)}
        />
      </div>
    );
  };

  return (
    <div className="tab-container">
      <div className="tab-bar" ref={tabBarEl} id="tab-bar">
        <div className="tabs">
          {tabs.map((fileId, index) => {
            if (fileId) {
              return (
                <Tab
                  fileId={fileId}
                  title={getFileDetails(files, fileId)?.title}
                  selected={index === selectedTab}
                  index={index}
                  key={index}
                />
              );
            } else {
              return (
                <Tab
                  title="New tab"
                  selected={index === selectedTab}
                  index={index}
                  key={index}
                />
              );
            }
          })}
        </div>
      </div>
      <div className="new-tab">
        <AddOutlinedIcon
          className="new-tab-icon"
          onClick={() => dispatch(newTab())}
        />
      </div>
    </div>
  );
}
