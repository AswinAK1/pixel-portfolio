import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sound } from '../utils/audio';
import { GameMode } from '../types';
import { PixelProfileAvatar } from './PixelProfileAvatar';
import {
  Gamepad2,
  Sword,
  Sparkles,
  Mail,
  ArrowRight,
  Shield,
  Heart,
  Zap,
  Terminal,
  MapPin,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface HeroProps {
  gameMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ gameMode, onModeChange, onNavigate }) => {
  const [dialogText, setDialogText] = useState('');
  const fullText =
    "Greetings! I'm Aswin AK — a Full Stack Developer specializing in the MERN stack. I build scalable applications with clean architecture, real-time WebSockets, and seamless user experiences.";

  // Retro Typewriter Dialogue Effect
  useEffect(() => {
    let index = 0;
    setDialogText('');
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDialogText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 25);
    return () => clearInterval(timer);
  }, []);

  const handleTakeControl = () => {
    sound.playClick();
    onModeChange('manual');
  };

  return (
    <section id="hero" className="relative pt-6 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top RPG Player Stat HUD Ribbon */}
      <div className="pixel-card-subtle mb-6 p-2 sm:p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Class & Level */}
          <div className="flex items-center gap-1.5 font-silkscreen text-[#3C2A21]">
            <Sparkles className="w-3.5 h-3.5 text-[#A67B5B]" />
            <span>CLASS: <strong>{PERSONAL_INFO.class}</strong> (LVL {PERSONAL_INFO.level})</span>
          </div>

          {/* HP Bar */}
          <div className="flex items-center gap-1.5 font-silkscreen text-[#3C2A21]">
            <Heart className="w-3.5 h-3.5 text-[#A04747] fill-current" />
            <span>HP:</span>
            <div className="w-20 sm:w-28 h-3 bg-[#3C2A21] border border-[#1E120B] p-0.5">
              <div className="h-full bg-[#A04747] w-full" />
            </div>
          </div>

          {/* MP Bar */}
          <div className="flex items-center gap-1.5 font-silkscreen text-[#3C2A21]">
            <Zap className="w-3.5 h-3.5 text-[#708238] fill-current" />
            <span>MP:</span>
            <div className="w-20 sm:w-28 h-3 bg-[#3C2A21] border border-[#1E120B] p-0.5">
              <div className="h-full bg-[#708238] w-full" />
            </div>
          </div>
        </div>

        {/* Location / Status */}
        <div className="flex items-center gap-2 font-silkscreen text-[11px] text-[#8B5E3C]">
          <MapPin className="w-3.5 h-3.5 text-[#8B5E3C]" />
          <span>{PERSONAL_INFO.location} • READY FOR QUESTS</span>
        </div>
      </div>

      {/* Hero Main Translucent Card */}
      <div className="pixel-card p-6 sm:p-8 md:p-10 shadow-[6px_6px_0px_#3C2A21]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Pixel Avatar & Profile Controls */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
            
            {/* Custom Pixel Profile Avatar (Based on User's Sitting Photo) */}
            <div className="mb-4">
              <PixelProfileAvatar size="lg" />
            </div>

            {/* Status Pill */}
            <div className="font-silkscreen text-[10px] text-[#3C2A21] mb-3 flex items-center justify-center gap-1.5 px-3 py-1 bg-[#EFE3C8]/90 border-2 border-[#8B5E3C]">
              <span className="w-2 h-2 rounded-full bg-[#708238] animate-ping" />
              <span>ACTIVE IN PRODUCTION • 1+ YRS EXP</span>
            </div>

            {/* Quick Game Mode Switcher Button */}
            <button
              id="hero-play-snake-btn"
              onClick={handleTakeControl}
              className="pixel-btn pixel-btn-green w-full max-w-xs text-[10px] flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              {gameMode === 'manual' ? 'SNAKE ACTIVE [WASD]' : 'TAKE CONTROL OF SNAKE'}
            </button>
          </div>

          {/* Right Column: Title, Dialogue, Tech Stack & CTAs */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Role & Headline */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EFE3C8]/90 border-2 border-[#8B5E3C] font-silkscreen text-[11px] text-[#8B5E3C] mb-2">
                <Flame className="w-3.5 h-3.5 text-[#A04747]" />
                {PERSONAL_INFO.headline}
              </div>

              <h1 className="font-pixel text-2xl sm:text-3xl lg:text-4xl text-[#1E120B] leading-snug tracking-tight mb-1.5">
                HI, I'M <span className="text-[#A67B5B]">{PERSONAL_INFO.name}</span>
              </h1>

              <p className="font-silkscreen text-sm sm:text-base text-[#8B5E3C] font-semibold">
                FULL STACK DEVELOPER • MERN STACK • REAL-TIME APPS
              </p>
            </div>

            {/* 8-Bit RPG Dialogue Box with Typing Effect */}
            <div className="relative bg-[#F7EFE5]/85 border-3 border-[#3C2A21] p-4 shadow-[4px_4px_0px_#3C2A21]">
              <div className="absolute -top-3 left-4 bg-[#8B5E3C] text-white px-2 py-0.5 font-pixel text-[9px] border border-[#3C2A21]">
                MESSAGE FROM ASWIN
              </div>
              <p className="font-retro text-xl sm:text-2xl text-[#3C2A21] leading-relaxed min-h-[60px] select-text">
                &ldquo;{dialogText}&rdquo;
                <span className="inline-block w-2.5 h-4 bg-[#3C2A21] ml-1 animate-pixel-blink" />
              </p>
            </div>

            {/* Core Tech Stack Pills */}
            <div className="space-y-1.5">
              <div className="font-pixel text-[10px] text-[#8B5E3C]">
                CORE WEAPONS &amp; FRAMEWORKS:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PERSONAL_INFO.coreTechnologies.map(tech => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 bg-[#EFE3C8]/90 border border-[#8B5E3C] font-silkscreen text-[10px] text-[#1E120B] font-bold shadow-[1px_1px_0px_#3C2A21]"
                  >
                    ★ {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Stat Tags */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2 bg-[#EFE3C8]/85 border-2 border-[#8B5E3C] text-center">
                <div className="font-pixel text-base text-[#A04747]">1+ YR</div>
                <div className="font-silkscreen text-[9px] text-[#3C2A21]">INDUSTRY XP</div>
              </div>
              <div className="p-2 bg-[#EFE3C8]/85 border-2 border-[#8B5E3C] text-center">
                <div className="font-pixel text-base text-[#708238]">4+</div>
                <div className="font-silkscreen text-[9px] text-[#3C2A21]">CORE PRODUCTION APPS</div>
              </div>
              <div className="p-2 bg-[#EFE3C8]/85 border-2 border-[#8B5E3C] text-center">
                <div className="font-pixel text-base text-[#E0A96D]">100%</div>
                <div className="font-silkscreen text-[9px] text-[#3C2A21]">CLEAN ARCHITECTURE</div>
              </div>
              <div className="p-2 bg-[#EFE3C8]/85 border-2 border-[#8B5E3C] text-center">
                <div className="font-pixel text-base text-[#8B5E3C]">⚡ REAL-TIME</div>
                <div className="font-silkscreen text-[9px] text-[#3C2A21]">SOCKET.IO &amp; AWS</div>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-view-quests-btn"
                onClick={() => {
                  sound.playClick();
                  onNavigate('projects');
                }}
                className="pixel-btn pixel-btn-primary flex items-center gap-2"
              >
                <Sword className="w-4 h-4" />
                EXPLORE MY PROJECTS
              </button>

              <button
                id="hero-contact-btn"
                onClick={() => {
                  sound.playClick();
                  onNavigate('contact');
                }}
                className="pixel-btn pixel-btn-gold flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                LET'S WORK TOGETHER
              </button>

              <button
                id="hero-view-skills-btn"
                onClick={() => {
                  sound.playClick();
                  onNavigate('skills');
                }}
                className="pixel-btn flex items-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                SKILLS &amp; ARSENAL
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
