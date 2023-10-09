import { useContext } from "react";
import "./Navbar.scss";
import Tabs from "./Tabs/Tabs";

// redux
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../store/appSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

// mui
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";
import LinearProgress from "@mui/joy/LinearProgress";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import AuthContext from "../../context/AuthContext";

export default function Navbar() {
  const saveState = useSelector((state: RootState) => state.api.saveState);
  const dispatch = useDispatch();
  const { user, logoutUser } = useContext<any>(AuthContext);

  return (
    <div className="navbar">
      <div className="utils">
        <div className="leftside-nav">
          <ViewSidebarOutlinedIcon
            className="toggle-sidebar"
            onClick={() => dispatch(toggleSidebar())}
          />
          {user ? (
            <AccountCircleIcon
              className="profile"
              onClick={() => logoutUser()}
            />
          ) : null}
        </div>
        <div className="save-state">
          <LinearProgress
            className={saveState}
            color={"neutral"}
            variant="plain"
            size="sm"
            determinate={saveState === "saved"}
            value={75}
          />
          <p>{saveState}</p>
        </div>
      </div>
      <Tabs />
    </div>
  );
}
