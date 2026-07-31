import { useState, type ChangeEvent } from "react";
import { DEFAULT_USER_FREQ, FREQ_MAX, FREQ_MIN } from "@/utils/constants";
import { linearToLog, logToLinear } from "@/utils/math";

const defaultUserFreqLinear = logToLinear(
  DEFAULT_USER_FREQ,
  FREQ_MIN,
  FREQ_MAX,
);

interface QuizViewProps {
  onEqToggle: (isEnabled: boolean) => void;
  onSubmit: (formData: FormData) => void;
}

export const QuizView = (props: QuizViewProps) => {
  const { onEqToggle, onSubmit } = props;

  const [userFreq, setUserFreq] = useState(DEFAULT_USER_FREQ);

  const handleFreqChange = (e: ChangeEvent<HTMLInputElement>) => {
    const linearValue = Number(e.target.value);
    const logValue = linearToLog(linearValue, FREQ_MIN, FREQ_MAX);

    setUserFreq(Math.round(logValue));
  };

  const handleEqToggle = (e: ChangeEvent<HTMLInputElement>) => {
    onEqToggle(e.target.checked);
  };

  return (
    <form action={onSubmit} style={{ width: 512 }}>
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Freq</span>
          <span>{userFreq} Hz</span>
        </div>
        <input
          style={{ width: "100%" }}
          name="userFreq"
          type="range"
          min={0}
          max={1}
          step={0.000001}
          defaultValue={defaultUserFreqLinear}
          onChange={handleFreqChange}
        />
      </div>
      <input type="checkbox" onChange={handleEqToggle} defaultChecked />
      <input type="submit" />
    </form>
  );
};
