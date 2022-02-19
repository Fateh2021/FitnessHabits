import React, { useState } from "react";
import Toggle from "./Toggle";
import Sidebar from "./Sidebar";
import Poids from '../ItemsList/Poids';

const Profil = ({ children, close: parentHandleSidebarClose}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = (newState) => {
        setIsSidebarOpen(newState);
        if (newState === false) {
            parentHandleSidebarClose();
        }
    }

    return (
        <>
            {isSidebarOpen && <Sidebar close={() => handleSidebarToggle(false)} sidebarClass="sidebar"/>}
            <Toggle click={() => handleSidebarToggle(!isSidebarOpen)}/>
            <p>{children}</p>
        </>
    )
}
export default Profil;