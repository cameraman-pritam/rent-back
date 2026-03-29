import React from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => navigate("/"),
    },
    {
      label: "Browse Items",
      icon: "pi pi-search",
      command: () => navigate("/browse"),
    },
    {
      label: "About",
      icon: "pi pi-info-circle",
      command: () => navigate("/about"),
    },
  ];

  const start = (
    <div
      className="flex align-items-center cursor-pointer mr-4"
      onClick={() => navigate("/")}
    >
      <span className="text-xl font-bold transition-all duration-150 ease-out hover:scale-110 hover:text-blue-500 hover:rotate-2">
        Rent-Back
      </span>
    </div>
  );

  const end = (
    <div className="flex gap-2">
      <Button
        label="Sign In"
        className="p-button-text hover:text-blue-500"
        onClick={() => navigate("/signin")}
      />
      <Button
        label="Sign Up"
        className="p-button-raised p-button-info"
        onClick={() => navigate("/signup")}
      />
    </div>
  );

  return (
    <div className="card mb-4 shadow-1">
      <Menubar
        model={items}
        start={start}
        end={end}
        className="border-none px-4"
      />
    </div>
  );
};

export default NavBar;
