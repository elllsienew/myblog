import { useState, useEffect, useRef } from "react";
import A1Data from "../data/json/A1.json";
import A2Data from "../data/json/A2.json";
import B1Data from "../data/json/B1.json";

const wordsData = {
  A1: A1Data,
  A2: A2Data,
  B1: B1Data,
};

export default function GermanPlayer() {
  const [started, setStarted] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("A1");
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingIndex, setPendingIndex] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const slideTimeoutRef = useRef(null);

  const BASE_INTERVAL = 2500;
  const INTERVAL = BASE_INTERVAL / playbackSpeed;
  const START_DELAY = 3000;

  // 获取当前等级的单词列表
  const words = wordsData[selectedLevel] || [];
  const currentWord = words[currentIndex] || {};

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (slideTimeoutRef.current) {
        clearTimeout(slideTimeoutRef.current);
        slideTimeoutRef.current = null;
      }
    };
  }, []);

  const playAudio = () => {
    // 使用本地音频文件
    if (audioRef.current && currentWord.text) {
      const filename = safeFilename(currentWord.text);
      audioRef.current.src = `/src/data/audio/${selectedLevel}/${filename}.mp3`;
      audioRef.current.play().catch(() => {
        // iOS/Safari需要用户交互才能播放，忽略错误
      });
    }
  };

  const safeFilename = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\wäöüß-]/g, "_");
  };

  const showWord = () => {
    playAudio();
  };

  // 从指定索引开始播放（清理定时器并重启循环）
  const startFromIndex = (index) => {
    if (!words || words.length === 0) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (slideTimeoutRef.current) {
      clearTimeout(slideTimeoutRef.current);
      slideTimeoutRef.current = null;
    }
    // 设置为待播放索引，但不自动开始播放（保持静止），等待用户点击开始
    setCurrentIndex(index);
    setPendingIndex(index);
    setStarted(false);
  };

  const findMatchIndex = (query) => {
    if (!query) return -1;
    const q = query.trim().toLowerCase();
    if (!q || !words || words.length === 0) return -1;
    const len = words.length;
    for (let i = 0; i < len; i++) {
      const idx = (currentIndex + i) % len;
      const w = words[idx] || {};
      const text = (w.text || "").toLowerCase();
      const meaning = ((w.meaningZh || w.meaning) || "").toLowerCase();
      if (text.includes(q) || meaning.includes(q)) return idx;
    }
    return -1;
  };

  const handleSearchSubmit = () => {
    if (!searchQuery) return;
    const idx = findMatchIndex(searchQuery);
    if (idx === -1) {
      // 简单反馈：未找到
      // 这里不直接用 alert，保留为 console 信息，UI 提示可后续添加
      console.info("未找到匹配项: ", searchQuery);
      return;
    }
    startFromIndex(idx);
  };

  const nextWord = () => {
    setIsSliding(true);
    if (slideTimeoutRef.current) {
      clearTimeout(slideTimeoutRef.current);
      slideTimeoutRef.current = null;
    }
    slideTimeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
      setIsSliding(false);
      slideTimeoutRef.current = null;
    }, 600);
  };

  const handleStart = () => {
    if (started || words.length === 0) return;
    
    setPreparing(true);
    
    setTimeout(() => {
      setStarted(true);
      setPreparing(false);
      // 如果存在 pendingIndex（来自搜索），则从该索引开始播放；否则保持当前索引（用于暂停后继续）
      if (pendingIndex !== null) {
        setCurrentIndex(pendingIndex);
      }
      setPendingIndex(null);
      
      // 立即显示第一个单词
      setTimeout(showWord, 100);
      
      // 开始定时切换
      timerRef.current = setInterval(nextWord, INTERVAL);
    }, START_DELAY);
  };

  const handleStop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (slideTimeoutRef.current) {
      clearTimeout(slideTimeoutRef.current);
      slideTimeoutRef.current = null;
    }
    setStarted(false);
  };

  const handleSpeedChange = (newSpeed) => {
    setPlaybackSpeed(newSpeed);
    // 如果正在播放，重启定时器以应用新的间隔
    if (started && timerRef.current) {
      clearInterval(timerRef.current);
      const newInterval = BASE_INTERVAL / newSpeed;
      timerRef.current = setInterval(nextWord, newInterval);
    }
  };

  // 当单词切换时播放音频
  useEffect(() => {
    if (started) {
      showWord();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, started]);

  // 切换等级时重置状态
  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    setStarted(false);
    setPreparing(false);
    setCurrentIndex(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (slideTimeoutRef.current) {
      clearTimeout(slideTimeoutRef.current);
      slideTimeoutRef.current = null;
    }
    setPendingIndex(null);
  };

  return (
    <div className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center">
      <audio ref={audioRef} preload="auto"></audio>

      {/* 顶部控件：等级选择 + 搜索（响应式） */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-full max-w-xl px-4 z-50">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          <div className="flex gap-3">
            {Object.keys(wordsData).map((level) => (
              <button
                key={level}
                onClick={() => handleLevelChange(level)}
                className={`px-4 py-2 rounded-full text-sm font-light transition ${
                  selectedLevel === level
                    ? "bg-white text-black"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
              placeholder="搜索单词"
              aria-label="搜索单词"
              className="w-full md:w-26 px-3 py-2 rounded bg-white text-black text-sm"
            />
            <button
              onClick={handleSearchSubmit}
              className="px-3 py-2 rounded bg-white text-black text-sm"
            >
              搜索
            </button>
            <button
              onClick={() => setSearchQuery("")}
              className="px-2 py-2 rounded bg-gray-800 text-white text-sm"
            >
              清除
            </button>
          </div>
        </div>

        {/* 播放速度控制 */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-white text-sm">播放速度:</span>
          {[0.5, 0.75, 1.0, 1.5, 2.0].map((speed) => (
            <button
              key={speed}
              onClick={() => handleSpeedChange(speed)}
              className={`px-3 py-1 rounded text-xs transition ${
                playbackSpeed === speed
                  ? "bg-white text-black"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Apple Watch 风格的卡片 */}
      <div className="relative mt-20 w-[360px] h-[640px] rounded-[40px] bg-black shadow-[0_0_40px_rgba(255,255,255,0.15)] overflow-hidden">
        <div
          className={`absolute inset-0 flex flex-col justify-center items-center text-white text-center px-5 transition-all duration-600 ${
            isSliding ? "translate-y-[-40px] opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          <div className="text-[44px] font-semibold mb-2">
            {currentWord.text || "Loading…"}
          </div>
          <div className="text-lg opacity-60 mb-4">
            {currentWord.phonetic || ""}
          </div>
          <div className="text-xl opacity-85">
            {currentWord.meaningZh || currentWord.meaning || ""}
          </div>
        </div>
      </div>

      {/* 开始/停止 按钮 */}
      <div className="fixed bottom-10 z-50">
        <button
          onClick={started ? handleStop : handleStart}
          disabled={preparing || words.length === 0}
          className="text-lg px-8 py-3 rounded-full border-0 bg-white text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {preparing ? "准备中…" : words.length === 0 ? "无数据" : started ? "停止" : "开始"}
        </button>
      </div>

      <style jsx>{`
        .duration-600 {
          transition-duration: 600ms;
        }
      `}</style>
    </div>
  );
}
