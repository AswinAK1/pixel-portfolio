/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { GameMode, Point } from './types';
import { sound } from './utils/audio';
import { BackgroundSnakeGame } from './components/BackgroundSnakeGame';
import { GameHUD } from './components/GameHUD';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { SkillsArsenal } from './components/SkillsArsenal';
import { ProjectsQuestLog } from './components/ProjectsQuestLog';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { ContactTerminal } from './components/ContactTerminal';
import { Footer } from './components/Footer';

export default function App() {
  // Mini-Game State
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [gameMode, setGameMode] = useState<GameMode>('auto');
  const [bgOpacity, setBgOpacity] = useState<number>(0.85);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getIsMuted());
  const [manualDirectionRequest, setManualDirectionRequest] = useState<Point | null>(null);

  const handleScoreUpdate = useCallback((newScore: number, newHighScore: number) => {
    setScore(newScore);
    setHighScore(newHighScore);
  }, []);

  const handleToggleMute = useCallback(() => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  const handleDirectionInput = useCallback((dir: Point) => {
    setManualDirectionRequest(dir);
  }, []);

  const handleClearDirectionRequest = useCallback(() => {
    setManualDirectionRequest(null);
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Secret cheat codes
  const handleApplyCheatCode = (code: string) => {
    if (code === 'SPEED') {
      setSpeedMultiplier(2.0);
    } else if (code === 'GOLD' || code === 'COIN') {
      setScore(prev => prev + 500);
      setHighScore(prev => Math.max(prev, score + 500));
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-x-hidden">
      
      {/* 1. Interactive Background Snake Mini-Game Canvas */}
      <BackgroundSnakeGame
        opacity={bgOpacity}
        gameMode={gameMode}
        onScoreUpdate={handleScoreUpdate}
        onModeChange={setGameMode}
        speedMultiplier={speedMultiplier}
        manualDirectionRequest={manualDirectionRequest}
        onClearDirectionRequest={handleClearDirectionRequest}
      />

      {/* 2. Subtle Retro CRT Scanline Texture */}
      <div className="fixed inset-0 pointer-events-none z-10 scanlines-subtle opacity-40" />

      {/* 3. Main Portfolio Layout Content (Z-Index above canvas) */}
      <div className="relative z-20 flex-1 flex flex-col">
        
        {/* Navigation Bar */}
        <Navbar
          score={score}
          gameMode={gameMode}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onSelectSection={handleNavigate}
        />

        {/* Main Content Sections */}
        <main className="flex-1 space-y-12 sm:space-y-16">
          <Hero
            gameMode={gameMode}
            onModeChange={setGameMode}
            onNavigate={handleNavigate}
          />

          <AboutSection />

          <SkillsArsenal />

          <ProjectsQuestLog />

          <ExperienceTimeline />

          <ContactTerminal onApplyCheatCode={handleApplyCheatCode} />
        </main>

        {/* Footer */}
        <Footer score={score} highScore={highScore} />
      </div>

      {/* 4. Floating Retro Game HUD & Mobile D-Pad */}
      <GameHUD
        score={score}
        highScore={highScore}
        gameMode={gameMode}
        onModeChange={setGameMode}
        opacity={bgOpacity}
        onOpacityChange={setBgOpacity}
        speedMultiplier={speedMultiplier}
        onSpeedChange={setSpeedMultiplier}
        onDirectionInput={handleDirectionInput}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

    </div>
  );
}
