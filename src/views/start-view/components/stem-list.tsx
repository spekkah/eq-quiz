import type { AudioFile } from "@/lib/db";

interface StemListProps {
  stems: AudioFile[];
  onRemove: (id: number) => void;
}

export const StemList = (props: StemListProps) => {
  const { stems, onRemove } = props;

  if (stems.length < 1) return <div>Add at least one stem</div>;

  return (
    <ul>
      {stems.map((stem) => (
        <li key={stem.id}>
          <button onClick={() => onRemove(stem.id)}>X</button>
          <span>{stem.name}</span>
        </li>
      ))}
    </ul>
  );
};
