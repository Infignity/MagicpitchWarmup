"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import { IconContext } from "react-icons";
import { IoIosCloseCircle } from "react-icons/io";
import "swiper/css";
import "swiper/css/bundle";
import { useEffect, useState } from "react";
import { GetAnnouncementApi } from "@/app/api/announcement";
import { Announcements } from "@/app/types";

const data = [
  "Hi, there are some updates",
  "1. There is no update",
  "2. There are some updates",
];

const AdsBanner = () => {
  const [openAds, setOpenAds] = useState(true);
  const [announcements, setAnnouncements] = useState<Array<Announcements>>([]);

  const getAnnouncements = async () => {
    try {
      const res = await GetAnnouncementApi();
      setAnnouncements(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("announcement", announcements);

  useEffect(() => {
    getAnnouncements();

    return () => {
      getAnnouncements();
    };
  }, []);

  return (
    <>
      {openAds && announcements.length > 0 && (
        <Swiper
          className="w-full h-14 relative"
          slidesPerView={1}
          spaceBetween={1}
          loop
          modules={[EffectFade, Autoplay]}
          autoplay={{
            delay: 5000,
          }}
          effect="fade"
        >
          {announcements
            .filter((item) => item.priority === "high")
            .map((item, i) => (
              <SwiperSlide
                key={i}
                className="w-full h-full bg-gray-100 text-center py-4"
              >
                <p className="font-sans">{item.message}</p>
              </SwiperSlide>
            ))}
          {announcements
            .filter((item) => item.priority === "normal")
            .map((item, i) => (
              <SwiperSlide
                key={i}
                className="w-full h-full bg-gray-100 text-center py-4"
              >
                <p className="font-sans">{item.message}</p>
              </SwiperSlide>
            ))}
          <IoIosCloseCircle
            className="absolute top-1/2 -translate-y-1/2 right-5 z-30 text-blue w-6 h-6 cursor-pointer"
            onClick={() => setOpenAds(false)}
          />
        </Swiper>
      )}
    </>
  );
};

export default AdsBanner;
