import { useSelector } from "react-redux";
import { BsBoxArrowRight } from "react-icons/bs";
import {  useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate , useLocation} from "react-router-dom";
import axios from "axios";
// import { setLogout } from "../../store";
// import { toast } from "react-toastify";
// import { BASE_URL } from "../../config";
import "./layout.scss";

const Header = () => {
    const [activeLink, setActiveLink] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    


    const dispatch = useDispatch();

    const username = user ? user.name : "";
    const initials = username
        .split(" ")
        .map((word) => word[0])
        .join("");

        const handleLogout = async () => {
            await axios
                // .get(`${BASE_URL}/api/logout`, {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                // })
                // .then((res) => {
                //     console.log(res);
                //     if (res.data.status) {
                //         localStorage.removeItem("token");
                //         localStorage.removeItem("user_id");
                //         toast.success(res.data.message);
                //         dispatch(setLogout());
                //         navigate("/login");
                //     }
                // })
                // .catch((error) => {
                //     toast.error("Server is not responding");
                // });
        };
    
        useEffect(() => {
            // if (userData === null) {
            //     navigate("/login");
            // }
            setActiveLink(location.pathname);
        }, [user,location.pathname]);
    
        // let loggedUserName = "";
    
        // if (userData !== null) {
        //     loggedUserName = userData.name;
        // }

        const handleNavLinkClick = (path) => {
            setActiveLink(path);
            navigate(path);
        };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary navbar-custom">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    Vault Manager
                </a>
                <button
                    className="navbar-toggler "
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse position-relative"
                    id="navbarNavDropdown"
                >
                    <ul className="navbar-nav">
                        <li className={`nav-item ${activeLink==="/" ? "active" : ''}`}>
                            <a
                                className="nav-link active"
                                aria-current="page"
                                onClick={() => handleNavLinkClick("/")}
                            >
                                Home
                            </a>
                        </li>
                        <li className={`nav-item ${activeLink==="/tools" ? "active" : ''}`}>
                            <a className="nav-link" onClick={() => handleNavLinkClick("/tools")}>
                                Tools
                            </a>
                        </li>
                        
                    </ul>
                    <div className="logout-custom d-flex ">
                       {token && <button className="circular-button">{initials}</button>} 
                        <button
                            onClick={handleLogout}
                            className="signout-button"
                        >
                            <span className="logout-text">Logout</span>
                            <BsBoxArrowRight className="signout-icon" />
                        </button>

                        
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
