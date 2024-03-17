import "./layout.scss";
import { useSelector } from "react-redux";

const Footer = () => {
    const blur = useSelector((state) => state.makeBlur);

    return (
        <footer
            className={`footer ${blur ? "is-blur disable-pointer-events" : ""}`}
        >
            <div className="container">
                <div className="row d-flex flex-wrap">
                    <div className="col-md-6 footer-left">
                        <ul style={{ listStyle: "none" }}>
                            <li>Email: tanvirxahm@gmail.com</li>
                            <li>Phone: +88017798.....</li>
                            <li>Address: Sylhet, Bangladesh</li>
                        </ul>
                    </div>
                    <div className="col-md-6 footer-right">
                        <p className="text-center">
                            © 2024 Trello Clone. All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
