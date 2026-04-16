"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import "./coderacer.css";

function CodeRacer() {
  const playerCodeRef = useRef<HTMLTextAreaElement>(null);
  const opponentCodeRef = useRef<HTMLTextAreaElement>(null);
  const [playerWpm, setPlayerWpm] = useState(0);
  const [oppWpm, setOppWpm] = useState(0);
  const [playerProgress, setPlayerProgress] = useState("0/4");
  const [oppProgress, setOppProgress] = useState("1/4");
  const [logs, setLogs] = useState(["Race started! GLHF!"]);

  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    const init = async () => {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/javascript/javascript.min.js");

      const CM = (window as any).CodeMirror;
      if (!CM) return;

      const playerCM = CM.fromTextArea(playerCodeRef.current, {
        mode: "javascript",
        theme: "dracula",
        lineNumbers: true,
      });

      const opponentCM = CM.fromTextArea(opponentCodeRef.current, {
        mode: "javascript",
        theme: "dracula",
        lineNumbers: true,
        readOnly: "nocursor",
      });

      // Simulation logic
      let keys = 0;
      let startTime = Date.now();

      playerCM.on("change", () => {
        keys++;
        const elapsed = (Date.now() - startTime) / 60000;
        setPlayerWpm(Math.floor((keys / 5) / elapsed) || 0);
      });

      const interval = setInterval(() => {
        setOppWpm(60 + Math.floor(Math.random() * 20));
      }, 2000);

      return () => clearInterval(interval);
    };

    init();
  }, []);

  return (
    <div className="racer-body min-h-screen">
      <header className="top-nav">
        <div className="text-2xl font-black text-indigo-500">🏁 CodeRacer</div>
        <div className="flex gap-6 items-center">
            <span className="text-yellow-500 font-bold">15:00</span>
            <span className="text-gray-400">Hard: Two Sum IV</span>
        </div>
        <div className="font-bold">Diamond I 💎</div>
      </header>

      <main className="arena">
        <section className="panel gamified-race">
          <div className="p-4 border-b border-white/5 flex justify-between">
             <h3 className="font-bold uppercase text-xs tracking-widest text-indigo-400">Live Track</h3>
             <div className="text-xs font-mono">{playerWpm} WPM | {oppWpm} WPM</div>
          </div>
          
          <div className="track-container flex-1 relative">
             <div className="finish-line"></div>
             {/* Player Car */}
             <div className="car" style={{ left: '70%', bottom: `${20 + (playerWpm * 2)}px` }}>
                <span className="car-label text-accent">You</span>
                🏎️
             </div>
             {/* Opponent Car */}
             <div className="car" style={{ left: '30%', bottom: `${20 + (oppWpm * 2)}px`, opacity: 0.6 }}>
                <span className="car-label text-gray-400">Guest_99</span>
                🚔
             </div>
          </div>

          <div className="p-4 bg-black/20 text-xs font-mono h-32 overflow-y-auto">
             {logs.map((log, i) => <div key={i}>{`> ${log}`}</div>)}
          </div>
        </section>

        <section className="coding-arena">
           <div className="editor-container">
              <div className="p-2 bg-black/40 text-xs flex justify-between">
                 <span className="text-indigo-400 font-bold">Enemy: Guest_99</span>
                 <span className="text-gray-500 font-bold">{oppProgress} Tests</span>
              </div>
              <textarea ref={opponentCodeRef}></textarea>
           </div>

           <div className="editor-container">
              <div className="p-2 bg-black/40 text-xs flex justify-between">
                 <span className="text-pink-500 font-bold">You</span>
                 <span className="text-orange-400 font-bold">{playerProgress} Tests</span>
              </div>
              <textarea ref={playerCodeRef} defaultValue={"function twoSum(nums, target) {\n\n}"}></textarea>
           </div>
        </section>
      </main>
    </div>
  );
}

export default function AssignmentPage() {
    return (
        <Suspense fallback={<div>Loading Arena...</div>}>
            <CodeRacer />
        </Suspense>
    )
}
