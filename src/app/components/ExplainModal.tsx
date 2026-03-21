import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AudioRecordingModal } from "./AudioRecordingModal";

type ExplainModalProps = {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onSave: (text: string) => void;
};

export function ExplainModal({ isOpen, onClose, value, onSave }: ExplainModalProps) {
  const [draft, setDraft] = useState(value);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recordingBaseRef = useRef("");
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  // Track keyboard height so only the audio button reacts to it.
  useEffect(() => {
    if (!isOpen) { setKeyboardOffset(0); return; }
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setKeyboardOffset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    vv.addEventListener("resize", update);
    update();
    return () => { vv.removeEventListener("resize", update); setKeyboardOffset(0); };
  }, [isOpen]);

  // iOS Safari tries to scroll the page to focused textareas.
  // Freeze document scrolling while the modal is open so the sheet stays pinned.
  useEffect(() => {
    if (!isOpen) return;

    const bodyStyle = document.body.style;
    const htmlStyle = document.documentElement.style;
    const previousBodyOverflow = bodyStyle.overflow;
    const previousBodyPosition = bodyStyle.position;
    const previousBodyTop = bodyStyle.top;
    const previousBodyWidth = bodyStyle.width;
    const previousHtmlOverflow = htmlStyle.overflow;
    const scrollY = window.scrollY;

    htmlStyle.overflow = "hidden";
    bodyStyle.overflow = "hidden";
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = "100%";

    return () => {
      htmlStyle.overflow = previousHtmlOverflow;
      bodyStyle.overflow = previousBodyOverflow;
      bodyStyle.position = previousBodyPosition;
      bodyStyle.top = previousBodyTop;
      bodyStyle.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Keep draft in sync when modal opens
  if (isOpen && draft !== value && !draft) setDraft(value);

  // Auto-resize textarea — useLayoutEffect ensures it runs before paint
  useLayoutEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [draft, isOpen]);

  const handleConfirm = () => {
    onSave(draft);
    onClose();
  };

  const handleOpenRecording = () => {
    recordingBaseRef.current = draft;
    setIsRecording(true);
  };

  const handleLiveTranscript = (text: string) => {
    const base = recordingBaseRef.current;
    setDraft(base ? `${base} ${text}` : text);
    // Scroll to bottom so the user always sees the latest words
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  };

  const handleAudioSave = (text: string) => {
    const base = recordingBaseRef.current;
    setDraft(text ? (base ? `${base} ${text}` : text) : base);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[rgba(24,24,32,0.4)] z-40" onClick={handleConfirm} />
      <div
        className="fixed left-0 right-0 mx-auto max-w-[393px] bg-[#f3f3f3] flex flex-col pb-[32px] pt-[20px] px-[20px] rounded-tl-[16px] rounded-tr-[16px] z-50 animate-slide-up overflow-hidden"
        style={{ bottom: 0, height: "min(640px, calc(100vh - 20px))" }}
      >

        {/* Header — pinned */}
        <div className="shrink-0 flex flex-col gap-[16px] items-center">
          <div className="bg-[#667085] h-[5px] rounded-full w-[44px]" />
          <div className="flex items-center justify-between w-full">
            <p className="font-['Milling_Trial:Triplex_1mm',sans-serif] text-[28px] leading-[36px] tracking-[-0.56px] text-[#09090b]">
              Explain a bit more
            </p>
            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                onClick={handleConfirm}
                className="bg-[#fc312e] flex items-center justify-center p-[10px] rounded-[999px] shrink-0"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 14.925L7.2 19.125L21.2 5.125" stroke="#fefefe" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable text area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto pt-[12px]"
          style={{ paddingBottom: isRecording ? 180 : Math.max(96, keyboardOffset + 96) }}
        >
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => window.scrollTo(0, 0)}
            placeholder="Start writing..."
            className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[21px] text-[#09090b] placeholder:text-[rgba(0,0,0,0.5)] bg-transparent border-none outline-none resize-none w-full overflow-hidden min-h-[24px]"
          />
        </div>

        {/* Audio button — pinned */}
        <div
          className="absolute right-[20px]"
          style={{ bottom: keyboardOffset > 0 ? keyboardOffset + 20 : 32 }}
        >
          <button
            type="button"
            onClick={handleOpenRecording}
            className="bg-[#09090b] flex items-center justify-center p-[10px] rounded-[999px]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M2 10V13" stroke="#fefefe" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6V17" stroke="#fefefe" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 3V21" stroke="#fefefe" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 8V15" stroke="#fefefe" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 5V18" stroke="#fefefe" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 10V13" stroke="#fefefe" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <AudioRecordingModal
        isOpen={isRecording}
        onClose={() => setIsRecording(false)}
        onSave={handleAudioSave}
        onLiveTranscript={handleLiveTranscript}
      />
    </>
  );
}
