import React from "react";

const SkillsCarousel = () => {
  const skills = [
    { name: "Web Development", icon: "/skills/web.png" },
    { name: "UI/UX Design", icon: "/skills/uiux.png" },
    { name: "Graphic Design", icon: "/skills/design.png" },
    { name: "Video Editing", icon: "/skills/video.png" },
    { name: "Content Writing", icon: "/skills/writing.png" },
    { name: "Digital Marketing", icon: "/skills/marketing.png" },
    { name: "Photography", icon: "/skills/photo.png" },
    { name: "Data Science", icon: "/skills/data.png" },
    { name: "SEO", icon: "/skills/seo.png" },
    { name: "Public Speaking", icon: "/skills/speak.png" },
    { name: "Cloud Computing", icon: "/skills/cloud.png" },
  ];

  const loopSkills = [...skills, ...skills]; // Duplicate for seamless loop

  return (
    <div className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 py-10 overflow-hidden">
      <h2 className="text-3xl text-center text-white font-bold mb-8">Explore Skills</h2>
      <div className="relative w-full overflow-hidden">
        <div
          className="flex gap-10 animate-slide whitespace-nowrap"
          style={{ animationDuration: "25s", animationIterationCount: "infinite" }}
        >
          {loopSkills.map((skill, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-md flex flex-col items-center text-white w-48 hover:scale-105 transition-transform duration-300"
            >
              <img src={skill.icon} alt={skill.name} className="w-16 h-16 mb-3" />
              <p className="text-md font-medium">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsCarousel;
