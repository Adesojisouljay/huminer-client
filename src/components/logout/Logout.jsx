import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../redux/userSlice";
import { persistor } from "../../redux";
import "./index.css"

const LogoutButton = () => {
  const dispatch = useDispatch();

  const { activeUser } = useSelector((state) => state.huminer);

  const handleLogout = async () => {
    dispatch(logoutUser());
    await persistor.purge(); // clears persisted storage (localStorage)
    localStorage.removeItem("huminerToken");
  window.location.reload(); // optional, forces UI to refresh
  };

  return (
    (!activeUser ? <Link to={"/login"}>
      <button className="login-btn">Login</button>
      </Link> : <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>)
    );
};

export default LogoutButton;
