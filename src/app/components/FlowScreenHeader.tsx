import { IconButton } from "./IconButton";

type FlowScreenHeaderProps = {
  onBack: () => void;
  /** If omitted, the Skip action is hidden (standalone entrypoints). */
  onSkip?: () => void;
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

      {onSkip ? (
        <button
          type="button"
          onClick={onSkip}
          className="type-body-s text-secondary-token"
        >
          Skip
        </button>
      ) : null}
    </div>
  );
}
