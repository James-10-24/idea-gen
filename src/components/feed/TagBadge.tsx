interface TagBadgeProps {
  label: string;
  colorClass: string;
}

export default function TagBadge({ label, colorClass }: TagBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${colorClass}`}
    >
      {label}
    </span>
  );
}
