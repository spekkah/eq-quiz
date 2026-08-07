import { useCallback, useEffect, useReducer, useState } from "react";
import { appReducer, initialAppState } from "@/reducer";
import { FREQ_MAX, FREQ_MIN, RESULT_TIMEOUT } from "@/utils/constants";
import { linearToLog } from "@/utils/math";
import { db } from "@/lib/db";
import { EqualizerEffect } from "@/lib/audio/effects/equalizer";
import { StartView } from "@/views/start-view";
import { QuizView } from "@/views/quiz-view";
import { ResultView } from "@/views/result-view";
import { AudioLoader } from "@/lib/audio/audio-loader";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useAudioContext } from "@/context/audio-context";

const NOVICE_FREQS = [50, 100, 250, 500, 1000, 2500, 5000, 10000];

const createEqualizerEffect = (ctx: AudioContext): EqualizerEffect => {
  return new EqualizerEffect(ctx);
};

export const App = () => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const { phase, targetFreq, userFreq } = state;

  const [audioBuffers, setAudioBuffers] = useState<AudioBuffer[]>([]);

  const audioCtx = useAudioContext();
  const audioPlayer = useAudioPlayer(audioCtx, createEqualizerEffect);

  const handleStartRound = useCallback(async () => {
    if (audioCtx.state !== "running") await audioCtx.resume();

    let currentBuffers = audioBuffers;

    if (currentBuffers.length < 1) {
      const loader = new AudioLoader(audioCtx);

      const files = await db.audioFiles.toArray();
      const arrayBuffers = await Promise.all(
        files.map((file) => file.blob.arrayBuffer()),
      );

      currentBuffers = await loader.loadAudio(arrayBuffers);
      setAudioBuffers(currentBuffers);
    }

    const freqIdx = Math.floor(Math.random() * NOVICE_FREQS.length);
    const frequency = NOVICE_FREQS[freqIdx];

    audioPlayer.configureEffect({ frequency });

    const bufferIdx = Math.floor(Math.random() * currentBuffers.length);
    audioPlayer.play(currentBuffers[bufferIdx]);

    dispatch({ type: "START_ROUND", targetFreq: frequency });
  }, [audioBuffers, audioCtx, audioPlayer]);

  const handleSubmit = (formData: FormData) => {
    audioPlayer.stop();

    const userFreqLinear = formData.get("userFreq");
    if (!userFreqLinear) throw new Error("Error getting user frequency value");

    const userFreqLog = linearToLog(Number(userFreqLinear), FREQ_MIN, FREQ_MAX);
    dispatch({ type: "SUBMIT", userFreq: Math.round(userFreqLog) });
  };

  useEffect(() => {
    if (phase !== "result") return;

    const timerId = setTimeout(async () => {
      await handleStartRound();
    }, RESULT_TIMEOUT);

    return () => {
      clearTimeout(timerId);
    };
  }, [phase, handleStartRound]);

  if (phase === "init") return <StartView onStart={handleStartRound} />;

  if (phase === "quiz")
    return (
      <QuizView onEqToggle={audioPlayer.toggleEffect} onSubmit={handleSubmit} />
    );

  if (phase === "result" && targetFreq !== null)
    return <ResultView targetFreq={targetFreq} userFreq={userFreq} />;

  return null;
};
