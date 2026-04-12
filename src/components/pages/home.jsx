import React, { useState, useEffect, Suspense, lazy } from "react";
import Planter from "../../assets/nature.png";
import "primeicons/primeicons.css";
import { supabase } from "../../utils/supabase";
import { Skeleton } from "primereact/skeleton";
import { useNavigate } from "react-router-dom";

const Root = lazy(() => import("../structure/root"));
const Button = lazy(() =>
  import("primereact/button").then((module) => ({ default: module.Button }))
);
const Chip = lazy(() =>
  import("primereact/chip").then((module) => ({ default: module.Chip }))
);
const Image = lazy(() =>
  import("primereact/image").then((module) => ({ default: module.Image }))
);
const Divider = lazy(() =>
  import("primereact/divider").then((module) => ({ default: module.Divider }))
);
const Chart = lazy(() =>
  import("primereact/chart").then((module) => ({ default: module.Chart }))
);

const HomeSkeleton = () => (
  <div className="min-h-screen bg-inherit p-6 md:p-12 w-full flex flex-col items-center">
    <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
      <div className="flex flex-col gap-6 w-full">
        <Skeleton width="12rem" height="2rem" borderRadius="16px" />
        <Skeleton width="100%" height="8rem" />
        <Skeleton width="80%" height="4rem" />
        <div className="flex gap-4">
          <Skeleton width="12rem" height="4rem" borderRadius="2rem" />
          <Skeleton width="12rem" height="4rem" borderRadius="2rem" />
        </div>
      </div>
      <div className="w-full">
        <Skeleton width="100%" height="30rem" borderRadius="2rem" />
      </div>
    </div>
  </div>
);

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndProcessUsers = async () => {
      try {
        const { data: users, error } = await supabase.from("users").select("*");

        if (error) throw error;

        const monthCounts = new Array(12).fill(0);

        if (users) {
          users.forEach((userData) => {
            if (userData.createdAt) {
              const date = new Date(userData.createdAt);

              if (!isNaN(date)) {
                const month = date.getMonth();
                monthCounts[month] += 1;
              }
            }
          });
        }

        const data = {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "New Users",
              data: monthCounts,
              fill: true,
              borderColor: "#38bdf8",
              backgroundColor: "rgba(56, 189, 248, 0.2)",
              tension: 0.2,
              pointBackgroundColor: "#fb923c",
              pointBorderColor: "#0f172a",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#fb923c",
            },
          ],
        };

        const options = {
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
            legend: {
              labels: {
                color: "#94a3b8",
              },
            },
          },
          scales: {
            x: {
              ticks: { color: "#94a3b8" },
              grid: { color: "rgba(51, 65, 85, 0.5)" },
            },
            y: {
              ticks: { color: "#94a3b8" },
              grid: { color: "rgba(51, 65, 85, 0.5)" },
            },
          },
        };

        setChartData(data);
        setChartOptions(options);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchAndProcessUsers();
  }, []);

  return (
    <Suspense fallback={<HomeSkeleton />}>
      <Root />
      <div className="min-h-screen bg-inherit text-white flex items-center justify-center p-6 md:p-12 overflow-hidden font-sans">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="flex flex-col items-start z-10 w-full">
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

            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
              <Button
                label="Start Browsing"
                icon="pi pi-arrow-right"
                iconPos="right"
                className="bg-sky-400 text-slate-950 font-bold text-lg py-5 px-10 rounded-full border-2 border-dashed border-slate-900/50 hover:bg-sky-300 transition-colors w-full sm:w-auto flex justify-center items-center shadow-xl gap-2"
                onClick={() => navigate("/browse")}
              />
              <Button
                label="Our Mission"
                className="bg-slate-800 text-white font-bold text-lg py-5 px-10 rounded-full hover:bg-slate-700 transition-colors w-full sm:w-auto flex justify-center items-center shadow-xl border-none"
                onClick={() => navigate("/about")}
              />
            </div>
          </div>

          <div className="relative mt-20 lg:mt-0 flex justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-lg lg:max-w-xl aspect-square rounded-4xl overflow-hidden bg-emerald-800 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <Image
                src={Planter}
                alt="Sustainable products"
                imageClassName="w-full h-full object-cover scale-105"
              />
            </div>

            <div className="absolute -bottom-16 lg:-bottom-12 -left-4 lg:-left-12 bg-slate-800 p-6 lg:p-8 rounded-2xl shadow-2xl w-11/12 max-w-sm border border-slate-700 -rotate-2 hover:rotate-0 transition-transform duration-500 z-20">
              <div className="flex items-center gap-3 mb-4">
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
      <div className="bg-inherit">
        <p className="text-3xl">Circular Living Made Simple</p>
        <p className="text-gray-400">
          Smoother Renting process, at your Fingertips.
        </p>
        <br />
        <div className="w-full max-w-4xl mx-auto p-6 bg-inherit rounded-3xl border border-slate-800 shadow-2xl font-sans">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              User Growth
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              New signups over the last 12 months
            </p>
          </div>

          <div className="relative h-100 w-full">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton width="100%" height="100%" borderRadius="16px" />
              </div>
            ) : (
              <Chart
                type="line"
                data={chartData}
                options={chartOptions}
                className="h-full w-full"
              />
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Home;
