"use client";

/**
 * Shows what the user could do next with unlimited access.
 * Placed after finalization to reinforce ongoing value.
 */
export default function FutureValuePreview() {
  return (
    <div className="mt-5 animate-in-fast rounded-2xl bg-zinc-50 px-4 py-4">
      <h4 className="text-[13px] font-semibold text-zinc-700">
        What you can do next
      </h4>
      <ul className="mt-2.5 space-y-2">
        {[
          { icon: "✍️", text: "Turn another idea into a post tomorrow" },
          { icon: "📨", text: "Draft 3 outreach messages in 10 minutes" },
          { icon: "🧪", text: "Validate a new idea before building it" },
        ].map((item) => (
          <li key={item.text} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white text-[11px] shadow-sm">
              {item.icon}
            </span>
            <span className="text-[13px] leading-[1.4] text-zinc-500">
              {item.text}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-zinc-400">
        This becomes a weekly habit — not a one-time tool.
      </p>
    </div>
  );
}
