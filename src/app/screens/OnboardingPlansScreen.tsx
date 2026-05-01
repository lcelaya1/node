import OnboardingPlans from "../../imports/Onboarding1-2/Onboarding1-99-116";

type Props = { onNext: () => void };

export default function OnboardingPlansScreen({ onNext }: Props) {
  return (
    <div className="size-full" onClick={(e) => {
      if ((e.target as HTMLElement).closest('[data-name="Button"]')) {
        onNext();
      }
    }}>
      <OnboardingPlans />
    </div>
  );
}
