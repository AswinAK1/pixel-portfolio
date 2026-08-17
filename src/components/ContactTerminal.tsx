import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sound } from '../utils/audio';
import {
  Mail,
  Send,
  Terminal,
  Copy,
  Check,
  Github,
  Linkedin,
  Sparkles,
  MessageSquare,
  Key,
} from 'lucide-react';

interface ContactTerminalProps {
  onApplyCheatCode?: (code: string) => void;
}

export const ContactTerminal: React.FC<ContactTerminalProps> = ({ onApplyCheatCode }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [copied, setCopied] = useState(false);
  const [sentStatus, setSentStatus] = useState<string | null>(null);
  const [cheatInput, setCheatInput] = useState('');
  const [cheatFeedback, setCheatFeedback] = useState<string | null>(null);

  const handleCopyEmail = () => {
    sound.playSpecialEat();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    sound.playLevelUp();
    setSentStatus('QUEST TRANSMISSION RECEIVED! ASWIN WILL CONTACT YOU SOON.');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSentStatus(null), 6000);
  };

  const handleCheatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = cheatInput.trim().toUpperCase();
    if (!code) return;

    sound.playSpecialEat();
    if (code === 'SPEED') {
      setCheatFeedback('⚡ HYPER SPEED UNLOCKED!');
    } else if (code === 'GOLD' || code === 'COIN') {
      setCheatFeedback('💰 +500 BONUS POINTS CONJURED!');
    } else if (code === 'GODMODE') {
      setCheatFeedback('🛡️ GODMODE ENGAGED: UNBREAKABLE SNAKE!');
    } else {
      setCheatFeedback(`✨ SECRET RUNIC SEAL "${code}" ACTIVATED!`);
    }

    if (onApplyCheatCode) {
      onApplyCheatCode(code);
    }
    setCheatInput('');
    setTimeout(() => setCheatFeedback(null), 4000);
  };

  return (
    <section id="contact" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#E0A96D] text-[#1E120B] border-2 border-[#3C2A21] shadow-[2px_2px_0px_#3C2A21]">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-pixel text-lg sm:text-xl text-[#1E120B]">
            GUILD TAVERN &amp; TRANSMISSION
          </h2>
          <p className="font-silkscreen text-xs text-[#8B5E3C]">
            [DISPATCH QUEST CONTRACTS OR SEND MESSAGES TO ASWIN]
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Message Dispatch Form */}
        <div className="lg:col-span-7">
          <div className="pixel-card p-6 bg-[#DFD3C3]/95 shadow-[4px_4px_0px_#3C2A21]">
            <div className="border-b-2 border-[#8B5E3C] pb-2 mb-4 flex items-center justify-between">
              <span className="font-pixel text-xs text-[#3C2A21] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#8B5E3C]" /> QUEST BRIEF DISPATCH
              </span>
              <span className="font-silkscreen text-[10px] text-[#708238]">
                SECURE 8-BIT CIPHER
              </span>
            </div>

            {sentStatus && (
              <div className="mb-4 p-3 bg-[#708238] text-white border-2 border-[#3C2A21] font-pixel text-[10px] animate-pulse">
                {sentStatus}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block font-pixel text-[10px] text-[#3C2A21] mb-1">
                  YOUR CHARACTER / RECRUITER NAME:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Vance / Tech Guild Lead"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-[#F7EFE5] border-2 border-[#3C2A21] text-sm text-[#1E120B] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] font-mono shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)]"
                />
              </div>

              <div>
                <label className="block font-pixel text-[10px] text-[#3C2A21] mb-1">
                  YOUR TRANSMISSION FREQUENCY (EMAIL):
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. recruiter@stellarcompany.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-[#F7EFE5] border-2 border-[#3C2A21] text-sm text-[#1E120B] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] font-mono shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)]"
                />
              </div>

              <div>
                <label className="block font-pixel text-[10px] text-[#3C2A21] mb-1">
                  QUEST OBJECTIVE / PROJECT SCOPE:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail your requirements, full-stack needs, contract opportunities, or simply say hello..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-2.5 bg-[#F7EFE5] border-2 border-[#3C2A21] text-sm text-[#1E120B] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] font-mono shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)] resize-none"
                />
              </div>

              <button
                type="submit"
                id="submit-contact-form-btn"
                className="pixel-btn pixel-btn-primary w-full py-3 text-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                DISPATCH QUEST SCROLL
              </button>
            </form>
          </div>
        </div>

        {/* Right: Direct Channels & Retro Easter Egg Console */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Direct Guild Contact Card */}
          <div className="pixel-card p-6 bg-[#EFE3C8]/95 shadow-[4px_4px_0px_#3C2A21]">
            <div className="border-b-2 border-[#8B5E3C] pb-2 mb-3">
              <span className="font-pixel text-xs text-[#3C2A21]">
                DIRECT TRANSMISSION BEACONS
              </span>
            </div>

            <div className="space-y-3">
              {/* Email 1-Click Copy */}
              <div className="p-3 bg-[#F7EFE5] border-2 border-[#3C2A21]">
                <div className="font-pixel text-[9px] text-[#8B5E3C] mb-1">
                  OFFICIAL EMAIL INBOX:
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm text-[#1E120B] font-bold truncate">
                    {PERSONAL_INFO.email}
                  </span>
                  <button
                    id="copy-email-btn"
                    onClick={handleCopyEmail}
                    title="Copy Email Address"
                    className="pixel-btn text-[9px] px-2 py-1 flex items-center gap-1 shrink-0"
                  >
                    {copied ? <Check className="w-3 h-3 text-[#708238]" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
              </div>

              {/* Social Channels */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playClick()}
                  className="p-2.5 bg-[#DFD3C3] hover:bg-[#D0B8A8] border-2 border-[#3C2A21] flex items-center gap-2 font-pixel text-[10px] text-[#1E120B]"
                >
                  <Github className="w-4 h-4" />
                  GITHUB
                </a>

                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playClick()}
                  className="p-2.5 bg-[#DFD3C3] hover:bg-[#D0B8A8] border-2 border-[#3C2A21] flex items-center gap-2 font-pixel text-[10px] text-[#1E120B]"
                >
                  <Linkedin className="w-4 h-4 text-[#8B5E3C]" />
                  LINKEDIN
                </a>
              </div>
            </div>
          </div>

          {/* Secret Easter Egg Terminal */}
          <div className="pixel-card p-5 bg-[#1E120B] text-white shadow-[4px_4px_0px_#3C2A21]">
            <div className="flex items-center justify-between border-b border-[#3C2A21] pb-2 mb-3">
              <span className="font-pixel text-[10px] text-[#E0A96D] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#708238]" /> SECRET CHEAT CONSOLE
              </span>
              <span className="font-silkscreen text-[9px] text-[#8BA848]">
                v1.0.4
              </span>
            </div>

            <p className="font-mono text-xs text-[#DFD3C3]/80 mb-2">
              Try typing <span className="text-[#E0A96D]">SPEED</span>, <span className="text-[#E0A96D]">GOLD</span>, or <span className="text-[#E0A96D]">GODMODE</span> below:
            </p>

            {cheatFeedback && (
              <div className="mb-2 p-1.5 bg-[#708238] text-white font-pixel text-[9px] text-center border border-white">
                {cheatFeedback}
              </div>
            )}

            <form onSubmit={handleCheatSubmit} className="flex gap-1.5">
              <input
                type="text"
                value={cheatInput}
                onChange={(e) => setCheatInput(e.target.value)}
                placeholder="ENTER RUNIC CODE..."
                className="flex-1 px-2 py-1 bg-[#3C2A21] border border-[#8B5E3C] text-xs font-mono text-[#E0A96D] uppercase focus:outline-none placeholder:text-[#DFD3C3]/40"
              />
              <button
                type="submit"
                id="submit-cheat-code-btn"
                className="px-2.5 py-1 bg-[#8B5E3C] hover:bg-[#A67B5B] font-pixel text-[9px] text-white border border-[#3C2A21]"
              >
                EXEC
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
