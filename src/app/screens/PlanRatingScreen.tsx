import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { IconButton } from "../components/IconButton";

const ratingLabels = [
  "Terrible",
  "Not great",
  "It was okay",
  "Pretty good",
  "Amazing!",
];

const ratingEmojis = ["🥱", "😐", "🙂", "😁", "😍"];

function InfoContent() {
  return (
    <div className="flex w-full flex-col items-start gap-[8px]">
      <p className="w-full font-primary text-[24px] leading-[28px] text-primary-token">
        Did we nail it?
      </p>
      <p className="w-full type-body-s text-secondary-token">
        Tell us if this plan matched your vibe so we can keep finding the perfect spots for you.
      </p>
    </div>
  );
}

export default function PlanRatingScreen() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(2);
  const [feedback, setFeedback] = useState("");

  const progressWidth = useMemo(() => `${((rating + 1) / 5) * 100}%`, [rating]);
  const emojiStep = 72;
  const trackTranslate = `calc(50% - ${emojiStep / 2}px - ${rating * emojiStep}px)`;

  return (
    <div className="flex size-full flex-col gap-[36px] bg-surface-primary px-[20px] pb-[16px] pt-[32px]">
      <div className="flex items-center justify-between">
        <IconButton
          icon="Left"
          hierarchy="Link"
          size="Large"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="-ml-[10px]"
        />

        <button
          type="button"
          onClick={() => navigate("/", { replace: true })}
          className="type-body-s text-secondary-token"
        >
          Skip
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-start justify-center">
        <div className="flex w-full flex-col items-center gap-[24px]">
          <InfoContent />

          <div className="relative w-full overflow-hidden py-[8px]">
            <div
              className="flex items-end transition-transform duration-300 ease-out"
              style={{ transform: `translateX(${trackTranslate})` }}
            >
              {ratingEmojis.map((emoji, index) => {
                const isActive = rating === index;
                const signedDistance = index - rating;
                const distance = Math.abs(signedDistance);
                const rotate = isActive ? 0 : signedDistance < 0 ? -10 : 10;

                return (
                  <div
                    key={emoji}
                    className="flex w-[72px] shrink-0 items-center justify-center"
                  >
                    <span
                      className="leading-none transition-all duration-300 ease-out"
                      style={{
                        filter: isActive ? "none" : "grayscale(1)",
                        fontSize: isActive ? "72px" : distance === 1 ? "52px" : "40px",
                        opacity: isActive ? 1 : distance === 1 ? 0.58 : 0.22,
                        transform: `translateY(${isActive ? "0px" : distance === 1 ? "12px" : "24px"}) rotate(${rotate}deg) scale(${isActive ? 1 : distance === 1 ? 0.94 : 0.82})`,
                      }}
                    >
                      {emoji}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[999px] border border-card-token px-[16px] py-[8px]">
            <p className="text-[12px] leading-[16px] text-primary-token">{ratingLabels[rating]}</p>
          </div>

          <div className="relative w-full pt-[9px]">
            <div className="h-[8px] w-full rounded-[999px] bg-surface-secondary" />
            <div
              className="absolute left-0 top-[9px] h-[8px] rounded-[999px] bg-button-secondary transition-all duration-300"
              style={{ width: progressWidth }}
            />
            <div
              className="absolute top-0 size-[26px] -translate-x-1/2 rounded-full border border-card-token bg-surface-primary transition-all duration-300"
              style={{ left: progressWidth }}
            />
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="absolute inset-0 z-10 h-[26px] w-full cursor-pointer opacity-0"
              aria-label="Rate the plan"
            />
          </div>

          <div className="flex w-full flex-col items-start gap-[8px]">
            <div className="flex items-start gap-[4px]">
              <p className="type-body-s text-primary-token">What could have been better?</p>
              <p className="type-body-s text-secondary-token">(Optional)</p>
            </div>

            <div className="h-[92px] w-full rounded-[12px] bg-[#f3f3f3] p-[12px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
              <textarea
                className="size-full resize-none bg-transparent text-[14px] leading-[18px] text-primary-token outline-none placeholder:text-[#9a9a9a]"
                placeholder="Feedback..."
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/", { replace: true })}
        className="flex h-[45px] w-full items-center justify-center rounded-[999px] bg-button-primary"
      >
        <span className="type-body-m text-invert-token">Submit</span>
      </button>
    </div>
  );
}
