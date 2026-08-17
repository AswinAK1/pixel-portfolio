import React from 'react';
import { EXPERIENCE_QUESTS } from '../data/portfolioData';
import { Award, Compass, Shield, Gift, CheckCircle, Briefcase } from 'lucide-react';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#8B5E3C] text-white border-2 border-[#3C2A21] shadow-[2px_2px_0px_#3C2A21]">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-pixel text-lg sm:text-xl text-[#1E120B]">
            WORK EXPERIENCE &amp; EXP LOG
          </h2>
          <p className="font-silkscreen text-xs text-[#8B5E3C]">
            [CAREER MILESTONES • COMMERCIAL MERN CLIENT PROJECTS &amp; GUILDS]
          </p>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 sm:pl-8 border-l-4 border-[#8B5E3C] space-y-8 ml-3">
        {EXPERIENCE_QUESTS.map((exp, index) => (
          <div key={index} className="relative group">
            
            {/* 8-Bit Stepped Node Marker */}
            <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 bg-[#E0A96D] border-3 border-[#3C2A21] shadow-[2px_2px_0px_#3C2A21] flex items-center justify-center font-pixel text-[9px] text-[#1E120B] group-hover:scale-110 transition-transform">
              {index + 1}
            </div>

            {/* Experience Card */}
            <div className="pixel-card p-6 shadow-[4px_4px_0px_#3C2A21]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#8B5E3C] pb-2.5 mb-3.5">
                <div>
                  <span className="font-pixel text-[9px] bg-[#3C2A21] text-white px-2 py-0.5 inline-block mb-1">
                    {exp.period}
                  </span>
                  <h3 className="font-pixel text-base text-[#1E120B]">
                    {exp.role}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="pixel-tag text-[9px] bg-[#708238] text-white">
                    {exp.rankBadge}
                  </span>
                  <div className="font-silkscreen text-[11px] text-[#8B5E3C] font-semibold mt-1">
                    {exp.guild} • {exp.location}
                  </div>
                </div>
              </div>

              {/* Quest Accomplishments */}
              <ul className="space-y-2 mb-4 font-retro text-2xl text-[#3C2A21] leading-relaxed">
                {exp.questDescription.map((desc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#8B5E3C] font-bold">►</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>

              {/* Unlocked Loot / Skills */}
              <div className="p-3 bg-[#EFE3C8]/80 border border-[#8B5E3C] flex flex-wrap items-center gap-2 text-xs">
                <span className="font-pixel text-[8px] text-[#8B5E3C] flex items-center gap-1">
                  <Gift className="w-3 h-3 text-[#A04747]" /> KEY ACHIEVEMENTS &amp; TECH:
                </span>
                {exp.unlockedLoot.map((loot, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-[#F7EFE5] border border-[#3C2A21] font-silkscreen text-[9px] text-[#1E120B] font-semibold"
                  >
                    ★ {loot}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};
