import React from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

// IMPORT YOUR CUSTOM HOOK (Adjust the path if your context folder is elsewhere)
import { useAuth } from "./context/AuthContext";

const NavBar = () => {
  const navigate = useNavigate();

  // PULL GLOBAL STATE FROM CONTEXT
  const { user, userData } = useAuth();

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
    <div className="flex align-items-center gap-3">
      {/* CONDITIONALLY RENDER BASED ON LOGIN STATUS */}
      {user ? (
        <>
          <span className="font-medium text-gray-700 hidden sm:inline">
            {/* Grab just the first name if it exists */}
            Hi, {userData?.name ? userData.name.split(" ")[0] : "User"}!
          </span>
          <Button
            label="My Profile"
            icon="pi pi-user"
            className="p-button-outlined p-button-info"
            onClick={() => navigate("/auth")}
          />
        </>
      ) : (
        <Button
          label="Sign Up | Sign In"
          className="p-button-raised p-button-info"
          onClick={() => navigate("/auth")}
        />
      )}
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
