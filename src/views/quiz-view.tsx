import { type ChangeEvent } from "react";
import { EQ_NOVICE_FREQS } from "@/utils/constants";

interface QuizViewProps {
  onEqToggle: (isEnabled: boolean) => void;
  onSubmit: (freq: number) => void;
}

export const QuizView = (props: QuizViewProps) => {
  const { onEqToggle, onSubmit } = props;

  const handleEqToggle = (e: ChangeEvent<HTMLInputElement>) => {
    onEqToggle(e.target.checked);
  };

  return (
    <div className="quiz-view">
      <div className="freq-btn-group">
        {EQ_NOVICE_FREQS.map((freq) => (
          <button
            className="freq-btn"
            key={freq}
            onClick={() => onSubmit(freq)}
          >
            {freq}
          </button>
        ))}
      </div>
      <label>
        EQ On/Off
        <input type="checkbox" onChange={handleEqToggle} defaultChecked />
      </label>
    </div>
  );
};
