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
      <Card title={header}>
        <p>
          Rent Back is a shopping experience for the new generation. Everytime
          you need a thing like a ladder, a drill or maybe a book yk you are not
          gonna use again, or maybe you really want a guitar after you came to a
          new locality for vacations? RentBack got you covered.
        </p>
        <p>
          It is a revolutionary idea that utilises the usual economy of
          borrowing, selling, reselling or maybe simple "I dont need it
          anymore". It is useful, because people can put items for rent, so that
          people can keep utilising the same object.
        </p>
      </Card>
    </>
  );
};

export default About;
