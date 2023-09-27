import "./Sidebar.scss";

import FileSystem from "./FileSystem/FileSystem";
import Toolbar from "./Toolbar/Toolbar";

import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

export default function Sidebar() {
  const files = useSelector((state: RootState) => state.app.files);
  const showSidebar = useSelector((state: RootState) => state.app.showSidebar);

  return (
    <div className={`sidebar ${!showSidebar ? "hide" : ""}`}>
      <Toolbar items={files} />
      <FileSystem items={files} />
    </div>
  );
}
