import { IconButton } from "./IconButton";

type CreateAccountBackButtonProps = {
  onClick?: () => void;
};

export function CreateAccountBackButton({
  onClick,
}: CreateAccountBackButtonProps) {
  return (
    <div className="flex w-full">
      <IconButton
        icon="Left"
        hierarchy="Link"
        size="Large"
        onClick={onClick}
        aria-label="Go back"
        className="-ml-[10px]"
      />
    </div>
  );
}
