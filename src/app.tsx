import { useEffect, useReducer, useRef } from "react";
import { appReducer, initialAppState } from "@/reducer";
import { AudioEngine } from "@/lib/audio-engine";
import { db } from "@/lib/db";
import { linearToLog } from "@/utils/math";
import { StartView } from "@/views/start-view";
import { QuizView } from "@/views/quiz-view";
import { ResultView } from "@/views/result-view";
import { FREQ_MAX, FREQ_MIN, RESULT_TIMEOUT } from "@/utils/constants";

export const App = () => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const { phase, targetFreq, userFreq } = state;

  const audioEngineRef = useRef<AudioEngine>(null);
  if (!audioEngineRef.current) audioEngineRef.current = new AudioEngine();

  const handleStartRound = async () => {
    if (phase === "init") {
      const files = await db.audioFiles.toArray();

      const arrayBuffers = await Promise.all(
        files.map((file) => file.blob.arrayBuffer()),
      );

      await audioEngineRef.current?.loadAudio(arrayBuffers);
    }

    const freq = audioEngineRef.current?.startRound();
    if (!freq) return;

    dispatch({ type: "START_ROUND", targetFreq: freq });
  };

  const handleEqToggle = (isEnabled: boolean) => {
    audioEngineRef.current?.toggleEQ(isEnabled);
  };

  const handleSubmit = (formData: FormData) => {
    const userFreqLinear = formData.get("userFreq");
    if (!userFreqLinear) throw new Error("Error getting user frequency value");

    const userFreqLog = linearToLog(Number(userFreqLinear), FREQ_MIN, FREQ_MAX);
    dispatch({ type: "SUBMIT", userFreq: Math.round(userFreqLog) });

    audioEngineRef.current?.stopAudio();
  };

  useEffect(() => {
    if (phase !== "result") return;

    const timerId = setTimeout(() => {
      handleStartRound();
    }, RESULT_TIMEOUT);

    return () => {
      clearTimeout(timerId);
    };
  }, [phase]);

  if (phase === "init") return <StartView onStart={handleStartRound} />;

  if (phase === "quiz")
    return <QuizView onEqToggle={handleEqToggle} onSubmit={handleSubmit} />;

  if (phase === "result" && targetFreq !== null)
    return <ResultView targetFreq={targetFreq} userFreq={userFreq} />;

  return null;
};
