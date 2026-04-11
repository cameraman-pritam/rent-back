import React from "react";
import Root from "../structure/root";
// PrimeReact Imports
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Image } from "primereact/image";
import Planter from "../../assets/nature.png";
// Make sure to import PrimeIcons in your main app file if you haven't!
import "primeicons/primeicons.css";
import { Divider } from "primereact/divider";

const Home = () => {
  return (
    <>
      <Root />
      <div className="min-h-screen bg-inherit text-white flex items-center justify-center p-6 md:p-12 overflow-hidden font-sans">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Column: Content */}
          <div className="flex flex-col items-start z-10 w-full">
            {/* Swapped raw div for a PrimeReact Chip */}
            <Chip
              label="The Digital Commons"
              className="bg-slate-800/80 text-orange-400 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-md mb-8 border-none"
            />

            <p className="text-5xl md:text-6xl xl:text-7xl font-extrabold leading-none tracking-tight mb-8">
              Rent what you <span className="text-sky-400">need.</span>
              <br />
              Back what you <span className="text-orange-400">value.</span>
            </p>

            <p className="text-slate-400 text-lg md:text-xl xl:text-2xl mb-12 max-w-lg leading-relaxed font-medium">
              A sophisticated marketplace for local sharing. High-end equipment,
              artisan tools, and community essentials—circulating for a
              sustainable future.
            </p>

            {/* Swapped raw buttons for PrimeReact Buttons for those clean ripple effects */}
            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
              <Button
                label="Start Browsing"
                icon="pi pi-arrow-right"
                iconPos="right"
                className="bg-sky-400 text-slate-950 font-bold text-lg py-5 px-10 rounded-full border-2 border-dashed border-slate-900/50 hover:bg-sky-300 transition-colors w-full sm:w-auto flex justify-center items-center shadow-xl gap-2"
              />
              <Button
                label="Our Mission"
                className="bg-slate-800 text-white font-bold text-lg py-5 px-10 rounded-full hover:bg-slate-700 transition-colors w-full sm:w-auto flex justify-center items-center shadow-xl border-none"
              />
            </div>
          </div>

          {/* Right Column: Visuals */}
          <div className="relative mt-20 lg:mt-0 flex justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-lg lg:max-w-xl aspect-square rounded-4xl overflow-hidden bg-emerald-800 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              {/* PrimeReact Image component with the 'preview' prop enabled */}
              <Image
                src={Planter}
                alt="Sustainable products"
                imageClassName="w-full h-full object-cover scale-105"
              />
            </div>

            <div className="absolute -bottom-16 lg:-bottom-12 -left-4 lg:-left-12 bg-slate-800 p-6 lg:p-8 rounded-2xl shadow-2xl w-11/12 max-w-sm border border-slate-700 -rotate-2 hover:rotate-0 transition-transform duration-500 z-20">
              <div className="flex items-center gap-3 mb-4">
                {/* Replaced the giant SVG with a clean PrimeIcon */}
                <i className="pi pi-verified text-orange-400 text-xl"></i>
                <span className="text-orange-400 text-xs font-bold tracking-widest uppercase">
                  Sustainability Impact
                </span>
              </div>
              <p className="text-lg lg:text-xl text-slate-200 font-semibold leading-snug">
                1,240kg CO2 saved this month by our community.
              </p>
              <br />
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div className="bg-[#171c24] rounded-3xl">
        <p className="text-3xl">Circular Living Made Simple</p>
        <p className="text-gray-400">
          Smoother Renting process, at your Fingertips.
        </p>
      </div>
    </>
  );
};

export default Home;
