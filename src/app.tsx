import { useCallback, useEffect, useReducer, useState } from "react";
import { appReducer, initialAppState } from "@/reducer";
import { EQ_NOVICE_FREQS, RESULT_TIMEOUT } from "@/utils/constants";
import { db } from "@/lib/db";
import { EqualizerEffect } from "@/lib/audio/effects/equalizer";
import { StartView } from "@/views/start-view";
import { QuizView } from "@/views/quiz-view";
import { ResultView } from "@/views/result-view";
import { AudioLoader } from "@/lib/audio/audio-loader";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useAudioContext } from "@/context/audio-context";

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

    const freqIdx = Math.floor(Math.random() * EQ_NOVICE_FREQS.length);
    const frequency = EQ_NOVICE_FREQS[freqIdx];

    audioPlayer.configureEffect({ frequency });

    const bufferIdx = Math.floor(Math.random() * currentBuffers.length);
    audioPlayer.play(currentBuffers[bufferIdx]);

    dispatch({ type: "START_ROUND", targetFreq: frequency });
  }, [audioBuffers, audioCtx, audioPlayer]);

  const handleSubmit = (freq: number) => {
    audioPlayer.stop();
    dispatch({ type: "SUBMIT", userFreq: freq });
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

  return (
    <div className="app">
      {phase === "init" && <StartView onStart={handleStartRound} />}
      {phase === "quiz" && (
        <QuizView
          onEqToggle={audioPlayer.toggleEffect}
          onSubmit={handleSubmit}
        />
      )}
      {phase === "result" && targetFreq !== null && (
        <ResultView targetFreq={targetFreq} userFreq={userFreq} />
      )}
    </div>
  );
};
