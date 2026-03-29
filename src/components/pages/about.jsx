import React from "react";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import Root from "../structure/root";

const header = () => {
  return (
    <>
      <h3 className="font-bold">
        Why Use{" "}
        <span className="hover:text-blue-500 hover:underline hover:animate-pulse">
          RentBack?
        </span>
      </h3>
      <Divider />
    </>
  );
};

const About = () => {
  return (
    <>
      <Root />
      <Card title={header}></Card>
      <p></p>
    </>
  );
};

export default About;
