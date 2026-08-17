import React, { useState } from 'react';
import { GameMode, Point } from '../types';
import { sound } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Eye,
  Zap,
  Gamepad2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface GameHUDProps {
  score: number;
  highScore: number;
  gameMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  speedMultiplier: number;
  onSpeedChange: (speed: number) => void;
  onDirectionInput: (dir: Point) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  highScore,
  gameMode,
  onModeChange,
  opacity,
  onOpacityChange,
  speedMultiplier,
  onSpeedChange,
  onDirectionInput,
  isMuted,
  onToggleMute,
}) => {
  const [showMobileDPad, setShowMobileDPad] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const togglePlayPause = () => {
    sound.playClick();
    if (gameMode === 'paused') {
      onModeChange('manual');
    } else {
      onModeChange('paused');
    }
  };

  const toggleAutoManual = () => {
    sound.playClick();
    if (gameMode === 'auto') {
      onModeChange('manual');
    } else {
      onModeChange('auto');
    }
  };

  const handleDPadPress = (dir: Point) => {
    sound.playClick();
    onDirectionInput(dir);
  };

  const cycleOpacity = () => {
    sound.playClick();
    if (opacity >= 0.85) onOpacityChange(0.35);
    else if (opacity <= 0.4) onOpacityChange(0.65);
    else onOpacityChange(0.85);
  };

  const cycleSpeed = () => {
    sound.playClick();
    if (speedMultiplier === 1) onSpeedChange(1.5);
    else if (speedMultiplier === 1.5) onSpeedChange(2.0);
    else onSpeedChange(1.0);
  };

  return (
    <>
      {/* Floating Retro HUD Container (Bottom-Right / Fixed on Viewport) */}
      <aside
        aria-label="Interactive Snake Game Controls and Scoreboard"
        className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2"
      >
        {/* Expanded Controls Panel */}
        {showSettings && (
          <div
            id="hud-settings-panel"
            className="pixel-card p-3 rounded-none mb-2 w-72 text-xs space-y-3 bg-[#DFD3C3]/95 shadow-[4px_4px_0px_#3C2A21]"
          >
            <div className="flex items-center justify-between border-b-2 border-[#8B5E3C] pb-2">
              <span className="font-pixel text-[10px] text-[#3C2A21] flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-[#8B5E3C]" /> SNAKE MINI-ENGINE
              </span>
              <button
                id="close-hud-settings-btn"
                onClick={() => {
                  sound.playClick();
                  setShowSettings(false);
                }}
                className="text-[#3C2A21] font-pixel text-[10px] hover:text-[#A04747]"
              >
                [X]
              </button>
            </div>

            {/* Mode Selector */}
            <div className="flex items-center justify-between">
              <span className="font-silkscreen text-[#3C2A21]">AI Mode:</span>
              <button
                id="toggle-auto-manual-btn"
                onClick={toggleAutoManual}
                className={`pixel-tag text-[10px] cursor-pointer transition-all ${
                  gameMode === 'auto'
                    ? 'bg-[#708238] text-white border-[#3C2A21]'
                    : 'bg-[#E0A96D] text-[#1E120B] border-[#3C2A21]'
                }`}
              >
                {gameMode === 'auto' ? '🤖 AUTO-ROAM' : '🎮 MANUAL'}
              </button>
            </div>

            {/* Background Canvas Opacity */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-silkscreen text-[#3C2A21]">
                <span>BG Opacity:</span>
                <span>{Math.round(opacity * 100)}%</span>
              </div>
              <div className="flex gap-1.5">
                {[0.25, 0.55, 0.85].map(val => (
                  <button
                    key={val}
                    id={`opacity-btn-${Math.round(val * 100)}`}
                    onClick={() => {
                      sound.playClick();
                      onOpacityChange(val);
                    }}
                    className={`flex-1 py-1 font-pixel text-[8px] border-2 border-[#3C2A21] ${
                      Math.abs(opacity - val) < 0.1
                        ? 'bg-[#A67B5B] text-white'
                        : 'bg-[#EFE3C8] text-[#3C2A21] hover:bg-[#DFD3C3]'
                    }`}
                  >
                    {val === 0.25 ? 'Low' : val === 0.55 ? 'Mid' : 'High'}
                  </button>
                ))}
              </div>
            </div>

            {/* Game Speed */}
            <div className="flex items-center justify-between">
              <span className="font-silkscreen text-[#3C2A21]">Game Speed:</span>
              <button
                id="cycle-speed-btn"
                onClick={cycleSpeed}
                className="pixel-tag text-[10px] cursor-pointer bg-[#EFE3C8] hover:bg-[#DFD3C3]"
              >
                <Zap className="w-3 h-3 text-[#E0A96D]" /> {speedMultiplier}x
              </button>
            </div>

            {/* Keyboard Guidance */}
            <div className="p-2 bg-[#EFE3C8] border border-[#8B5E3C] text-[10px] text-[#3C2A21] leading-relaxed font-mono">
              💡 <span className="font-bold">Protip:</span> Press <kbd className="bg-[#DFD3C3] px-1 border border-[#3C2A21]">WASD</kbd> or <kbd className="bg-[#DFD3C3] px-1 border border-[#3C2A21]">Arrow Keys</kbd> anytime to hijack the snake!
            </div>
          </div>
        )}

        {/* Primary Floating HUD Bar */}
        <div
          id="main-hud-bar"
          className="pixel-card flex items-center gap-2 p-1.5 bg-[#DFD3C3]/95 backdrop-blur-xs shadow-[4px_4px_0px_#3C2A21]"
        >
          {/* Score Display */}
          <div className="px-2 py-1 bg-[#1E120B] text-[#E0A96D] font-pixel text-[10px] flex items-center gap-2 border border-[#8B5E3C]">
            <span className="text-[#8BA848] animate-pulse">●</span>
            <span>SCORE: <strong className="text-white">{score}</strong></span>
            <span className="hidden sm:inline text-[#DFD3C3]/60">|</span>
            <span className="hidden sm:inline text-[#EFE3C8]/80 text-[8px]">HI: {highScore}</span>
          </div>

          {/* Mode Pill Badge */}
          <button
            id="hud-mode-pill-btn"
            onClick={toggleAutoManual}
            title="Click to toggle Auto / Manual Mode"
            className={`hidden md:inline-flex px-2 py-1 font-pixel text-[9px] border-2 border-[#3C2A21] cursor-pointer transition-transform active:translate-y-0.5 ${
              gameMode === 'auto'
                ? 'bg-[#708238] text-white'
                : gameMode === 'paused'
                ? 'bg-[#A04747] text-white'
                : 'bg-[#E0A96D] text-[#1E120B]'
            }`}
          >
            {gameMode === 'auto' ? 'AUTO' : gameMode === 'paused' ? 'PAUSED' : 'PLAYING'}
          </button>

          {/* Play/Pause Button */}
          <button
            id="hud-play-pause-btn"
            onClick={togglePlayPause}
            title={gameMode === 'paused' ? 'Resume Snake' : 'Pause Snake'}
            className="w-8 h-8 flex items-center justify-center bg-[#EFE3C8] hover:bg-[#E0A96D] text-[#3C2A21] border-2 border-[#3C2A21] active:translate-y-0.5"
          >
            {gameMode === 'paused' ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Audio Toggle */}
          <button
            id="hud-sound-toggle-btn"
            onClick={onToggleMute}
            title={isMuted ? 'Unmute 8-Bit Chiptune Sounds' : 'Mute Sounds'}
            className={`w-8 h-8 flex items-center justify-center border-2 border-[#3C2A21] active:translate-y-0.5 ${
              isMuted ? 'bg-[#DFD3C3] text-[#3C2A21]/50' : 'bg-[#708238] text-white'
            }`}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Opacity Quick Toggle */}
          <button
            id="hud-quick-opacity-btn"
            onClick={cycleOpacity}
            title={`Cycle Background Opacity (Currently ${Math.round(opacity * 100)}%)`}
            className="w-8 h-8 flex items-center justify-center bg-[#EFE3C8] hover:bg-[#E0A96D] text-[#3C2A21] border-2 border-[#3C2A21] active:translate-y-0.5"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Mobile D-Pad Toggle */}
          <button
            id="hud-mobile-dpad-toggle-btn"
            onClick={() => {
              sound.playClick();
              setShowMobileDPad(!showMobileDPad);
            }}
            title="Toggle On-screen D-Pad"
            className={`md:hidden w-8 h-8 flex items-center justify-center border-2 border-[#3C2A21] active:translate-y-0.5 ${
              showMobileDPad ? 'bg-[#A67B5B] text-white' : 'bg-[#EFE3C8] text-[#3C2A21]'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
          </button>

          {/* Settings Menu Toggle */}
          <button
            id="hud-settings-toggle-btn"
            onClick={() => {
              sound.playClick();
              setShowSettings(!showSettings);
            }}
            title="Snake Game Settings"
            className={`w-8 h-8 flex items-center justify-center border-2 border-[#3C2A21] active:translate-y-0.5 ${
              showSettings ? 'bg-[#A67B5B] text-white' : 'bg-[#EFE3C8] text-[#3C2A21]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Retro On-Screen D-Pad (Mobile / Touch Devices) */}
      {showMobileDPad && (
        <div
          id="mobile-dpad-overlay"
          className="fixed bottom-20 left-4 z-40 pixel-card p-3 bg-[#DFD3C3]/95 backdrop-blur-xs select-none shadow-[4px_4px_0px_#3C2A21]"
        >
          <div className="flex justify-between items-center mb-2 pb-1 border-b border-[#8B5E3C]">
            <span className="font-pixel text-[8px] text-[#3C2A21]">RETRO D-PAD</span>
            <button
              id="close-mobile-dpad-btn"
              onClick={() => setShowMobileDPad(false)}
              className="font-pixel text-[8px] text-[#A04747]"
            >
              [X]
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1 w-32 h-32 mx-auto">
            {/* Top Empty */}
            <div />
            {/* UP */}
            <button
              id="dpad-up-btn"
              onClick={() => handleDPadPress({ x: 0, y: -1 })}
              className="flex items-center justify-center bg-[#3C2A21] active:bg-[#1E120B] text-white border-2 border-[#1E120B] active:scale-95 transition-transform"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
            {/* Top Empty */}
            <div />

            {/* LEFT */}
            <button
              id="dpad-left-btn"
              onClick={() => handleDPadPress({ x: -1, y: 0 })}
              className="flex items-center justify-center bg-[#3C2A21] active:bg-[#1E120B] text-white border-2 border-[#1E120B] active:scale-95 transition-transform"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            {/* Center Pivot */}
            <div className="flex items-center justify-center bg-[#8B5E3C] border-2 border-[#3C2A21]">
              <span className="w-2 h-2 rounded-full bg-[#E0A96D]" />
            </div>
            {/* RIGHT */}
            <button
              id="dpad-right-btn"
              onClick={() => handleDPadPress({ x: 1, y: 0 })}
              className="flex items-center justify-center bg-[#3C2A21] active:bg-[#1E120B] text-white border-2 border-[#1E120B] active:scale-95 transition-transform"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Bottom Empty */}
            <div />
            {/* DOWN */}
            <button
              id="dpad-down-btn"
              onClick={() => handleDPadPress({ x: 0, y: 1 })}
              className="flex items-center justify-center bg-[#3C2A21] active:bg-[#1E120B] text-white border-2 border-[#1E120B] active:scale-95 transition-transform"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            {/* Bottom Empty */}
            <div />
          </div>
        </div>
      )}
    </>
  );
};
