import BranchInsightCard, { type BranchInsight } from "./BranchInsightCard";

interface Props {
  data: BranchInsight[];
  onBranchClick: (branchId: string) => void;
}

export default function BOZCardGrid({ data, onBranchClick }: Props) {
  if (data.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((branch) => (
        <BranchInsightCard key={branch.branchId} data={branch} onClick={onBranchClick} />
      ))}
    </div>
  );
}
