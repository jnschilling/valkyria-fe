// src/components/reunions/ReunionNavigator.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ExtendedMeetings } from "../ReunionPage"; // Import if needed, or pass as prop

interface ReunionNavigatorProps {
  currentIndex: number;
  total: number;
  currentLabel: string;
  onPrevious: () => void;
  onNext: () => void;
}

function ReunionNavigator({
  currentIndex,
  total,
  currentLabel,
  onPrevious,
  onNext,
}: ReunionNavigatorProps) {
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-gray-100 rounded-lg">
      <button
        onClick={onPrevious}
        disabled={total <= 1}
        className="p-2 rounded-full bg-white shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <span className="text-lg font-semibold">
        Réunion {currentIndex + 1} / {total} - {currentLabel}
      </span>
      <button
        onClick={onNext}
        disabled={total <= 1}
        className="p-2 rounded-full bg-white shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export default ReunionNavigator;
