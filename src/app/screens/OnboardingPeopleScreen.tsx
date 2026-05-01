import Onboarding2Content from "../../imports/Onboarding2-1/Onboarding2-93-2060";

type Props = { onNext: () => void };

export default function OnboardingPeopleScreen({ onNext }: Props) {
  return (
    <div className="size-full" onClick={(e) => {
      if ((e.target as HTMLElement).closest('[data-name="Button"]')) {
        onNext();
      }
    }}>
      <Onboarding2Content />
    </div>
  );
}
