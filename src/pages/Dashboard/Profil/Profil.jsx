import React, { useState, Fragment } from "react";
import Toggle from "./Toggle";
import Sidebar from "./Sidebar";

const Profil = (props) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const handlerOpen = () => {
        setSidebarOpen(!sidebarOpen);
    }
    const sidebarCloseHandler = () => {
        setSidebarOpen(false);
        props.close();
    }

    let sidebar = sidebarOpen ? <Sidebar close={sidebarCloseHandler} sidebarClass="sidebar"/> : '';
    
    return (
        <Fragment>
            {sidebar}
            <Toggle click={handlerOpen}/>
            <p>{props.children}</p>
        </Fragment>
    )
}
export default Profil;