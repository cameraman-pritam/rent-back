import React from "react";
import { Card } from "primereact/card";
import icon from "../../assets/icon.png";
import NavBar from "../navbar";

const subtitle = () => {
  return (
    <>
      <p>
        <span className="text-2xl">Welcome to</span>{" "}
        <span className="text-2xl inline-block cursor-pointer transition-all duration-150 ease-out hover:scale-110 hover:-translate-y-1 hover:text-blue-500 hover:shadow-lg hover:rotate-2">
          Rent-Back
        </span>
        .
      </p>{" "}
      <br />
      <p>
        A modern hub to share everyday items among residents of the same area.
      </p>
      <i>Together we can work for a Sustainable and Bright future.</i>
    </>
  );
};

const Root = () => {
  return (
    <>
      <div className="flex items-stretch gap-4 justify-between">
        <Card
          title={NavBar}
          subTitle={subtitle}
          className="md:w-25rem w-7/10"
        ></Card>
        <div className="w-3/10">
          <img src={icon} className="rounded-3xl" />
        </div>
      </div>
    </>
  );
};

export default Root;
