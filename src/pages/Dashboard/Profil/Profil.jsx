import React, { useState, Fragment } from "react";
import Toggle from "./Toggle";
import Sidebar from "./Sidebar";
import Poids from '../ItemsList/Poids';

const Profil = (props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handlerOpen = () => {
    setSidebarOpen(!sidebarOpen);
  }
  const sidebarCloseHandler = () => {
	// Préparation pour ajouter les informations qui vont mettre à jour IMC si la taille change
	// Equipe Gestion - Poids avec autorisation de Équipe fittok
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