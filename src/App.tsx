/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Play, 
  Pause, 
  Plus, 
  Search, 
  Settings as SettingsIcon, 
  Video, 
  LayoutDashboard, 
  Sparkles, 
  Download, 
  Edit3, 
  CheckCircle, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  Link, 
  Volume2, 
  Maximize2, 
  FileText, 
  Trash2, 
  Camera, 
  ShieldCheck, 
  Zap, 
  History, 
  Eye, 
  Sliders, 
  Folder,
  Circle,
  HelpCircle,
  X,
  Type,
  Palette,
  Check
} from "lucide-react";

// Types
interface Project {
  id: string;
  title: string;
  source: string;
  duration: string;
  age: string;
  views: string;
  clipsCount: number;
  state: "completed" | "processing" | "draft";
  progressPercent?: number;
  processingStep?: string;
  checklist: {
    transcript: boolean;
    speakers: boolean;
    hooks: boolean;
    captions: boolean;
  };
  transcript: { time: string; seconds: number; text: string }[];
  viralMoments: {
    id: string;
    title: string;
    score: number;
    time: string;
    seconds: number;
    type: string;
    imageUrl: string;
  }[];
}

// Initial Data
const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "The Future of AI Production",
    source: "YouTube • 1.2M Views",
    duration: "12:45",
    age: "1 week ago",
    views: "1.2M views",
    clipsCount: 3,
    state: "completed",
    checklist: { transcript: true, speakers: true, hooks: true, captions: true },
    transcript: [
      { time: "00:00", seconds: 0, text: "Welcome back to the studio. Today we're diving deep into why AI is fundamentally changing the way we perceive content creation." },
      { time: "00:45", seconds: 45, text: "When you think about a billion-dollar startup, you don't think about one person in a room. But with these new models, that's becoming reality." },
      { time: "01:30", seconds: 90, text: "Efficiency is no longer a luxury. It is the baseline. If you aren't using these tools, you're essentially building with stone while others use steel." },
      { time: "02:15", seconds: 135, text: "That brings us to our main point: the democratization of high-end cinematic quality through software." }
    ],
    viralMoments: [
      {
        id: "clip-1-1",
        title: "The Billion Dollar Solopreneur Hook",
        score: 98,
        time: "00:45",
        seconds: 45,
        type: "Perfect for TikTok and Reels",
        imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "clip-1-2",
        title: "Steel vs Stone Analogy",
        score: 94,
        time: "01:30",
        seconds: 90,
        type: "High retention education clip",
        imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "clip-1-3",
        title: "AI Democratization Pitch",
        score: 89,
        time: "02:15",
        seconds: 135,
        type: "Short punchy explainer",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "proj-2",
    title: "Summer Launch Keynote",
    source: "YouTube • 2 days ago",
    duration: "32:15",
    age: "2 days ago",
    views: "12.4k views",
    clipsCount: 12,
    state: "completed",
    checklist: { transcript: true, speakers: true, hooks: true, captions: true },
    transcript: [
      { time: "00:00", seconds: 0, text: "Thank you all for being here. Today we are launching something we've been crafting for over two years." },
      { time: "00:30", seconds: 30, text: "The feedback from our early alpha testers has been nothing short of extraordinary. They are saving hours every single day." },
      { time: "01:10", seconds: 70, text: "By automating the tedious clipping process, creators can now focus entirely on storytelling and direct engagement." },
      { time: "02:05", seconds: 125, text: "This is not just an update. This is Fayda Clips 2.0. Smarter clips, greater impact." }
    ],
    viralMoments: [
      {
        id: "clip-2-1",
        title: "Fayda Clips 2.0 Big Reveal",
        score: 97,
        time: "02:05",
        seconds: 125,
        type: "High retention visual hook",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop"
      },
      {
        id: "clip-2-2",
        title: "Alpha Testers Extraordinary Feedback",
        score: 93,
        time: "00:30",
        seconds: 30,
        type: "Social proof testimonial hook",
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "proj-3",
    title: "Podcast Episode #42: Future of AI",
    source: "YouTube • Just now",
    duration: "48:12",
    age: "Just now",
    views: "0 views",
    clipsCount: 0,
    state: "processing",
    progressPercent: 35,
    processingStep: "Transcribing audio (Whisper AI)...",
    checklist: {
      transcript: true,
      speakers: true,
      hooks: false,
      captions: false
    },
    transcript: [
      { time: "00:00", seconds: 0, text: "Transcribing stream data live. Please stand by while the engine parses speakers..." }
    ],
    viralMoments: []
  },
  {
    id: "proj-4",
    title: "Unboxing: Galaxy Z Fold 5",
    source: "YouTube • Draft",
    duration: "15:00",
    age: "Draft",
    views: "Draft",
    clipsCount: 0,
    state: "draft",
    checklist: { transcript: false, speakers: false, hooks: false, captions: false },
    transcript: [],
    viralMoments: []
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "new_project" | "my_videos" | "settings">("new_project");
  const [projects, setProjects] = useState<Project[]>(() => {
    const local = localStorage.getItem("fayda_projects");
    return local ? JSON.parse(local) : INITIAL_PROJECTS;
  });

  // Active editor video state
  const [activeVideo, setActiveVideo] = useState<Project>(() => {
    return projects.find(p => p.state === "completed") || projects[0];
  });

  // New project URL input
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState("");
  const [newProjectTitle, setNewProjectTitle] = useState("");

  // Playback state
  const [playSeconds, setPlaySeconds] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Profile states
  const [profileName, setProfileName] = useState(() => localStorage.getItem("fayda_profile_name") || "Julian D'Silva");
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem("fayda_profile_email") || "julian.dsilva@creative.agency");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Export settings toggles
  const [exportTikTok, setExportTikTok] = useState(true);
  const [exportInstagram, setExportInstagram] = useState(true);
  const [exportYouTube, setExportYouTube] = useState(false);
  const [autoExport, setAutoExport] = useState(false);
  const [burnCaptions, setBurnCaptions] = useState(true);

  // Caption Customizer panel
  const [showCaptionCustomizer, setShowCaptionCustomizer] = useState(false);
  const [selectedClipToEdit, setSelectedClipToEdit] = useState<any>(null);
  const [captionStyle, setCaptionStyle] = useState("Bounce Pop");
  const [captionColor, setCaptionColor] = useState("Electric Yellow");
  const [captionSize, setCaptionSize] = useState("Large");

  // Save data to localStorage whenever projects or profile change
  useEffect(() => {
    localStorage.setItem("fayda_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("fayda_profile_name", profileName);
    localStorage.setItem("fayda_profile_email", profileEmail);
  }, [profileName, profileEmail]);

  // Video playback timer simulator
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setPlaySeconds((prev) => {
          if (prev >= 180) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  // Background mock processor for projects in "processing" state
  useEffect(() => {
    const processingItem = projects.find(p => p.state === "processing");
    if (processingItem) {
      const timer = setTimeout(() => {
        setProjects((prev) => 
          prev.map((proj) => {
            if (proj.id === processingItem.id) {
              const currentPercent = proj.progressPercent || 0;
              if (currentPercent >= 90) {
                // Done processing! Transform to completed
                return {
                  ...proj,
                  state: "completed",
                  progressPercent: 100,
                  clipsCount: 4,
                  checklist: { transcript: true, speakers: true, hooks: true, captions: true },
                  transcript: [
                    { time: "00:00", seconds: 0, text: "Hey guys! Welcome to Podcast Episode #42. Today we're mapping out the massive paradigm shift in Artificial Intelligence." },
                    { time: "00:40", seconds: 40, text: "The next generation of video editing won't require manual cuts. You just feed an raw interview, and the AI serves back 10 virals ready to post." },
                    { time: "01:20", seconds: 80, text: "If you look at the compound growth of creator channels using vertical shorts, it's virtually impossible to keep up manually." },
                    { time: "02:10", seconds: 130, text: "Join our masterclass as we go over automated reframing, intelligent focus, and acoustic punch." }
                  ],
                  viralMoments: [
                    {
                      id: "clip-processing-1",
                      title: "The AI Video Paradigm Shift",
                      score: 99,
                      time: "00:40",
                      seconds: 40,
                      type: "Viral hook recommendation",
                      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"
                    },
                    {
                      id: "clip-processing-2",
                      title: "Compound Growth of Shorts",
                      score: 95,
                      time: "01:20",
                      seconds: 80,
                      type: "High retention visual stat",
                      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop"
                    }
                  ]
                };
              } else {
                // Move step forward
                const nextPercent = currentPercent + 20;
                let nextStep = "Analyzing viral hooks...";
                if (nextPercent > 50) nextStep = "Generating auto-captions...";
                if (nextPercent > 80) nextStep = "Finalizing 9:16 vertical render...";
                return {
                  ...proj,
                  progressPercent: nextPercent,
                  processingStep: nextStep,
                  checklist: {
                    transcript: true,
                    speakers: true,
                    hooks: nextPercent > 40,
                    captions: nextPercent > 70
                  }
                };
              }
            }
            return proj;
          })
        );
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [projects]);

  // Handle URL Paste & Generating
  const handleGenerateClips = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;

    // Detect general title from URL or generate mock
    let title = "Custom Video Clip";
    if (youtubeUrl.includes("youtube.com") || youtubeUrl.includes("youtu.be")) {
      title = "YouTube Video: " + youtubeUrl.split("v=")[1]?.substring(0, 8) || "YouTube Stream";
    } else {
      title = youtubeUrl.trim();
    }
    
    setNewProjectTitle(title);
    setIsProcessing(true);
    setProcessingProgress(10);
    setProcessingStep("📥 Connecting to YouTube Stream...");

    // Run custom multi-stage simulation with beautiful visual feedback
    const stages = [
      { p: 25, s: "📝 Fetching high-quality audio stream..." },
      { p: 45, s: "🎙️ Running speech-to-text (Whisper-v3 Engine)..." },
      { p: 65, s: "👤 Scanning speaker faces and calculating focus framing..." },
      { p: 85, s: "⚡ Computing hook retention & engagement scores..." },
      { p: 100, s: "🎨 Rendering captions & burning vertical 9:16 templates..." }
    ];

    let currentStageIndex = 0;
    const interval = setInterval(() => {
      if (currentStageIndex < stages.length) {
        setProcessingProgress(stages[currentStageIndex].p);
        setProcessingStep(stages[currentStageIndex].s);
        currentStageIndex++;
      } else {
        clearInterval(interval);
        
        // Add new project
        const newProj: Project = {
          id: "proj-" + Date.now(),
          title: title,
          source: "YouTube Link",
          duration: "18:30",
          age: "Just now",
          views: "0 views",
          clipsCount: 3,
          state: "completed",
          checklist: { transcript: true, speakers: true, hooks: true, captions: true },
          transcript: [
            { time: "00:00", seconds: 0, text: "Hey everyone! Today we are looking at how automation changes productivity." },
            { time: "00:45", seconds: 45, text: "Most startups spend thousands on professional editors. But now, intelligent algorithms let you do the same in 30 seconds." },
            { time: "01:30", seconds: 90, text: "If you're not utilizing this technology, you are actively burning capital." },
            { time: "02:15", seconds: 135, text: "Fayda Clips AI makes sure your hooks are perfectly formatted, center-focused, and ready to upload." }
          ],
          viralMoments: [
            {
              id: "clip-new-1",
              title: "Startup Editor Automation Hook",
              score: 98,
              time: "00:45",
              seconds: 45,
              type: "High engagement rating",
              imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"
            },
            {
              id: "clip-new-2",
              title: "Burning Capital Warning",
              score: 92,
              time: "01:30",
              seconds: 90,
              type: "Controversial punchy shorts",
              imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop"
            }
          ]
        };

        setProjects(prev => [newProj, ...prev]);
        setActiveVideo(newProj);
        setPlaySeconds(45);
        setIsProcessing(false);
        setYoutubeUrl("");
        triggerToast("🚀 New Project Created Successfully!");
        setActiveTab("dashboard");
      }
    }, 1500);
  };

  // Launch Generator for Draft items
  const startDraftGeneration = (project: Project) => {
    setNewProjectTitle(project.title);
    setIsProcessing(true);
    setProcessingProgress(15);
    setProcessingStep("📂 Loading local project workspace...");

    setTimeout(() => {
      setProcessingProgress(40);
      setProcessingStep("👤 Framing face tracking regions...");
      
      setTimeout(() => {
        setProcessingProgress(75);
        setProcessingStep("⚡ Rating hook retention profiles...");
        
        setTimeout(() => {
          setProcessingProgress(100);
          setProcessingStep("✅ Complete!");

          setProjects(prev => 
            prev.map(p => {
              if (p.id === project.id) {
                return {
                  ...p,
                  state: "completed",
                  clipsCount: 2,
                  checklist: { transcript: true, speakers: true, hooks: true, captions: true },
                  transcript: [
                    { time: "00:00", seconds: 0, text: "Today we are unboxing the absolute beast: Galaxy Z Fold 5." },
                    { time: "00:45", seconds: 45, text: "Look at this display. The crease is virtually gone. It folds completely flat now, which is a major engineering win." },
                    { time: "01:30", seconds: 90, text: "Is it worth the premium price tag? Let's check the multitasking benchmarks." }
                  ],
                  viralMoments: [
                    {
                      id: "clip-unboxing-1",
                      title: "The Crease Win Hook",
                      score: 96,
                      time: "00:45",
                      seconds: 45,
                      type: "High-impact tech reaction",
                      imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop"
                    }
                  ]
                };
              }
              return p;
            })
          );

          // Update editor video
          const updated = {
            ...project,
            state: "completed" as const,
            clipsCount: 2,
            checklist: { transcript: true, speakers: true, hooks: true, captions: true },
            transcript: [
              { time: "00:00", seconds: 0, text: "Today we are unboxing the absolute beast: Galaxy Z Fold 5." },
              { time: "00:45", seconds: 45, text: "Look at this display. The crease is virtually gone. It folds completely flat now, which is a major engineering win." },
              { time: "01:30", seconds: 90, text: "Is it worth the premium price tag? Let's check the multitasking benchmarks." }
            ],
            viralMoments: [
              {
                id: "clip-unboxing-1",
                title: "The Crease Win Hook",
                score: 96,
                time: "00:45",
                seconds: 45,
                type: "High-impact tech reaction",
                imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop"
              }
            ]
          };
          setActiveVideo(updated);
          setPlaySeconds(45);
          setIsProcessing(false);
          triggerToast("✨ AI Processing Finished!");
          setActiveTab("dashboard");
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  // Helper formatting seconds
  const formatTimeSeconds = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Helper seeking to absolute point in video transcript
  const handleSeek = (seconds: number) => {
    setPlaySeconds(seconds);
    setIsPlaying(true);
  };

  // Helper trigger mock clip download
  const downloadClip = (clipTitle: string) => {
    triggerToast(`📥 Downloading "${clipTitle}" (4K 60FPS Render)...`);
  };

  // Helper open caption customizer
  const editClipCaptions = (clip: any) => {
    setSelectedClipToEdit(clip);
    setShowCaptionCustomizer(true);
  };

  return (
    <div id="fayda-app-root" className="min-h-screen bg-[#09090B] text-[#E5E1E4] font-sans selection:bg-[#c9beff]/30 antialiased flex flex-col pb-20 md:pb-0">
      
      {/* SUCCESS TOAST NOTIFICATION */}
      {successToast && (
        <div id="toast-success" className="fixed top-20 right-6 z-[100] bg-white text-black font-semibold px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-100 animate-bounce">
          <Sparkles className="text-[#6C4CF1] w-5 h-5 animate-pulse" />
          <span>{successToast}</span>
        </div>
      )}

      {/* MODAL: Caption Customizer */}
      {showCaptionCustomizer && selectedClipToEdit && (
        <div id="customizer-overlay" className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div id="customizer-card" className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
            <button 
              onClick={() => setShowCaptionCustomizer(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-[#6C4CF1] w-6 h-6 animate-pulse" />
              <h3 className="text-xl font-bold text-white">Customize Auto-Captions</h3>
            </div>
            <p className="text-[#c4c7c8] text-sm mb-6">
              Style your captions dynamically for <span className="text-white font-semibold">{selectedClipToEdit.title}</span>.
            </p>

            <div className="space-y-5">
              {/* STYLE */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#c4c7c8]/70 font-semibold flex items-center gap-2">
                  <Type className="w-4 h-4" /> Caption Animation Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Bounce Pop", "Word-by-Word", "Classic Sub", "Neon Fade"].map((style) => (
                    <button
                      key={style}
                      onClick={() => setCaptionStyle(style)}
                      className={`py-2 px-3 text-sm rounded-lg border text-left flex items-center justify-between transition-all ${
                        captionStyle === style 
                        ? "border-[#c9beff] bg-[#c9beff]/10 text-white" 
                        : "border-white/5 bg-white/5 text-[#c4c7c8] hover:bg-white/10"
                      }`}
                    >
                      <span>{style}</span>
                      {captionStyle === style && <Check className="w-4 h-4 text-[#c9beff]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* COLOR */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#c4c7c8]/70 font-semibold flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Caption Accent Color
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Electric Yellow", code: "text-yellow-300", bg: "bg-yellow-300" },
                    { name: "Vibrant Purple", code: "text-[#c9beff]", bg: "bg-[#c9beff]" },
                    { name: "Neon Green", code: "text-emerald-400", bg: "bg-emerald-400" },
                    { name: "Pure White", code: "text-white", bg: "bg-white" }
                  ].map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setCaptionColor(color.name)}
                      className={`py-2 px-3 text-sm rounded-lg border text-left flex items-center gap-2 transition-all ${
                        captionColor === color.name 
                        ? "border-[#c9beff] bg-[#c9beff]/10 text-white" 
                        : "border-white/5 bg-white/5 text-[#c4c7c8] hover:bg-white/10"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${color.bg}`} />
                      <span>{color.name}</span>
                      {captionColor === color.name && <Check className="ml-auto w-4 h-4 text-[#c9beff]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* SIZE */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#c4c7c8]/70 font-semibold">
                  Font Scale
                </label>
                <div className="flex gap-2">
                  {["Medium", "Large", "X-Large"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setCaptionSize(size)}
                      className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                        captionSize === size 
                        ? "border-[#c9beff] bg-[#c9beff]/10 text-white font-semibold" 
                        : "border-white/5 bg-white/5 text-[#c4c7c8] hover:bg-white/10"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PREVIEW BOX */}
            <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/5 text-center flex flex-col justify-center min-h-[80px]">
              <p className="text-xs text-white/40 mb-1">LIVE PREVIEW</p>
              <p className="text-lg font-extrabold tracking-tight select-none uppercase animate-pulse">
                <span className={
                  captionColor === "Electric Yellow" ? "text-yellow-300" :
                  captionColor === "Vibrant Purple" ? "text-[#c9beff]" :
                  captionColor === "Neon Green" ? "text-emerald-400" : "text-white"
                }>
                  {captionStyle === "Bounce Pop" ? "💥 Billion-Dollar Startup! 💥" :
                   captionStyle === "Word-by-Word" ? "Billion-Dollar" :
                   captionStyle === "Classic Sub" ? "When you think about a billion-dollar startup..." :
                   "Billion-Dollar Startup"}
                </span>
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => setShowCaptionCustomizer(false)}
                className="flex-1 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm transition-colors text-white"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowCaptionCustomizer(false);
                  triggerToast(`✨ Caption style applied to "${selectedClipToEdit.title}"!`);
                }}
                className="flex-1 py-2.5 rounded-lg bg-white text-black font-bold text-sm hover:bg-[#c9beff] transition-all"
              >
                Apply Style
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN LOADING/PROCESSING MODAL */}
      {isProcessing && (
        <div id="processing-overlay" className="fixed inset-0 z-[120] bg-[#09090B]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full space-y-8">
            <div className="relative inline-block">
              {/* Outer logo spinner */}
              <div className="w-24 h-24 rounded-full border-4 border-[#6C4CF1]/20 border-t-[#c9beff] animate-spin"></div>
              {/* Inner glowing core */}
              <div className="absolute inset-4 rounded-full bg-[#111827] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#c9beff] animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">Fayda AI Clipping Engine</h2>
              <p className="text-[#c4c7c8] text-sm font-semibold italic">{newProjectTitle}</p>
            </div>

            {/* Simulated steps */}
            <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-xs text-[#c4c7c8]/60 uppercase tracking-widest font-bold">
                <span>AI Processing Status</span>
                <span>{processingProgress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#6C4CF1] to-[#3B82F6] h-full transition-all duration-500 shadow-[0_0_15px_rgba(108,76,241,0.5)]"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>

              <p className="text-[#c9beff] font-medium text-sm animate-pulse min-h-[20px]">
                {processingStep}
              </p>
            </div>

            <div className="text-white/40 text-xs">
              This process typically takes less than 30 seconds. Do not close this tab.
            </div>
          </div>
        </div>
      )}

      {/* FIXED TOP APP BAR */}
      <header id="app-header" className="fixed top-0 w-full z-50 bg-[#131315]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-6 md:px-12 h-16">
        <div 
          onClick={() => setActiveTab("new_project")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Official brand logo */}
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx4-y_shftEWrhg3HQhhFk5akftkVayHUK35HHP0DVqNXSHpSC033M84s84BbY6vYEAiWRJDyKKNLLcWDrj9CsqoturzCM-zaA3vwb-QIE356Vk_0z-6jD1CXoTQT2rE5VB5N75d1uWRjhhTKfKz-pJ-dQWGghd_dzC8wcdDnaRTjO0xdZejcduzJf61f7cOrb3Ctp-IILHVWYAp2ydI_LYitYDpssYhs3GrGMKSBePUxvv8B0WH_Al7_DfYW-KX3SJCLGuReaI30" 
            alt="Fayda Clips AI Logo" 
            className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
            referrerPolicy="no-referrer"
          />
          <span className="font-bold text-lg text-white tracking-tight group-hover:text-[#c9beff] transition-colors flex items-center gap-1.5 hidden sm:block">
            Fayda Clips <span className="text-[10px] bg-white/10 text-[#c9beff] py-0.5 px-2 rounded-full font-semibold">AI</span>
          </span>
        </div>

        {/* Desktop navigation bar */}
        <div id="desktop-nav-tabs" className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`font-medium text-sm transition-all ${activeTab === "dashboard" ? "text-white" : "text-[#c4c7c8] hover:text-white"}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("new_project")}
            className={`font-medium text-sm transition-all ${activeTab === "new_project" ? "text-white" : "text-[#c4c7c8] hover:text-white"}`}
          >
            New Project
          </button>
          <button 
            onClick={() => setActiveTab("my_videos")}
            className={`font-medium text-sm transition-all ${activeTab === "my_videos" ? "text-white" : "text-[#c4c7c8] hover:text-white"}`}
          >
            My Videos
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`font-medium text-sm transition-all ${activeTab === "settings" ? "text-white" : "text-[#c4c7c8] hover:text-white"}`}
          >
            Settings
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="hover:text-white text-[#c4c7c8] transition-colors p-2 rounded-full hover:bg-white/5">
            <Search className="w-5 h-5" />
          </button>
          
          {/* Avatar Profile Bubble */}
          <div 
            onClick={() => setActiveTab("settings")}
            className="w-9 h-9 rounded-full bg-[#111827] border border-white/10 overflow-hidden cursor-pointer hover:border-[#c9beff] transition-colors flex items-center justify-center text-[#c9beff] font-bold text-xs shadow-lg"
            title="Julian D'Silva"
          >
            JD
          </div>
        </div>
      </header>

      {/* VIEWPORT CANVAS GRID */}
      <div id="main-content-canvas" className="flex min-h-screen pt-16">
        
        {/* DESKTOP STICKY SIDE DRAWER */}
        <aside id="desktop-side-drawer" className="hidden md:flex flex-col h-[calc(100vh-4rem)] w-[260px] bg-[#111827] border-r border-white/5 p-6 gap-6 sticky top-16 shadow-2xl">
          <div className="flex items-center gap-3 bg-[#09090B]/40 p-3 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-[#6C4CF1] flex items-center justify-center text-white font-bold text-lg shadow-lg">
              CP
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Creator Pro</h3>
              <p className="text-xs text-[#c4c7c8]/60">Active Premium</p>
            </div>
          </div>

          <nav id="sidebar-nav" className="flex flex-col gap-1.5 flex-1">
            <button 
              onClick={() => setActiveTab("new_project")}
              className={`w-full text-left px-4 py-3 text-sm rounded-xl flex items-center gap-3 transition-all ${
                activeTab === "new_project" 
                ? "bg-white text-black font-semibold shadow-lg" 
                : "text-[#c4c7c8] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>

            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left px-4 py-3 text-sm rounded-xl flex items-center gap-3 transition-all ${
                activeTab === "dashboard" 
                ? "bg-white text-black font-semibold shadow-lg" 
                : "text-[#c4c7c8] hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Active Editor</span>
            </button>

            <button 
              onClick={() => setActiveTab("my_videos")}
              className={`w-full text-left px-4 py-3 text-sm rounded-xl flex items-center gap-3 transition-all ${
                activeTab === "my_videos" 
                ? "bg-white text-black font-semibold shadow-lg" 
                : "text-[#c4c7c8] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Video className="w-4 h-4" />
              <span>My Videos</span>
            </button>

            <button 
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left px-4 py-3 text-sm rounded-xl flex items-center gap-3 transition-all ${
                activeTab === "settings" 
                ? "bg-white text-black font-semibold shadow-lg" 
                : "text-[#c4c7c8] hover:bg-white/5 hover:text-white"
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>

          <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center text-xs space-y-1">
            <span className="font-bold text-[#c9beff]">Fayda Clips v2.0</span>
            <p className="text-[#c4c7c8]/60">Smarter Clips. Greater Impact.</p>
          </div>
        </aside>

        {/* CONTAINER MAIN WINDOW AREA */}
        <main id="main-canvas" className="flex-1 min-w-0 py-8 px-4 md:px-10 max-w-7xl mx-auto w-full transition-all">
          
          {/* ==================== TAB 1: NEW PROJECT (LANDING) ==================== */}
          {activeTab === "new_project" && (
            <div id="new-project-screen" className="space-y-12 animate-fade-in max-w-[840px] mx-auto text-center py-6">
              
              {/* Dynamic Header */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#c9beff] animate-ping"></span>
                  <span className="text-[10px] font-bold text-[#c9beff] uppercase tracking-widest">New: AI Engine v2.0</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  Turn Long Videos Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#c9beff] to-[#6C4CF1]">Viral Shorts</span>
                </h1>
                
                <p className="text-[#c4c7c8] font-medium text-base md:text-lg max-w-[620px] mx-auto leading-relaxed">
                  Paste a YouTube link and let AI automatically create engaging short-form content in seconds.
                </p>
              </div>

              {/* Paste URL Input bar */}
              <form 
                onSubmit={handleGenerateClips}
                className="bg-[#111827]/70 p-2 rounded-2xl border border-white/10 shadow-2xl max-w-xl mx-auto flex flex-col md:flex-row gap-2 transition-all focus-within:border-[#c9beff]/50"
              >
                <div className="flex-1 flex items-center px-4 gap-3">
                  <Link className="text-[#c4c7c8] w-5 h-5 flex-shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Paste your YouTube URL here..." 
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder:text-[#c4c7c8]/40 text-sm py-3"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={!youtubeUrl.trim()}
                  className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-[#c9beff] active:scale-95 transition-all whitespace-nowrap disabled:opacity-40 disabled:hover:bg-white"
                >
                  Generate Clips
                </button>
              </form>

              {/* Rapid Stats checklist */}
              <div className="flex flex-wrap justify-center gap-6 text-[#c4c7c8]/70 text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  4K Export Ready
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Multi-platform Auto-Reframe
                </span>
              </div>

              {/* Bento grid feature showcase matching screenshot */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-16 text-left">
                
                {/* Bento Card Large */}
                <div className="col-span-12 md:col-span-8 bg-[#111827] border border-white/10 rounded-2xl overflow-hidden p-8 flex flex-col justify-end min-h-[380px] relative group shadow-xl">
                  {/* Backdrop Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
                  
                  {/* Futuristic cinematic image */}
                  <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop" 
                    alt="AI Face Tracking"
                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 group-hover:scale-105 transition-transform duration-700"
                  />

                  <div className="relative z-20 space-y-3">
                    <h3 className="text-2xl font-bold text-white">Intelligent Face Tracking</h3>
                    <p className="text-[#c4c7c8] text-sm max-w-md">
                      Our AI automatically detects speakers and keeps them perfectly centered in 9:16 format, ensuring maximum engagement.
                    </p>
                  </div>
                </div>

                {/* Bento Card Small 1 */}
                <div className="col-span-12 md:col-span-4 bg-[#111827] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:bg-white/5 transition-all shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-[#6C4CF1]/20 border border-[#6C4CF1]/30 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#c9beff]" />
                  </div>
                  <div className="space-y-2 mt-8">
                    <h3 className="text-xl font-bold text-white">Auto-Captions</h3>
                    <p className="text-[#c4c7c8] text-sm">
                      Generate high-impact, animated captions that increase retention by up to 80%.
                    </p>
                  </div>
                </div>

                {/* Bento Card Small 2 */}
                <div className="col-span-12 md:col-span-4 bg-[#111827] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:bg-white/5 transition-all shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="space-y-2 mt-8">
                    <h3 className="text-xl font-bold text-white">Viral Scoring</h3>
                    <p className="text-[#c4c7c8] text-sm">
                      Predict the performance of your clips before you post with our proprietary engagement algorithm.
                    </p>
                  </div>
                </div>

                {/* Bento Card Medium */}
                <div className="col-span-12 md:col-span-8 bg-[#111827] border border-white/10 rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">Multi-Platform Export</h3>
                    <p className="text-[#c4c7c8] text-sm max-w-md leading-relaxed">
                      One click to export optimized formats for TikTok, Reels, and YouTube Shorts.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-8">
                    <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-white">TikTok</span>
                    <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-white">Instagram</span>
                    <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-white">YouTube</span>
                  </div>

                  {/* Absolute graphic background */}
                  <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden lg:block opacity-20 bg-gradient-to-l from-[#6C4CF1] to-transparent pointer-events-none"></div>
                </div>

              </div>

            </div>
          )}

          {/* ==================== TAB 2: EDITOR / ACTIVE VIDEO (DASHBOARD) ==================== */}
          {activeTab === "dashboard" && activeVideo && (
            <div id="editor-screen" className="space-y-8 animate-fade-in py-2">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Video Preview + Player */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Dynamic Video Frame Box */}
                  <div className="bg-black rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl">
                    <div className="aspect-video w-full flex items-center justify-center bg-zinc-950 relative">
                      
                      {/* Active video visual layer */}
                      {activeVideo.viralMoments.length > 0 && activeVideo.viralMoments.find(c => c.seconds === playSeconds) ? (
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
                          <img 
                            src={activeVideo.viralMoments.find(c => c.seconds === playSeconds)?.imageUrl}
                            alt="Frame Preview" 
                            className="h-full w-auto object-cover border-x-4 border-[#6C4CF1]"
                          />
                          <div className="absolute inset-x-0 bottom-12 flex justify-center px-4">
                            <span className={`px-4 py-1.5 rounded bg-black/85 text-sm font-extrabold tracking-wide uppercase border border-white/10 text-yellow-300`}>
                              💥 Word-by-word Auto Caption 💥
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 w-full h-full">
                          <img 
                            src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop"
                            alt="Aura Studio Recording Setup" 
                            className="w-full h-full object-cover opacity-60"
                          />
                        </div>
                      )}

                      {/* Interactive Play Button overlay */}
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="absolute inset-0 m-auto w-16 h-16 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 transition-all hover:scale-105"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-white fill-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white fill-white ml-1" />
                        )}
                      </button>

                      {/* AI recommendations badge */}
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-[#c9beff] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Track Centered</span>
                      </div>
                    </div>

                    {/* Styled Player Control Bar */}
                    <div className="p-4 bg-[#111827] border-t border-white/10 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs text-[#c4c7c8]">
                        <span className="font-semibold tracking-wider">{formatTimeSeconds(playSeconds)} / {activeVideo.duration}</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4 text-[#c4c7c8]/80" />
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              value={volume} 
                              onChange={(e) => setVolume(Number(e.target.value))}
                              className="w-16 h-1 rounded-full accent-white bg-white/10 cursor-pointer"
                            />
                          </div>
                          <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white" />
                        </div>
                      </div>

                      {/* Playback Slider bar */}
                      <div className="relative w-full h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-white transition-all"
                          style={{ width: `${(playSeconds / 180) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Video Title and Metadata */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#111827] border border-white/10 p-6 rounded-2xl">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-white">{activeVideo.title}</h2>
                      <p className="text-sm text-[#c4c7c8]/60">{activeVideo.source}</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab("new_project")}
                      className="bg-white text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#c9beff] transition-all flex items-center gap-2 w-fit shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Project</span>
                    </button>
                  </div>

                </div>

                {/* Right Side: AI Interactive Transcript */}
                <div className="lg:col-span-4 flex flex-col h-[520px] bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#131315]/40">
                    <h3 className="text-xs uppercase tracking-wider text-[#c4c7c8]/80 font-bold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#c9beff]" /> AI Transcript
                    </h3>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#6C4CF1]/20 text-[#c9beff]">
                      Whisper Engine
                    </span>
                  </div>

                  {/* Transcript segment loop */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {activeVideo.transcript.length > 0 ? (
                      activeVideo.transcript.map((seg, idx) => {
                        const isActive = playSeconds >= seg.seconds && (idx === activeVideo.transcript.length - 1 || playSeconds < activeVideo.transcript[idx + 1].seconds);
                        return (
                          <div 
                            key={idx}
                            onClick={() => handleSeek(seg.seconds)}
                            className={`p-3 rounded-xl cursor-pointer transition-all space-y-1.5 border ${
                              isActive 
                              ? "bg-[#6C4CF1]/10 border-[#6C4CF1] text-white" 
                              : "border-transparent text-[#c4c7c8]/80 hover:bg-white/5"
                            }`}
                          >
                            <span className="text-xs font-bold text-[#c9beff]">{seg.time}</span>
                            <p className="text-sm leading-relaxed font-medium">{seg.text}</p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/40">
                        <Folder className="w-8 h-8 mb-2 stroke-1" />
                        <p className="text-xs">No transcript segments loaded</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* HORIZONTAL VIRAL MOMENTS SECTION */}
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-[#6C4CF1]/10 text-[#c9beff] px-3 py-1 rounded-full mb-2 border border-[#6C4CF1]/20">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">AI Recommended Moments</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Viral Moments</h3>
                  </div>
                  
                  {/* Mock Slider Buttons */}
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full border border-white/10 hover:bg-white/5 flex items-center justify-center transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full border border-white/10 hover:bg-white/5 flex items-center justify-center transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Viral Clip Card List */}
                <div className="flex gap-6 overflow-x-auto pb-4 snap-x custom-scrollbar">
                  {activeVideo.viralMoments.length > 0 ? (
                    activeVideo.viralMoments.map((clip) => (
                      <div 
                        key={clip.id} 
                        className="min-w-[300px] md:min-w-[340px] bg-[#111827] border border-white/10 rounded-xl overflow-hidden snap-start shadow-lg hover:border-white/20 transition-all flex flex-col"
                      >
                        {/* Clip Thumbnail */}
                        <div className="h-44 relative bg-black flex items-center justify-center overflow-hidden">
                          <img 
                            src={clip.imageUrl} 
                            alt={clip.title}
                            className="w-full h-full object-cover opacity-85" 
                          />
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded text-[11px] font-bold text-white tracking-widest">
                            {clip.time}
                          </div>
                          
                          {/* Rating score badge */}
                          <div className="absolute top-3 right-3 bg-[#6C4CF1] text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-lg shadow-[#6C4CF1]/50">
                            <Zap className="w-3.5 h-3.5 fill-white" />
                            <span>{clip.score}% SCORE</span>
                          </div>
                        </div>

                        {/* Card Info & Actions */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <h4 className="font-bold text-white leading-snug text-base mb-1">{clip.title}</h4>
                            <p className="text-xs text-[#c4c7c8]/60 font-semibold">{clip.type}</p>
                          </div>

                          <div className="flex gap-2">
                            <button 
                              onClick={() => downloadClip(clip.title)}
                              className="flex-1 bg-white hover:bg-[#c9beff] text-black py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                            
                            <button 
                              onClick={() => editClipCaptions(clip)}
                              className="px-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center text-[#c4c7c8] hover:text-white"
                              title="Customize Subtitles"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-center py-10 text-white/40 border border-dashed border-white/10 rounded-2xl bg-white/5">
                      No viral moments generated for this project. Launch AI generation to extract them!
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 3: MY VIDEOS ==================== */}
          {activeTab === "my_videos" && (
            <div id="my-videos-screen" className="space-y-12 animate-fade-in py-2">
              
              {/* Screen header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white">My Videos</h1>
                  <p className="text-sm text-[#c4c7c8]/80 max-w-2xl leading-relaxed">
                    Manage your AI-powered video edits, view insights, and export your high-impact clips to any platform.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab("new_project")}
                  className="bg-white text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#c9beff] active:scale-95 transition-all w-fit shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </button>
              </div>

              {/* Bento grid containing videos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div 
                    key={proj.id} 
                    className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
                  >
                    
                    {/* Visual Media Header */}
                    <div className="relative aspect-video w-full overflow-hidden bg-[#131315]/80 flex items-center justify-center">
                      
                      {proj.state === "processing" ? (
                        <div className="absolute inset-0 bg-[#6C4CF1]/10 flex flex-col items-center justify-center p-4">
                          <div className="w-10 h-10 border-4 border-[#6C4CF1]/20 border-t-[#c9beff] rounded-full animate-spin mb-3"></div>
                          <span className="text-[10px] font-bold text-[#c9beff] uppercase tracking-widest text-center animate-pulse">
                            {proj.processingStep || "AI Processing..."}
                          </span>
                        </div>
                      ) : proj.state === "completed" ? (
                        <div className="absolute inset-0">
                          <img 
                            src={proj.viralMoments[0]?.imageUrl || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600&auto=format&fit=crop"} 
                            alt={proj.title}
                            className="w-full h-full object-cover opacity-75 hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute top-4 left-4 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30">
                            Completed
                          </div>
                          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded font-bold text-xs">
                            {proj.clipsCount} CLIPS
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-white/5 flex flex-col items-center justify-center text-center p-4">
                          <Video className="w-10 h-10 text-white/30 mb-2 stroke-1" />
                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Draft</span>
                        </div>
                      )}

                    </div>

                    {/* Card Content body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-[#c9beff] transition-colors">{proj.title}</h3>
                        
                        <div className="flex items-center justify-between text-xs text-[#c4c7c8]/60 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5" />
                            {proj.age}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            {proj.views}
                          </span>
                        </div>
                      </div>

                      {/* State-Based interactive buttons */}
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        
                        {proj.state === "completed" && (
                          <div className="space-y-3">
                            {/* Visual checklists */}
                            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-[#c4c7c8]/80">
                              <span className="flex items-center gap-1 text-[#c9beff]">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Auto Transcript
                              </span>
                              <span className="flex items-center gap-1 text-[#c9beff]">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Auto Captions
                              </span>
                            </div>
                            <button 
                              onClick={() => {
                                setActiveVideo(proj);
                                setPlaySeconds(proj.viralMoments[0]?.seconds || 0);
                                setActiveTab("dashboard");
                              }}
                              className="w-full py-2.5 border border-white/10 rounded-xl text-white font-bold text-xs hover:bg-white/5 transition-all text-center block"
                            >
                              View Clips
                            </button>
                          </div>
                        )}

                        {proj.state === "processing" && (
                          <div className="space-y-2">
                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-[#6C4CF1] h-full transition-all duration-500" 
                                style={{ width: `${proj.progressPercent || 20}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-white/50 block font-semibold italic text-center">
                              AI Processing Hook Renders ({proj.progressPercent || 20}%)
                            </span>
                          </div>
                        )}

                        {proj.state === "draft" && (
                          <div className="bg-[#131315]/40 p-3 rounded-xl border border-white/5 space-y-3">
                            <p className="text-xs text-[#c4c7c8]/60 italic">Ready for AI processing...</p>
                            <button 
                              onClick={() => startDraftGeneration(proj)}
                              className="w-full py-2.5 bg-[#6C4CF1] hover:bg-[#c9beff] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#6C4CF1]/20 transition-all"
                            >
                              <Sparkles className="w-3.5 h-3.5 fill-white" />
                              <span>Start AI Generation</span>
                            </button>
                          </div>
                        )}

                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* POWERFUL AI FEATURES ACCENT PANEL */}
              <section className="bg-[#111827] border border-white/10 rounded-2xl p-8 space-y-8">
                <div className="text-center space-y-2 max-w-lg mx-auto">
                  <h2 className="text-2xl font-bold text-white">Powerful AI Features</h2>
                  <p className="text-sm text-[#c4c7c8]/60 font-semibold">
                    Experience our industry-leading AI tools designed to turn long-form content into viral social clips in seconds.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                  
                  {/* Feature Card 1 */}
                  <div className="p-6 rounded-xl bg-[#131315]/50 border border-white/5 hover:border-[#6C4CF1]/30 transition-all space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#6C4CF1]/10 flex items-center justify-center mx-auto text-[#c9beff]">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-white text-base">Auto Transcript</h4>
                    <p className="text-[#c4c7c8] text-xs leading-relaxed">
                      Whisper-level accuracy in 95+ languages with speaker identification.
                    </p>
                  </div>

                  {/* Feature Card 2 */}
                  <div className="p-6 rounded-xl bg-[#131315]/50 border border-white/5 hover:border-[#6C4CF1]/30 transition-all space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto text-blue-400">
                      <Camera className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-white text-base">Speaker Detection</h4>
                    <p className="text-[#c4c7c8] text-xs leading-relaxed">
                      Perfectly frames the speaker using smart AI-face-tracking technology.
                    </p>
                  </div>

                  {/* Feature Card 3 */}
                  <div className="p-6 rounded-xl bg-[#131315]/50 border border-white/5 hover:border-[#6C4CF1]/30 transition-all space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#6C4CF1]/10 flex items-center justify-center mx-auto text-[#c9beff]">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-white text-base">Viral Hook</h4>
                    <p className="text-[#c4c7c8] text-xs leading-relaxed">
                      Our algorithms detect the most engaging parts for maximum impact.
                    </p>
                  </div>

                  {/* Feature Card 4 */}
                  <div className="p-6 rounded-xl bg-[#131315]/50 border border-white/5 hover:border-[#6C4CF1]/30 transition-all space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-white text-base">Auto Captions</h4>
                    <p className="text-[#c4c7c8] text-xs leading-relaxed">
                      Dynamic, high-retention captions styled automatically for your brand.
                    </p>
                  </div>

                </div>
              </section>

            </div>
          )}

          {/* ==================== TAB 4: SETTINGS ==================== */}
          {activeTab === "settings" && (
            <div id="settings-screen" className="space-y-8 animate-fade-in py-2">
              
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white">Settings</h1>
                <p className="text-sm text-[#c4c7c8]/80 max-w-2xl leading-relaxed">
                  Manage your Fayda Clips account, upgrade your subscription, and configure your default export behavior.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Profile & Subscription */}
                <div className="lg:col-span-7 space-y-8">
                  
                  {/* Profile Card */}
                  <section className="bg-[#111827] border border-white/10 p-8 rounded-2xl shadow-xl space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">Profile Information</h2>
                      <button 
                        onClick={() => {
                          if (isEditingProfile) {
                            triggerToast("💾 Profile updated successfully!");
                          }
                          setIsEditingProfile(!isEditingProfile);
                        }}
                        className="text-[#c9beff] hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                      >
                        {isEditingProfile ? "Save Changes" : "Edit Profile"}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative group">
                        <div className="w-20 h-20 rounded-full border-2 border-[#6C4CF1] p-1 flex items-center justify-center overflow-hidden">
                          <div className="w-full h-full bg-[#131315] rounded-full flex items-center justify-center text-[#c9beff] text-2xl font-black">
                            {profileName.charAt(0)}
                          </div>
                        </div>
                        <button className="absolute bottom-0 right-0 bg-white hover:bg-[#c9beff] text-black p-1.5 rounded-full shadow-lg transition-transform hover:scale-110">
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1 text-center sm:text-left">
                        <p className="text-white font-bold text-xl">{profileName}</p>
                        <p className="text-[#c4c7c8]/60 text-sm">{profileEmail}</p>
                        <div className="flex justify-center sm:justify-start pt-1">
                          <span className="bg-[#c9beff]/10 text-[#c9beff] px-3 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-[#c9beff]/20">
                            Verified Creator
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-[#c4c7c8]/50">Full Name</label>
                        {isEditingProfile ? (
                          <input 
                            type="text" 
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="w-full bg-[#131315]/80 border border-white/15 rounded-xl px-4 py-3 text-white focus:border-[#c9beff] focus:ring-0 text-sm font-semibold"
                          />
                        ) : (
                          <div className="bg-[#131315]/40 border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-semibold">
                            {profileName}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-[#c4c7c8]/50">Email Address</label>
                        {isEditingProfile ? (
                          <input 
                            type="email" 
                            value={profileEmail}
                            onChange={(e) => setProfileEmail(e.target.value)}
                            className="w-full bg-[#131315]/80 border border-white/15 rounded-xl px-4 py-3 text-white focus:border-[#c9beff] focus:ring-0 text-sm font-semibold"
                          />
                        ) : (
                          <div className="bg-[#131315]/40 border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-semibold">
                            {profileEmail}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Current Plan Card */}
                  <section className="bg-[#111827] border border-white/10 p-8 rounded-2xl relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#6C4CF1]/10 rounded-full blur-[80px] pointer-events-none"></div>
                    
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Current Plan</h2>
                      <span className="bg-white text-black font-extrabold text-[10px] px-3.5 py-1.5 rounded-full tracking-widest uppercase">
                        Active
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white">Creator Pro</h3>
                        <p className="text-xs text-[#c4c7c8]/60">Your next billing cycle starts on <span className="text-white font-semibold">Dec 12, 2024</span>.</p>
                        
                        <ul className="space-y-2 text-xs font-semibold text-[#c4c7c8]">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#c9beff]" />
                            <span>Unlimited AI Clipping &amp; Reframing</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#c9beff]" />
                            <span>4K Export Quality (TikTok &amp; Reels)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#c9beff]" />
                            <span>Priority Cloud Processing</span>
                          </li>
                        </ul>
                      </div>

                      <div className="text-right space-y-4 w-full md:w-auto">
                        <div>
                          <span className="text-4xl font-black text-white">$49</span>
                          <span className="text-sm text-[#c4c7c8]">/mo</span>
                        </div>
                        <button 
                          onClick={() => triggerToast("💳 Redirecting to Stripe Billing Portal...")}
                          className="w-full md:w-auto bg-white hover:bg-[#c9beff] text-black text-xs font-bold px-6 py-3 rounded-xl transition-all"
                        >
                          Manage Billing
                        </button>
                      </div>
                    </div>
                  </section>

                </div>

                {/* Right Side: Preferences & Security */}
                <div className="lg:col-span-5 space-y-8">
                  
                  {/* Export Preferences */}
                  <section className="bg-[#111827] border border-white/10 p-8 rounded-2xl shadow-xl space-y-6">
                    <h2 className="text-xl font-bold text-white">Export Preferences</h2>
                    
                    <div className="space-y-4">
                      {/* TikTok toggle */}
                      <div className="flex items-center justify-between p-4 bg-[#131315]/60 border border-white/5 rounded-xl">
                        <div>
                          <p className="text-sm font-bold text-white">TikTok Optimized</p>
                          <p className="text-[11px] text-[#c4c7c8]/60 font-semibold">9:16 Vertical • 1080p</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={exportTikTok}
                            onChange={(e) => setExportTikTok(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c9beff]"></div>
                        </label>
                      </div>

                      {/* Instagram Reels toggle */}
                      <div className="flex items-center justify-between p-4 bg-[#131315]/60 border border-white/5 rounded-xl">
                        <div>
                          <p className="text-sm font-bold text-white">Instagram Reels</p>
                          <p className="text-[11px] text-[#c4c7c8]/60 font-semibold">9:16 Vertical • High Bitrate</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={exportInstagram}
                            onChange={(e) => setExportInstagram(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c9beff]"></div>
                        </label>
                      </div>

                      {/* YouTube Shorts toggle */}
                      <div className="flex items-center justify-between p-4 bg-[#131315]/60 border border-white/5 rounded-xl">
                        <div>
                          <p className="text-sm font-bold text-white">YouTube Shorts</p>
                          <p className="text-[11px] text-[#c4c7c8]/60 font-semibold">9:16 Vertical • 60 FPS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={exportYouTube}
                            onChange={(e) => setExportYouTube(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c9beff]"></div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 space-y-4">
                      {/* Auto export */}
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <div>
                          <p className="text-white">Auto-Export Clips</p>
                          <p className="text-[10px] text-[#c4c7c8]/50">Automatically sync with cloud storage</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={autoExport}
                            onChange={(e) => setAutoExport(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c9beff]"></div>
                        </label>
                      </div>

                      {/* Burn captions */}
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <div>
                          <p className="text-white">Burn AI Captions</p>
                          <p className="text-[10px] text-[#c4c7c8]/50">Always include stylized AI-generated subs</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={burnCaptions}
                            onChange={(e) => setBurnCaptions(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c9beff]"></div>
                        </label>
                      </div>
                    </div>
                  </section>

                  {/* Security panel */}
                  <section className="bg-[#111827] border border-white/10 p-8 rounded-2xl shadow-xl space-y-4">
                    <div className="flex items-center gap-3 text-[#c9beff]">
                      <ShieldCheck className="w-6 h-6" />
                      <h2 className="text-lg font-bold text-white">Security Settings</h2>
                    </div>
                    <p className="text-xs text-[#c4c7c8]/60 font-semibold leading-relaxed">
                      Update your password or enable Two-Factor Authentication for enhanced account security.
                    </p>
                    <button 
                      onClick={() => triggerToast("🔐 Opening Password Update Interface...")}
                      className="w-full bg-white/5 border border-white/10 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-white/10 transition-colors"
                    >
                      Update Security Settings
                    </button>
                  </section>

                </div>

              </div>

              {/* Danger Zone */}
              <div className="pt-8 text-center">
                <button 
                  onClick={() => triggerToast("⚠️ Please contact support to deactivate your account.")}
                  className="text-red-500/60 hover:text-red-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mx-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Deactivate Account
                </button>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav id="mobile-bottom-nav" className="md:hidden fixed bottom-0 w-full z-50 bg-[#131315]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl flex justify-around items-center py-3 pb-safe">
        <button 
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold ${activeTab === "dashboard" ? "text-white" : "text-[#c4c7c8]/60"}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button>

        <button 
          onClick={() => setActiveTab("new_project")}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold ${activeTab === "new_project" ? "text-white" : "text-[#c4c7c8]/60"}`}
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>

        <button 
          onClick={() => setActiveTab("my_videos")}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold ${activeTab === "my_videos" ? "text-white" : "text-[#c4c7c8]/60"}`}
        >
          <Video className="w-5 h-5" />
          <span>My Videos</span>
        </button>

        <button 
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold ${activeTab === "settings" ? "text-white" : "text-[#c4c7c8]/60"}`}
        >
          <SettingsIcon className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </nav>

    </div>
  );
}

