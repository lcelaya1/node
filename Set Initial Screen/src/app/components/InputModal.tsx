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
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
        style={{
          animation: "slideUp 0.3s ease-out",
        }}
      >
        <div className="bg-[#f3f3f3] rounded-tl-[32px] rounded-tr-[32px] pb-[40px] pt-[32px]">
          <div className="px-[53px]">
            <div className="content-stretch flex flex-col gap-[6px] items-start w-full max-w-[287px]" data-name="Info Content">
              <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] leading-[18px] not-italic text-[12px] text-black">
                {currentConfig.label}
              </p>
              <div className="bg-white content-stretch flex flex-col items-start p-[12px] rounded-[13px] w-full" data-name="Info Content">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={currentConfig.placeholder}
                  className="font-['Milling_Trial:Duplex_1mm',sans-serif] leading-[18px] text-[12px] w-full outline-none bg-transparent placeholder:text-[#bbb] text-black"
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
                background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.95) 0%, rgba(255, 59, 48, 0.85) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0px 1px 0px 0px rgba(255, 255, 255, 0.3) inset, 0px -1px 1px 0px rgba(0, 0, 0, 0.1) inset, 0px 8px 20px -4px rgba(255, 59, 48, 0.3), 0px 2px 4px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[normal] text-white">
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