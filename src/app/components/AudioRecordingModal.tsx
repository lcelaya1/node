import { useEffect, useRef, useState } from "react";

type AudioRecordingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
  onLiveTranscript?: (text: string) => void;
};

export function AudioRecordingModal({ isOpen, onClose, onSave, onLiveTranscript }: AudioRecordingModalProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [lang, setLang] = useState<"es-ES" | "en-US">("es-ES");
  const [error, setError] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef("");
  const timerRef = useRef<number | null>(null);
  const shouldSaveOnEndRef = useRef(false);
  const shouldRestartRef = useRef(false);

  // Visualizer
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const vizStreamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      recognitionRef.current?.stop();
      stopVisualizer();
      setSeconds(0);
      setIsRecording(false);
      setError("");
      transcriptRef.current = "";
      shouldSaveOnEndRef.current = false;
      shouldRestartRef.current = false;
    }
  }, [isOpen]);

  const startVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      vizStreamRef.current = stream;
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyserRef.current = analyser;
      drawLoop();
      return true;
    } catch {
      return false;
    }
  };

  const drawLoop = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 55;
      const barWidth = 2;
      const gap = 4;
      const totalWidth = barCount * (barWidth + gap) - gap;
      const startX = (canvas.width - totalWidth) / 2;
      const centerY = canvas.height / 2;

      ctx.strokeStyle = "var(--color-text-brand)";
      ctx.lineWidth = barWidth;
      ctx.lineCap = "round";

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const value = dataArray[dataIndex] / 255;
        const barHeight = Math.max(1.5, value * canvas.height * 0.85);
        const x = startX + i * (barWidth + gap) + barWidth / 2;

        ctx.beginPath();
        ctx.moveTo(x, centerY - barHeight / 2);
        ctx.lineTo(x, centerY + barHeight / 2);
        ctx.stroke();
      }
    };

    draw();
  };

  const stopVisualizer = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    vizStreamRef.current?.getTracks().forEach((t) => t.stop());
    analyserRef.current = null;
    vizStreamRef.current = null;
  };

  const getSpeechRecognition = () => {
    return (
      window.SpeechRecognition ??
      (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition
    );
  };

  const cleanupRecognition = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    recognition.onresult = null;
    recognition.onend = null;
    recognition.onerror = null;
    recognitionRef.current = null;
  };

  const saveTranscriptAndClose = () => {
    onSave(transcriptRef.current.trim());
    onClose();
  };

  const startRecognition = (SpeechRecognitionAPI: typeof SpeechRecognition) => {
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          transcriptRef.current += `${t} `;
        } else {
          interim += t;
        }
      }
      onLiveTranscript?.((transcriptRef.current + interim).trim());
    };

    recognition.onerror = (event) => {
      const nextError =
        event.error === "not-allowed"
          ? "Microphone access is blocked on this device."
          : event.error === "no-speech"
            ? ""
            : "Speech transcription is not available right now.";

      if (nextError) setError(nextError);

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        shouldRestartRef.current = false;
        shouldSaveOnEndRef.current = false;
        setIsRecording(false);
        stopVisualizer();
        if (timerRef.current) window.clearInterval(timerRef.current);
      }
    };

    recognition.onend = () => {
      cleanupRecognition();

      if (shouldSaveOnEndRef.current) {
        shouldSaveOnEndRef.current = false;
        shouldRestartRef.current = false;
        saveTranscriptAndClose();
        return;
      }

      if (shouldRestartRef.current) {
        try {
          startRecognition(SpeechRecognitionAPI);
        } catch {
          setError("Speech transcription stopped unexpectedly.");
          shouldRestartRef.current = false;
          setIsRecording(false);
          stopVisualizer();
          if (timerRef.current) window.clearInterval(timerRef.current);
        }
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleToggle = async () => {
    if (!isRecording) {
      setError("");
      transcriptRef.current = "";
      setSeconds(0);
      shouldSaveOnEndRef.current = false;
      shouldRestartRef.current = true;

      if (!window.isSecureContext) {
        setError("On iPhone, microphone access needs HTTPS. Open the secure deployed site to allow the mic.");
        shouldRestartRef.current = false;
        return;
      }

      const micReady = await startVisualizer();
      if (!micReady) {
        setError("Please allow microphone access to record audio.");
        shouldRestartRef.current = false;
        return;
      }

      const SpeechRecognitionAPI = getSpeechRecognition();
      if (!SpeechRecognitionAPI) {
        stopVisualizer();
        setError("Speech transcription is not supported on this mobile browser.");
        shouldRestartRef.current = false;
        return;
      }

      try {
        startRecognition(SpeechRecognitionAPI);
      } catch {
        stopVisualizer();
        setError("Speech transcription could not start on this device.");
        shouldRestartRef.current = false;
        return;
      }

      timerRef.current = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);

      setIsRecording(true);
    } else {
      if (timerRef.current) window.clearInterval(timerRef.current);
      stopVisualizer();
      shouldRestartRef.current = false;
      shouldSaveOnEndRef.current = true;

      const recognition = recognitionRef.current;
      if (recognition) {
        recognition.stop();
      } else {
        saveTranscriptAndClose();
      }

      setIsRecording(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString();
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-[393px] bg-surface-secondary flex flex-col h-[260px] items-center justify-between pb-[32px] pt-[28px] px-[20px] rounded-tl-[28px] rounded-tr-[28px] z-[51] animate-slide-up">

        {/* Timer */}
        <p className="font-primary text-[16px] leading-[21px] text-primary-token">
          {formatTime(seconds)}
        </p>

        {/* Waveform (recording) or label + toggle (idle) */}
        {isRecording ? (
          <canvas
            ref={canvasRef}
            width={353}
            height={48}
            className="w-full"
          />
        ) : (
          <div className="flex flex-col items-center gap-[12px]">
            <p className="font-primary text-[14px] leading-[16px] text-primary-token">
              Start Audio Recording
            </p>
            {error && (
              <p className="max-w-[240px] text-center font-primary text-[12px] leading-[16px] text-brand-token">
                {error}
              </p>
            )}
            <div className="flex bg-surface-fill rounded-[999px] p-[2px]">
              {(["es-ES", "en-US"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLang(l); }}
                  className={`font-primary text-[13px] leading-[16px] px-[14px] py-[5px] rounded-[999px] ${
                    lang === l ? "bg-surface-primary text-primary-token" : "text-secondary-token"
                  }`}
                >
                  {l === "es-ES" ? "ES" : "EN"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Record / stop button */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleToggle(); }}
          className="flex items-center justify-center border-2 border-[var(--primitive-neutral-600)] rounded-[100px] size-[56px]"
        >
          <div
            className={`bg-brand-token transition-all duration-150 ${
              isRecording ? "rounded-[4px] size-[16px]" : "rounded-[100px] size-[44px]"
            }`}
          />
        </button>
      </div>
    </>
  );
}
