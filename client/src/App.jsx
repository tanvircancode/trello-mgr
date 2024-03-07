import {  } from 'react';
import { Routes, Route,  } from "react-router-dom";
import {  } from "react-redux";
import Login from "./Pages/AuthPage/auth";

// import axios from "axios";
import Layout from "./Pages/Layout";
import Home from './Pages/Home';

function App() {
 

    return (
        <>
            <Layout />
            
           {/* <InitUser /> */}
            <Routes>
                

                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />

        
               
            </Routes>
        </>
    );
}

// function InitUser() {
    //     const dispatch = useDispatch();
    //     const token = useSelector((state) => state.token);
    //     // console.log(token);
    
    
    //     const init = async () => {
    //         try {
    //             const response = await axios.get(`${BASE_URL}/api/me`, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             });
    
    //             if (response.data.user) {
    
    //                 dispatch(
    //                     setLogin({
    //                         user: response.data.user,
    //                         token: token,
    //                     })
    //                 );
    //             } else {
    //                 dispatch(
    //                     setLogin({
    //                         user: null,
    //                         token: null,
    //                     })
    //                 );
    //                 dispatch(setSelectedItems(null));
    //                 localStorage.removeItem("token");
    //                 localStorage.removeItem("user_id");
    //             }
    //         } catch (e) {
    
    //             dispatch(
    //                 setLogin({
    //                     user: null,
    //                     token: null,
    //                 })
    //             );
    //             dispatch(setSelectedItems(null));
    //             localStorage.removeItem("token");
    //             localStorage.removeItem("user_id");
    
    //         }
    //     };
    
    //     useEffect(() => {
    //         init();
    //     }, []);
    
    //     return <></>;
    // }



export default App
