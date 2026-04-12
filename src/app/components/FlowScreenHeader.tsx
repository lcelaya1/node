import { IconButton } from "./IconButton";

type FlowScreenHeaderProps = {
  onBack: () => void;
  onSkip: () => void;
};

export function FlowScreenHeader({ onBack, onSkip }: FlowScreenHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <IconButton
        icon="Left"
        hierarchy="Link"
        size="Large"
        onClick={onBack}
        aria-label="Back"
        className="-ml-[10px]"
      />

      <button
        type="button"
        onClick={onSkip}
        className="type-body-s text-secondary-token"
      >
        Skip
      </button>
    </div>
  );
}
