import Onboarding4Content from "../../imports/Onboarding4-1/Onboarding4-93-2081";

type Props = { onNext: () => void };

export default function OnboardingMemoriesScreen({ onNext }: Props) {
  return (
    <div className="size-full" onClick={(e) => {
      if ((e.target as HTMLElement).closest('[data-name="Button"]')) {
        onNext();
      }
    }}>
      <Onboarding4Content />
    </div>
  );
}
