import {  } from 'react';
import { Routes, Route,  } from "react-router-dom";
import {  } from "react-redux";
import Login from "./Pages/AuthPage/auth";

// import axios from "axios";
import Layout from "./Pages/Layout";

function App() {
 

    return (
        <>
            <Layout />
            
           
            <Routes>
                

                <Route path="/login" element={<Login />} />
             

        
               
            </Routes>
        </>
    );
}



export default App
