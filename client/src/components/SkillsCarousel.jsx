import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import {
  Code2,
  PenTool,
  Paintbrush,
  Video,
  FileText,
  BarChart4,
  Camera,
  Database,
  Search,
  Mic2,
  Cloud,
} from "lucide-react";

// Skills array with icons
const skills = [
  { name: "Web Development", icon: <Code2 size={40} /> },
  { name: "UI/UX Design", icon: <PenTool size={40} /> },
  { name: "Graphic Design", icon: <Paintbrush size={40} /> },
  { name: "Video Editing", icon: <Video size={40} /> },
  { name: "Content Writing", icon: <FileText size={40} /> },
  { name: "Marketing", icon: <BarChart4 size={40} /> },
  { name: "Photography", icon: <Camera size={40} /> },
  { name: "Data Science", icon: <Database size={40} /> },
  { name: "SEO", icon: <Search size={40} /> },
  { name: "Public Speaking", icon: <Mic2 size={40} /> },
  { name: "Cloud Computing", icon: <Cloud size={40} /> },
];

export default function App() {
  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 py-16 px-4 flex flex-col items-center justify-center">
      {/* Section Heading */}
      <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-indigo-600 drop-shadow-sm">
        Explore Trending Skills
      </h2>

      {/* Skill Carousel */}
      <Swiper
        modules={[Autoplay]}
        spaceBetween={30}
        slidesPerView={3}
        loop={true}
        autoplay={{ delay: 2000 }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
        className="w-full max-w-6xl"
      >
        {skills.map((skill, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white border border-indigo-100 hover:border-indigo-600 text-gray-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg hover:shadow-indigo-200 transform hover:scale-105 transition-all duration-500 ease-in-out">
              <div className="mb-4 text-indigo-600">{skill.icon}</div>
              <p className="text-lg font-semibold">{skill.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
