const stages = ["Land Purchased", "Foundation", "Structure", "Interior", "Listed", "Sold"];

export function PropertyTimeline({
  currentStage,
  timeline
}: {
  currentStage: string;
  timeline?: Array<{ stage: string; date: string; note?: string }>;
}) {
  const currentIndex = stages.findIndex((stage) => stage.toLowerCase() === currentStage.toLowerCase());

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => {
        const active = index <= (currentIndex === -1 ? 0 : currentIndex);
        const entry = timeline?.find((item) => item.stage.toLowerCase() === stage.toLowerCase());

        return (
          <div key={stage} className="flex items-start gap-3">
            <div
              className={`mt-1 h-3 w-3 rounded-full ${
                active ? "bg-brand-gold shadow-[0_0_20px_rgba(212,168,67,0.6)]" : "bg-slate-600"
              }`}
            />
            <div>
              <p className={`font-medium ${active ? "text-white" : "text-slate-400"}`}>{stage}</p>
              {entry?.date && <p className="text-xs text-slate-500">{new Date(entry.date).toLocaleDateString()}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
