import type { AudioFile } from "@/lib/db";

interface StemListProps {
  stems: AudioFile[];
  onRemove: (id: number) => void;
}

export const StemList = (props: StemListProps) => {
  const { stems, onRemove } = props;

  if (stems.length < 1)
    return <div style={{ textAlign: "center" }}>Add at least one stem</div>;

  return (
    <ul className="stem-list">
      {stems.map((stem) => (
        <li className="stem-item" key={stem.id}>
          <span>{stem.name}</span>
          <button onClick={() => onRemove(stem.id)}>X</button>
        </li>
      ))}
    </ul>
  );
};
