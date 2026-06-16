import React, { useRef, useState, useEffect } from "react";
import PoseTracker, { EXERCISES } from "./PoseTracker.jsx";

export default function App() {
  const [exercise, setExercise] = useState("squat");
  const [feedback, setFeedback] = useState(
    "Move for a few seconds, then hit \"Get AI feedback\" to see how the analysis works."
  );
  const [loading, setLoading] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const trackerRef = useRef(null);

  // Poll rep count from the tracker every 200ms
  useEffect(() => {
    const id = setInterval(() => {
      const count = trackerRef.current?.getRepCount?.() ?? 0;
      setRepCount(count);
    }, 200);
    return () => clearInterval(id);
  }, []);

  async function getFeedback() {
    const summary = trackerRef.current?.getSummary();
    if (!summary) {
      setFeedback("Not enough movement data yet — make sure your full body is visible and move around a bit first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/analyze-pose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(summary),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFeedback(data.feedback);
    } catch (err) {
      setFeedback(
        "Couldn't reach the backend. Make sure the Flask server is running on port 5000 and your API key is set."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 gap-6">
      <header className="text-center max-w-xl">
        <h1 className="font-[var(--font-display)] text-3xl tracking-tight">FormFix</h1>
        <p className="text-sm text-[var(--color-text)]/60 mt-1">
          Real-time form coaching from your webcam.
        </p>
      </header>

      <div className="flex gap-2">
        {Object.entries(EXERCISES).map(([key, ex]) => (
          <button
            key={key}
            onClick={() => setExercise(key)}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${
              exercise === key
                ? "bg-[var(--color-accent)] text-black border-[var(--color-accent)]"
                : "border-[var(--color-line)] text-[var(--color-text)]/70"
            }`}
          >
            {ex.label}
          </button>
        ))}
      </div>

      <PoseTracker ref={trackerRef} exercise={exercise} />

      <div className="flex items-center gap-2 text-sm">
        <span className="text-[var(--color-ink)]/50">Reps:</span>
        <span className="font-[var(--font-display)] text-2xl text-[var(--color-accent)]">{repCount}</span>
      </div>

      <button
        onClick={getFeedback}
        disabled={loading}
        className="rounded-xl bg-[var(--color-warn)] text-black font-medium px-6 py-2 text-sm disabled:opacity-50"
      >
        {loading ? "Analyzing…" : "Get AI feedback"}
      </button>

      <div className="max-w-xl w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] px-5 py-4 text-sm leading-relaxed">
        {feedback}
      </div>
    </div>
  );
}
