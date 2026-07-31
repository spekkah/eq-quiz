import { calculateDifferenceInCents } from "@/utils/math";

interface ResultViewProps {
  targetFreq: number;
  userFreq: number;
}

export const ResultView = (props: ResultViewProps) => {
  const { targetFreq, userFreq } = props;

  const cents = calculateDifferenceInCents(targetFreq, userFreq);
  const semitones = cents / 100;
  const errorValue = !isNaN(semitones) ? semitones.toFixed(1) : "N/A";

  return (
    <div>
      <dl>
        <dt>Target Freq:</dt>
        <dd>{targetFreq} Hz</dd>

        <dt>Your Guess:</dt>
        <dd>{userFreq} Hz</dd>

        <dt>Error:</dt>
        <dd>{errorValue} st</dd>
      </dl>
    </div>
  );
};
