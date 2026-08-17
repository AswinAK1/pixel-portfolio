import React from 'react';
import { PERSONAL_INFO, CHARACTER_STATS } from '../data/portfolioData';
import { PixelProfileAvatar } from './PixelProfileAvatar';
import { sound } from '../utils/audio';
import {
  User,
  Shield,
  Zap,
  Sparkles,
  Award,
  Scroll,
  Cpu,
  BookOpen,
  MapPin,
  CheckCircle,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#8B5E3C] text-white border-2 border-[#3C2A21] shadow-[2px_2px_0px_#3C2A21]">
          <Scroll className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-pixel text-lg sm:text-xl text-[#1E120B]">
            CHARACTER SHEET: {PERSONAL_INFO.fullName}
          </h2>
          <p className="font-silkscreen text-xs text-[#8B5E3C]">
            [CRAFTING DIGITAL EXPERIENCES • ABOUT ME &amp; TECH ATTRIBUTES]
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: RPG Character Bio Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="pixel-card p-6 shadow-[4px_4px_0px_#3C2A21]">
            <div className="flex items-center justify-between border-b-2 border-[#8B5E3C] pb-3 mb-4">
              <span className="font-pixel text-xs text-[#3C2A21] flex items-center gap-2">
                <User className="w-4 h-4 text-[#8B5E3C]" /> ADVENTURER PROFILE: {PERSONAL_INFO.title.toUpperCase()}
              </span>
              <span className="pixel-tag bg-[#708238] text-white text-[10px]">
                {PERSONAL_INFO.experienceYears} EXP
              </span>
            </div>

            {/* Profile Paragraphs */}
            <div className="space-y-3 mb-5">
              <p className="font-retro text-2xl text-[#3C2A21] leading-relaxed">
                {PERSONAL_INFO.aboutParagraph1}
              </p>
              <p className="font-retro text-2xl text-[#3C2A21] leading-relaxed">
                {PERSONAL_INFO.aboutParagraph2}
              </p>
            </div>

            {/* Guild & Specs Table */}
            <div className="p-3 bg-[#EFE3C8]/80 border-2 border-[#8B5E3C] space-y-2 text-xs font-mono mb-5">
              <div className="flex justify-between border-b border-[#D0B8A8] pb-1">
                <span className="font-bold text-[#8B5E3C]">Current Role:</span>
                <span className="text-[#3C2A21] font-semibold">Full Stack Developer @ Luzidcraft Business Solutions LLP</span>
              </div>
              <div className="flex justify-between border-b border-[#D0B8A8] pb-1">
                <span className="font-bold text-[#8B5E3C]">Core Stack:</span>
                <span className="text-[#3C2A21] font-semibold">MERN (MongoDB, Express, React, Node.js) + Nest.js &amp; Socket.IO</span>
              </div>
              <div className="flex justify-between border-b border-[#D0B8A8] pb-1">
                <span className="font-bold text-[#8B5E3C]">Training Guild:</span>
                <span className="text-[#3C2A21] font-semibold">LevelX Learning LLP (Full Stack MERN)</span>
              </div>
              <div className="flex justify-between border-b border-[#D0B8A8] pb-1">
                <span className="font-bold text-[#8B5E3C]">Education Quest:</span>
                <span className="text-[#3C2A21] font-semibold">MBA in Marketing (IGNOU, Ongoing)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-[#8B5E3C]">Status:</span>
                <span className="text-[#708238] font-bold">READY FOR SCALABLE WEB QUESTS</span>
              </div>
            </div>

            {/* Equipment / Loadout */}
            <div>
              <h3 className="font-pixel text-[11px] text-[#3C2A21] mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#A67B5B]" /> EQUIPPED GEAR &amp; WEAPONS
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-silkscreen">
                <div className="p-2.5 bg-[#EFE3C8]/85 border border-[#3C2A21]">
                  <div className="text-[#8B5E3C] text-[9px]">PRIMARY WEAPON</div>
                  <div className="font-bold text-[#3C2A21]">React + TypeScript + Redux</div>
                </div>
                <div className="p-2.5 bg-[#EFE3C8]/85 border border-[#3C2A21]">
                  <div className="text-[#8B5E3C] text-[9px]">BACKEND SORCERY</div>
                  <div className="font-bold text-[#3C2A21]">Node.js + Express + Nest.js</div>
                </div>
                <div className="p-2.5 bg-[#EFE3C8]/85 border border-[#3C2A21]">
                  <div className="text-[#8B5E3C] text-[9px]">REAL-TIME VAULT</div>
                  <div className="font-bold text-[#3C2A21]">Socket.IO + ZEGOCLOUD</div>
                </div>
                <div className="p-2.5 bg-[#EFE3C8]/85 border border-[#3C2A21]">
                  <div className="text-[#8B5E3C] text-[9px]">CLOUD &amp; DATABASE</div>
                  <div className="font-bold text-[#3C2A21]">MongoDB + AWS + Docker</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Character Attributes & Skill Bars */}
        <div className="lg:col-span-5 space-y-6">
          <div className="pixel-card p-6 shadow-[4px_4px_0px_#3C2A21]">
            <div className="flex items-center justify-between border-b-2 border-[#8B5E3C] pb-3 mb-4">
              <span className="font-pixel text-xs text-[#3C2A21] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#E0A96D]" /> ATTRIBUTE METRICS
              </span>
              <span className="font-silkscreen text-[10px] text-[#8B5E3C]">
                MAX CAP: 100
              </span>
            </div>

            <div className="space-y-4">
              {CHARACTER_STATS.map((stat) => (
                <div key={stat.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-silkscreen">
                    <span className="text-[#1E120B] font-bold">{stat.name}</span>
                    <span className="font-pixel text-[10px] text-[#8B5E3C]">
                      {stat.value} / 100
                    </span>
                  </div>

                  {/* 8-bit Stepped Progress Bar */}
                  <div className="h-4 bg-[#3C2A21] border-2 border-[#1E120B] p-0.5 relative overflow-hidden">
                    <div
                      className="h-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${stat.value}%`,
                        backgroundColor: stat.color,
                      }}
                    />
                    {/* Stepped notches overlay */}
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(0,0,0,0.35)_8px,rgba(0,0,0,0.35)_10px)]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Core Engineering Banner */}
            <div className="mt-6 p-4 bg-[#F7EFE5]/80 border-2 border-[#3C2A21]">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-[#708238] text-white border border-[#3C2A21] shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-pixel text-[11px] text-[#1E120B] mb-1">
                    CRAFTING DIGITAL EXPERIENCES
                  </h4>
                  <p className="font-retro text-lg text-[#3C2A21] leading-relaxed">
                    &ldquo;Specialized in building scalable and modern web applications with clean architecture and real-time functionality. Transforming complex ideas into efficient and user-friendly digital products.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
