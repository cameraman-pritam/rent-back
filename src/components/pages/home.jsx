import React from "react";
import Root from "../structure/root";

const Home = () => {
  return (
    <>
      <Root />
      {/* Used standard slate-950 for that deep dark background */}
      <div className="min-h-screen bg-inherit text-white flex items-center justify-center p-6 md:p-12 overflow-hidden font-sans">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Column: Content */}
          <div className="flex flex-col items-start z-10 w-full">
            {/* Tag */}
            <div className="bg-slate-800/80 px-4 py-2 rounded-md mb-8">
              <span className="text-orange-400 text-xs font-bold tracking-widest uppercase">
                The Digital Commons
              </span>
            </div>

            {/* Headline - Standard classes text-7xl up to text-9xl for that massive hero look */}
            <h1 className="text-20xl md:text-8xl xl:text-9xl font-extrabold leading-none tracking-tight mb-8">
              Rent what you <span className="text-sky-400">need.</span>
              <br />
              Back what you <span className="text-orange-400">value.</span>
            </h1>

            {/* Paragraph */}
            <p className="text-slate-400 text-lg md:text-xl xl:text-2xl mb-12 max-w-lg leading-relaxed font-medium">
              A sophisticated marketplace for local sharing. High-end equipment,
              artisan tools, and community essentials—circulating for a
              sustainable future.
            </p>

            {/* Buttons - Using standard spacing and colors */}
            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
              <button className="bg-sky-400 text-slate-950 font-bold text-lg py-5 px-10 rounded-full border-2 border-dashed border-slate-900/50 hover:bg-sky-300 transition-colors w-full sm:w-auto flex justify-center items-center shadow-xl">
                Start Browsing
              </button>
              <button className="bg-slate-800 text-white font-bold text-lg py-5 px-10 rounded-full hover:bg-slate-700 transition-colors w-full sm:w-auto flex justify-center items-center shadow-xl">
                Our Mission
              </button>
            </div>
          </div>

          {/* Right Column: Visuals */}
          <div className="relative mt-20 lg:mt-0 flex justify-center lg:justify-end w-full">
            {/* Main Image Container */}
            <div className="relative w-full max-w-lg lg:max-w-xl aspect-square rounded-4xl overflow-hidden bg-emerald-800 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <img
                src="/path-to-your-green-sustainable-image.jpg"
                alt="Sustainable products"
                className="w-full h-full object-cover scale-105"
              />
            </div>

            {/* Floating Impact Card */}
            <div className="absolute -bottom-16 lg:-bottom-12 -left-4 lg:-left-12 bg-slate-800 p-6 lg:p-8 rounded-2xl shadow-2xl w-11/12 max-w-sm border border-slate-700 -rotate-2 hover:rotate-0 transition-transform duration-500 z-20">
              <div className="flex items-center gap-3 mb-4">
                {/* Leaf Icon SVG */}
                <svg
                  className="w-5 h-5 text-orange-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-orange-400 text-xs font-bold tracking-widest uppercase">
                  Sustainability Impact
                </span>
              </div>
              <p className="text-lg lg:text-xl text-slate-200 font-semibold leading-snug">
                1,240kg CO2 saved this month by our community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
