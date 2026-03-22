import { useState, useEffect } from "react";

type InputModalProps = {
  open: boolean;
  onClose: () => void;
  type: "title" | "description" | "location";
  step: number;
  onSave?: (value: string) => void;
};

export function InputModal({ open, onClose, type, step, onSave }: InputModalProps) {
  const [value, setValue] = useState("");

  const config = {
    title: {
      label: "Add the Plan Title",
      placeholder: "Walk around the beach",
    },
    description: {
      label: "Add the Plan Description",
      placeholder: "A relaxing evening walk along the coastline...",
    },
    location: {
      label: "Add the Plan Location",
      placeholder: "Santa Monica Beach, CA",
    },
  };

  const currentConfig = config[type];

  const handleSave = () => {
    if (value.trim()) {
      onSave?.(value);
      setValue("");
      onClose();
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity"
        style={{ backgroundColor: "var(--color-overlay-scrim)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
        style={{
          animation: "slideUp 0.3s ease-out",
        }}
      >
        <div className="bg-surface-primary rounded-tl-[32px] rounded-tr-[32px] pb-[40px] pt-[32px]">
          <div className="px-[53px]">
            <div className="content-stretch flex flex-col gap-[6px] items-start w-full max-w-[287px]" data-name="Info Content">
              <p className="font-primary leading-[20px] not-italic text-[14px] text-primary-token">
                {currentConfig.label}
              </p>
              <div className="bg-surface-primary content-stretch flex flex-col items-start p-[12px] rounded-[13px] w-full border border-card-token" data-name="Info Content">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={currentConfig.placeholder}
                  className="font-primary leading-[20px] text-[14px] w-full outline-none bg-transparent placeholder:text-tertiary-token text-primary-token"
                  autoFocus
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="mt-[24px] w-full h-[56px] rounded-[28px] transition-all active:scale-[0.98] disabled:opacity-50"
              disabled={!value.trim()}
              style={{
                background: 'linear-gradient(135deg, var(--color-button-secondary) 0%, var(--color-button-secondary) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--color-white-30)',
                boxShadow: '0px 1px 0px 0px var(--color-white-30) inset, 0px -1px 1px 0px var(--color-overlay-soft) inset, 0px 8px 20px -4px var(--color-brand-30), 0px 2px 4px -1px var(--color-overlay-soft)',
              }}
            >
              <p className="font-primary text-[16px] leading-[normal] text-invert-token">
                Save
              </p>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
