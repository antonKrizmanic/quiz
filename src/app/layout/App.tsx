import React from 'react';
import logo from '../../logo.svg';
import '../../App.css';
import { Route, Routes } from "react-router-dom";
import Home from '../../feature/Home';
import Forbidden from '../errors/Forbidden';
import ServerError from '../errors/ServerError';



function App() {
    return (
        <div className="App">
            <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <div className="w-full flex-grow mx-auto py-8">
                    <Routes>
                        <Route path="/" element={<Home />} >
                            <Route path="forbidden" element={<Forbidden />} />
                            <Route path="server-error" element={<ServerError />} />

                        </Route>
                    </Routes>
                </div>
                <footer className="text-center text-gray-400">Copyright © KOD KAD 2022</footer>
            </div>
        </div >
    );
}

export default App;
