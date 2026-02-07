import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import A1Data from "../data/json/A1.json";
import A2Data from "../data/json/A2.json";
import B1Data from "../data/json/B1.json";

const wordsData = {
  A1: A1Data,
  A2: A2Data,
  B1: B1Data,
};

export default function German() {
  const levels = Object.keys(wordsData || {});
  const [level, setLevel] = useState(levels[0] || "A1");
  const [mode, setMode] = useState("grid"); // 'play' or 'grid'
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [wordStatus, setWordStatus] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("german_word_status") || "{}");
    } catch {
      return {};
    }
  });
  const [statusFilter, setStatusFilter] = useState("all"); // all | pending | known | unknown
  const [marks, setMarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("german_marks") || "{}");
    } catch {
      return {};
    }
  });

  const timerRef = useRef(null);
  const list = wordsData[level] || [];
  const letterRefs = useRef({});
  const [fixedNav, setFixedNav] = useState(() => {
    try {
      // default to true (fixed navigation shown) if no saved preference
      const raw = localStorage.getItem("german_fixed_nav");
      return raw ? JSON.parse(raw) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("german_fixed_nav", JSON.stringify(!!fixedNav));
    } catch {}
  }, [fixedNav]);

  const [search, setSearch] = useState("");
  
  // 先根据搜索过滤
  const searchFiltered = (search && String(search).trim().length > 0)
    ? list.filter((it) => {
        const s = String(search).trim().toLowerCase();
        const text = String(it.text || "").toLowerCase();
        const meaning = String(it.meaningZh || it.meaning || "").toLowerCase();
        return text.includes(s) || meaning.includes(s);
      })
    : list;
  
  // 再根据状态筛选
  const displayList = statusFilter === "all" 
    ? searchFiltered
    : searchFiltered.filter(word => {
        const key = `${level}_${word.text}`;
        const status = wordStatus[key] || "pending";
        return status === statusFilter;
      });

  useEffect(() => {
    if (index >= displayList.length) setIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayList.length]);

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [level]);

  useEffect(() => {
    if (playing) startAutoPlay();
    return stopAutoPlay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index, level]);

  function startAutoPlay() {
    stopAutoPlay();
    playCurrent();
    timerRef.current = setInterval(() => {
      setIndex((i) => {
        const next = i + 1 < displayList.length ? i + 1 : 0;
        return next;
      });
    }, 3500);
  }

  function stopAutoPlay() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function togglePlay() {
    setPlaying((p) => !p);
  }

  function playCurrent() {
    const item = displayList[index];
    if (!item) return;
    
    // 构建音频文件路径
    const filename = safeFilename(item.text);
    const audioPath = `/src/data/audio/${level}/${filename}.mp3`;
    
    try {
      const a = new Audio(audioPath);
      a.play().catch(() => {
        // 如果音频加载失败，使用TTS
        if (window.speechSynthesis) {
          const u = new SpeechSynthesisUtterance(item.text);
          u.lang = "de-DE";
          u.rate = 0.85;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(u);
        }
      });
    } catch {
      // 出错时使用TTS
      if (window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(item.text);
        u.lang = "de-DE";
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      }
    }
  }

  function safeFilename(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\wäöüß-]/g, "_");
  }

  useEffect(() => {
    if (playing) playCurrent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function toggleMark(id) {
    const next = { ...(marks || {}) };
    if (next[id]) delete next[id];
    else next[id] = true;
    setMarks(next);
    localStorage.setItem("german_marks", JSON.stringify(next));
  }

  function markWordStatus(word, status) {
    if (!word || !word.text) return;
    const key = `${level}_${word.text}`;
    const newStatus = { ...wordStatus };
    
    if (status === "pending") {
      delete newStatus[key];
    } else {
      newStatus[key] = status;
    }
    
    setWordStatus(newStatus);
    localStorage.setItem("german_word_status", JSON.stringify(newStatus));
  }

  function getWordStatus(word) {
    if (!word || !word.text) return "pending";
    const key = `${level}_${word.text}`;
    return wordStatus[key] || "pending";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50 p-10">
      <motion.div
        className="max-w-6xl mx-auto mb-8"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-light text-gray-800 mb-2">德语学习</h1>
        <p className="text-gray-600">按级别选择词书，支持播放模式与平铺模式，支持标记生词（保存在 localStorage）</p>
      </motion.div>

        <div className="max-w-6xl mx-auto mb-6 flex gap-4 flex-wrap items-center">
        <label className="text-sm text-gray-700">级别：</label>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="border px-2 py-1 rounded">
          {levels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

          <div className="ml-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索单词或含义"
              className="border px-2 py-1 rounded w-48 text-sm"
            />
          </div>

        <div className="ml-4">
          <button
            onClick={() => setMode("play")}
            className={`px-3 py-1 rounded ${mode === "play" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-400"}`}
          >
            播放模式
          </button>
          <button
            onClick={() => setMode("grid")}
            className={`ml-2 px-3 py-1 rounded ${mode === "grid" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-400"}`}
          >
            平铺模式
          </button>
        </div>

        <div className="ml-4 flex items-center gap-2">
          <span className="text-sm text-gray-700">筛选:</span>
          {[
            { value: "all", label: "全部" },
            { value: "pending", label: "待学习" },
            { value: "known", label: "熟悉" },
            { value: "unknown", label: "不认识" }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => { setStatusFilter(filter.value); setIndex(0); }}
              className={`px-3 py-1 rounded text-sm ${statusFilter === filter.value ? "bg-green-600 text-white" : "bg-green-100 text-green-600"}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3 text-sm text-gray-600">
          <div>单词数：{displayList.length}</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {mode === "play" ? (
          <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIndex((i) => (i > 0 ? i - 1 : list.length - 1))}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  上一条
                </button>
                <button onClick={togglePlay} className="px-4 py-2 bg-blue-600 text-white rounded">
                  {playing ? "暂停" : "播放"}
                </button>
                <button
                  onClick={() => setIndex((i) => (i + 1 < list.length ? i + 1 : 0))}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  下一条
                </button>
              </div>
              <div className="text-sm text-gray-500">{level} · {index + 1}/{list.length}</div>
            </div>

            <div className="w-full max-w-2xl">
              {displayList[index] ? (
                <div className={`p-6 border rounded-lg shadow-sm transition-all duration-300 ${
                  getWordStatus(displayList[index]) === "known" 
                    ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300" 
                    : getWordStatus(displayList[index]) === "unknown"
                    ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300"
                    : "bg-white"
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-800">{displayList[index].text}</h3>
                      <div className="text-sm text-gray-500 mt-1">{displayList[index].phonetic}</div>
                      <div className="text-gray-600 mt-2">{displayList[index].meaningZh || displayList[index].meaning}</div>
                      {displayList[index].example && (
                        <div className="text-sm text-gray-500 mt-3">
                          <div>例句：{displayList[index].example}</div>
                          <div className="text-gray-400 mt-1">{displayList[index].exampleZh}</div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => markWordStatus(displayList[index], "known")}
                        className={`px-3 py-1 rounded text-sm ${
                          getWordStatus(displayList[index]) === "known" 
                            ? "bg-blue-500 text-white" 
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        }`}
                      >
                        熟悉
                      </button>
                      <button
                        onClick={() => markWordStatus(displayList[index], "unknown")}
                        className={`px-3 py-1 rounded text-sm ${
                          getWordStatus(displayList[index]) === "unknown" 
                            ? "bg-yellow-500 text-white" 
                            : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                        }`}
                      >
                        不认识
                      </button>
                      {getWordStatus(displayList[index]) !== "pending" && (
                        <button
                          onClick={() => markWordStatus(displayList[index], "pending")}
                          className="px-3 py-1 rounded text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                          重置
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const filename = safeFilename(displayList[index].text);
                          const audioPath = `/src/data/audio/${level}/${filename}.mp3`;
                          new Audio(audioPath).play().catch(() => {
                            // 音频失败时使用TTS
                            const u = new SpeechSynthesisUtterance(displayList[index].text);
                            u.lang = "de-DE";
                            u.rate = 0.85;
                            window.speechSynthesis.cancel();
                            window.speechSynthesis.speak(u);
                          });
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        发音
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">该级别暂无单词。</div>
              )}
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="md:pr-28 pr-4">
              {(() => {
                const groups = {};
                displayList.forEach((it) => {
                  const ch = (it.text && String(it.text).trim()[0]) || "#";
                  const letter = (ch || "#").toString().toUpperCase();
                  if (!/[A-ZÄÖÜß]/i.test(letter)) {
                    // non-letter bucket
                    const key = "#";
                    groups[key] = groups[key] || [];
                    groups[key].push(it);
                  } else {
                    groups[letter] = groups[letter] || [];
                    groups[letter].push(it);
                  }
                });

                const letters = Object.keys(groups).sort((a, b) => {
                  if (a === "#") return 1;
                  if (b === "#") return -1;
                  return a.localeCompare(b, "en", { sensitivity: "base" });
                });

                // For small screens show a horizontal, scrollable alphabet bar
                return (
                  <>
                    {!fixedNav && (
                      <div className="md:hidden mb-4">
                        <div className="flex gap-2 overflow-x-auto py-2">
                          {letters.map((l) => (
                            <button
                              key={l}
                              onClick={() => {
                                const el = letterRefs.current[l];
                                if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
                              }}
                              className="px-3 py-1 rounded-full bg-white border flex items-center justify-center text-sm text-gray-700 shadow hover:bg-blue-50"
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {letters.map((letter) => (
                      <div key={letter} className="mb-6">
                    <h2
                      ref={(el) => (letterRefs.current[letter] = el)}
                      className="text-xl font-semibold text-gray-700 mb-3"
                    >
                      {letter}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {groups[letter].map((it) => (
                        <div key={it.id} className={`p-4 rounded shadow flex flex-col transition-all duration-300 ${
                          getWordStatus(it) === "known" 
                            ? "bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300" 
                            : getWordStatus(it) === "unknown"
                            ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300"
                            : "bg-white"
                        }`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium">{it.text}</h3>
                              <div className="text-xs text-gray-500">{it.phonetic}</div>
                              <div className="text-sm text-gray-600 mt-1">{it.meaningZh || it.meaning}</div>
                              {it.example && (
                                <div className="text-xs text-gray-500 mt-2">
                                  <div>{it.example}</div>
                                  <div className="text-gray-400">{it.exampleZh}</div>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => markWordStatus(it, "known")}
                                className={`px-2 py-1 rounded text-xs ${
                                  getWordStatus(it) === "known" 
                                    ? "bg-blue-500 text-white" 
                                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                }`}
                              >
                                熟悉
                              </button>
                              <button
                                onClick={() => markWordStatus(it, "unknown")}
                                className={`px-2 py-1 rounded text-xs ${
                                  getWordStatus(it) === "unknown" 
                                    ? "bg-yellow-500 text-white" 
                                    : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                                }`}
                              >
                                不认识
                              </button>
                              {getWordStatus(it) !== "pending" && (
                                <button
                                  onClick={() => markWordStatus(it, "pending")}
                                  className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 hover:bg-gray-200"
                                >
                                  重置
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  const filename = safeFilename(it.text);
                                  const audioPath = `/src/data/audio/${level}/${filename}.mp3`;
                                  new Audio(audioPath).play().catch(() => {
                                    const u = new SpeechSynthesisUtterance(it.text);
                                    u.lang = "de-DE";
                                    u.rate = 0.85;
                                    window.speechSynthesis.cancel();
                                    window.speechSynthesis.speak(u);
                                  });
                                }}
                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                发音
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                      ))}
                    </>
                  );
                })()}
            </div>

            <div className={fixedNav ? `flex flex-col items-center gap-2 fixed right-3 top-20 z-40 bg-white/80 p-2 rounded-lg shadow-md` : `hidden md:flex flex-col items-center gap-2 absolute right-0 top-12`}>
              {(() => {
                const present = [];
                displayList.forEach((it) => {
                  const ch = (it.text && String(it.text).trim()[0]) || "#";
                  const letter = (ch || "#").toString().toUpperCase();
                  if (!/[A-ZÄÖÜß]/i.test(letter)) present.push("#");
                  else present.push(letter);
                });
                const letters = Array.from(new Set(present)).sort((a, b) => {
                  if (a === "#") return 1;
                  if (b === "#") return -1;
                  return a.localeCompare(b, "en", { sensitivity: "base" });
                });

                return letters.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      const el = letterRefs.current[l];
                      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-sm text-gray-700 shadow hover:bg-blue-50"
                  >
                    {l}
                  </button>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
