import React from "react";
import { Card } from "primereact/card";
import icon from "../assets/icon.png";

const Root = () => {
  return (
    <>
      <div className="flex items-stretch gap-4 justify-between">
        <Card
          title="Welcome"
          subTitle="Elevate your living experience in just a click!"
          className="md:w-25rem w-7/10"
        >
          <p>This is ...</p>
        </Card>
        <div className="w-3/10 h-3/10">
          <img src={icon} className="rounded-3xl" preview />
        </div>
      </div>
    </>
  );
};

export default Root;
