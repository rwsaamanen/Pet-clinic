import React, { useEffect, useState } from "react";
import MarQuee from "react-fast-marquee";

// Testikuvia

const rowOneImages = [
  {
    url: "https://pixner.net/aikeu/assets/images/banner/large-slider/one.png",
  },
  {
    url: "https://pixner.net/aikeu/assets/images/banner/large-slider/two.png",
  },
  {
    url: "https://pixner.net/aikeu/assets/images/banner/large-slider/three.png",
  },
  {
    url: "https://pixner.net/aikeu/assets/images/banner/large-slider/four.png",
  },
  {
    url: "https://pixner.net/aikeu/assets/images/banner/large-slider/five.png",
  },
];

const rowTwoImages = [
  {
    url: "https://pixner.net/aikeu/assets/images/banner/small-slider/one.png",
  },
  {
    url: "https://pixner.net/aikeu/assets/images/banner/small-slider/two.png",
  },
  {
    url: "https://pixner.net/aikeu/assets/images/banner/small-slider/three.png",
  },
  {
    url: "https://pixner.net/aikeu/assets/images/banner/small-slider/four.png",
  },
  {
    url: "https://pixner.net/aikeu/assets/images/banner/small-slider/five.png",
  },
];

const Dashboard = () => {
  const [mounted, setmounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      setmounted(true);
    }
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div>
        <div className="flex items-center justify-center w-full h-screen">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl py-5 xl:text-7xl 2xl:text-8xl font-[700] text-center xl:leading-[80px] 2xl:leading-[100px]">
              Welcome USER NAME
            </h1>
            <div className="wrapper bg-secondary dark:bg-background border shadow-2xl shadow-neutral-600 rounded-md">
              <MarQuee pauseOnHover={true}>
                {rowOneImages.map((i, index) => (
                  <img
                    src={i.url}
                    key={index}
                    alt=""
                    className="md:m-4 w-[150px] m-2 md:w-[300px] rounded-[20px] shadow-md shadow-neutral-800"
                    width={250}
                    height={150}
                  />
                ))}
              </MarQuee>
              <MarQuee direction='right' pauseOnHover={true}>
                {rowTwoImages.map((i, index) => (
                  <img
                    src={i.url}
                    key={index}
                    alt=""
                    className="md:m-4 w-[150px] m-2 md:w-[300px] rounded-[20px] shadow-md shadow-neutral-800"
                    width={250}
                    height={150}
                  />
                ))}
              </MarQuee>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;