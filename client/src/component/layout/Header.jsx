import { useSelector } from "react-redux";
import { BsBoxArrowRight, BsFillPersonPlusFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { setLogout } from "../../store";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import "./layout.scss";

const Header = () => {
    
    const [activeLink, setActiveLink] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const blur = useSelector((state) => state.makeBlur);

    const dispatch = useDispatch();

    const username = user ? user.name : "";
    const initials = username
        .split(" ")
        .map((word) => word[0])
        .join("");

    const handleLogout = async () => {
        await axios
        .get(`${BASE_URL}/api/logout`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            // console.log(res);
            if (res.data.status) {
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                toast.success(res.data.message);
                dispatch(setLogout());
                navigate("/login");
            }
        })
        .catch((error) => {
            toast.error("Server is not responding");
        });
    };

    useEffect(() => {
        // if (userData === null) {
        //     navigate("/login");
        // }
        setActiveLink(location.pathname);
    }, [user, location.pathname]);

   

    const handleNavLinkClick = (path) => {
        setActiveLink(path);
        navigate(path);
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary navbar-custom">
            <div
                className={`container-fluid ${
                    blur ? "is-blur disable-pointer-events" : ""
                }`}
            >
                <a className="navbar-brand" href="#" style={{ cursor:'auto'}}>
                    Trello
                </a>
                <button
                    className="navbar-toggler custom-navbar-toggler"
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
                    {/* <ul className="navbar-nav">
                        <li
                            className={`nav-item ${
                                activeLink === "/" ? "active" : ""
                            }`}
                        >
                            <a
                                className="nav-link active"
                                aria-current="page"
                                onClick={() => handleNavLinkClick("/")}
                            >
                                Home
                            </a>
                        </li>
                     
                    </ul> */}
                    <div className="logout-custom d-flex align-items-center gap-2">
                        {token && <button className="circular-button">{initials}</button>} 
                        
                         <button
                            
                            className="signout-button"
                        > 
                             <span className="logout-text" onClick={handleLogout}>Logout</span>  
                             <BsBoxArrowRight className="signout-icon" /> 
                            
                        </button> 

                        <ul className="navbar-nav custom-logout-dropdown  p-0">
                            <li className="nav-item dropdown">
                                <button
                                    className="btn btn-dark dropdown-toggle custom-logout-button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                   
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark p-0 mt-3 custom-dropdown-menu">
                                    <li onClick={handleLogout}>
                                        <a className="dropdown-item" href="#">
                                            Logout
                                        </a>
                                    </li>
                    
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
