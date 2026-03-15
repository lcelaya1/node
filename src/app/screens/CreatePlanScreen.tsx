import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, Check, X } from "lucide-react";
import { DualActionButtons } from "../components/DualActionButtons";
import { LiquidGlassButton } from "../components/LiquidGlassButton";
import { deletePlan, loadSavedPlan, savePlan, type SavedPlan } from "../lib/plans";

type FieldKey = "title" | "when" | "where" | "description";
type BubbleConfig = {
  key: "when" | "where" | "description" | "picture";
  label: string;
  note?: string;
  x: number;
  y: number;
};

const bubbles: BubbleConfig[] = [
  { key: "when", label: "When?", x: 2, y: 0 },
  { key: "where", label: "Where?", x: 159, y: 123 },
  { key: "description", label: "Explain a bit", x: 0, y: 247 },
  { key: "picture", label: "Picture", note: "(Optional)", x: 163, y: 363 },
];

export default function CreatePlanScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeField, setActiveField] = useState<FieldKey | null>(null);
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [whenModalOpen, setWhenModalOpen] = useState(false);
  const [whereModalOpen, setWhereModalOpen] = useState(false);
  const [scheduleDraft, setScheduleDraft] = useState({
    date: "",
    time: "",
  });
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isWhereConfirmed, setIsWhereConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    title: "",
    when: "",
    where: "",
  });
  const [draftValue, setDraftValue] = useState("");
  const [picturePreview, setPicturePreview] = useState("");
  const [pictureName, setPictureName] = useState("");
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const submitLabel = editingPlanId ? "Save Plan" : "Create Plan";
  const descriptionLength = formData.description.trim().length;
  const canSavePlan = Boolean(
    formData.title.trim() &&
      formData.when.trim() &&
      isWhereConfirmed &&
      descriptionLength >= 100,
  );
  const descriptionReady = descriptionLength >= 100;
  const whenReady = Boolean(scheduleDraft.date && scheduleDraft.time);
  const whereReady = isWhereConfirmed;

  const openEditor = (field: FieldKey) => {
    if (field === "description") {
      setDescriptionModalOpen(true);
      return;
    }

    if (field === "when") {
      setWhenModalOpen(true);
      return;
    }

    if (field === "where") {
      setLocationQuery(formData.where);
      setWhereModalOpen(true);
      return;
    }

    setActiveField(field);
    setDraftValue(formData[field]);
  };

  const closeEditor = () => {
    setActiveField(null);
    setDraftValue("");
  };

  const closeDescriptionModal = () => {
    setDescriptionModalOpen(false);
  };

  const closeWhenModal = () => {
    setWhenModalOpen(false);
  };

  const closeWhereModal = () => {
    setWhereModalOpen(false);
    setLocationLoading(false);
    setLocationError("");
  };

  const saveField = () => {
    if (!activeField) return;

    setFormData((current) => ({
      ...current,
      [activeField]: draftValue.trim(),
    }));
    closeEditor();
  };

  const handleSubmit = async () => {
    if (!canSavePlan) {
      return;
    }

    const normalizedPlan: SavedPlan = {
      createdAt: new Date().toISOString(),
      description: formData.description.trim(),
      id: editingPlanId ?? crypto.randomUUID(),
      picturePreview,
      title: formData.title.trim() || "Untitled Plan",
      whenDate: scheduleDraft.date,
      whenTime: scheduleDraft.time,
      when: formData.when.trim(),
      where: formData.where.trim(),
    };

    await savePlan(normalizedPlan);
    navigate("/home", { state: { planId: normalizedPlan.id } });
  };

  const handleDeletePlan = async () => {
    if (!editingPlanId) {
      return;
    }

    await deletePlan(editingPlanId);
    navigate("/home", { replace: true });
  };

  const formatWhenSummary = (date: string, time: string) => {
    const dateLabel = date
      ? new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      : "";

    return [dateLabel, time].filter(Boolean).join("\n");
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((current) => ({
      ...current,
      description: value,
    }));
  };

  const handleLocationSelect = (value: string) => {
    setFormData((current) => ({
      ...current,
      where: value,
    }));
    setLocationQuery(value);
    setIsWhereConfirmed(true);
    closeWhereModal();
  };

  useEffect(() => {
    if (!whereModalOpen) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const query = locationQuery.trim();

    if (!query) {
      setLocationSuggestions([]);
      setLocationError("");
      setLocationLoading(false);
      return;
    }

    if (query.length < 3) {
      setLocationSuggestions([]);
      setLocationError("");
      setLocationLoading(false);
      return;
    }

    if (!apiKey) {
      setLocationSuggestions([]);
      setLocationError("Add VITE_GOOGLE_MAPS_API_KEY to enable live search.");
      setLocationLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setLocationLoading(true);
        setLocationError("");

        const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "suggestions.placePrediction.text.text",
          },
          body: JSON.stringify({
            input: query,
            languageCode: "en",
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Location search failed");
        }

        const data = (await response.json()) as {
          suggestions?: Array<{
            placePrediction?: {
              text?: {
                text?: string;
              };
            };
          }>;
        };

        const suggestions =
          data.suggestions
            ?.map((item) => item.placePrediction?.text?.text?.trim() ?? "")
            .filter(Boolean) ?? [];

        setLocationSuggestions(suggestions);
        if (!suggestions.length) {
          setLocationError("No locations found.");
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setLocationSuggestions([]);
        setLocationError("Could not load locations right now.");
      } finally {
        if (!controller.signal.aborted) {
          setLocationLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [locationQuery, whereModalOpen]);

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      when: formatWhenSummary(scheduleDraft.date, scheduleDraft.time),
    }));
  }, [scheduleDraft.date, scheduleDraft.time]);

  useEffect(() => {
    const planId = (location.state as { planId?: string } | null)?.planId;
    if (!planId) return;

    let isMounted = true;

    loadSavedPlan(planId).then((plan) => {
      if (!isMounted || !plan) return;

      setEditingPlanId(plan.id);
      setFormData({
        description: plan.description ?? "",
        title: plan.title ?? "",
        when: plan.when ?? "",
        where: plan.where ?? "",
      });
      setScheduleDraft({
        date: plan.whenDate ?? "",
        time: plan.whenTime ?? "",
      });
      setLocationQuery(plan.where ?? "");
      setIsWhereConfirmed(Boolean(plan.where?.trim()));
      setPicturePreview(plan.picturePreview ?? "");
      setPictureName(plan.picturePreview ? "Selected image" : "");
    });

    return () => {
      isMounted = false;
    };
  }, [location.state]);

  const activeFieldMeta = activeField
    ? {
        description: {
          label: "Explain a bit",
          placeholder: "What is this plan about?",
        },
        title: {
          label: "Add a Title...",
          placeholder: "Coffee after work",
        },
        when: {
          label: "When?",
          placeholder: "Saturday at 18:30",
        },
        where: {
          label: "Where?",
          placeholder: "Nomad Coffee, El Born",
        },
      }[activeField]
    : null;

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#ededed] px-[26px]">
      <div className="mt-[20px] flex items-center justify-between">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-[#071c07]"
          type="button"
        >
          <ArrowLeft size={24} />
        </button>

        {editingPlanId ? (
          <button
            className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[20px] text-[#fc312e]"
            onClick={handleDeletePlan}
            type="button"
          >
            Delete
          </button>
        ) : null}
      </div>

      <div className="pt-[24px]">
        <input
          className="w-full border-none bg-transparent font-['Milling_Trial:Triplex_1mm',sans-serif] text-[28px] leading-[1] text-[#071c07] outline-none placeholder:text-[#7f897f]"
          onChange={(event) =>
            setFormData((current) => ({
              ...current,
              title: event.target.value,
            }))
          }
          placeholder="Add a Title..."
          type="text"
          value={formData.title}
        />
      </div>

      <div className="relative mt-[24px] h-[520px] w-full max-w-[355px] self-center">
        {bubbles.map((bubble) => {
          const isPicture = bubble.key === "picture";
          const isDescription = bubble.key === "description";
          const isWhere = bubble.key === "where";
          const isWhen = bubble.key === "when";
          const bubbleValue =
            bubble.key === "picture"
              ? pictureName
              : formData[bubble.key as Exclude<FieldKey, "title">];
          const hasValue = bubbleValue.trim().length > 0;

          return (
            <button
              key={bubble.key}
              className="absolute flex h-[192px] w-[192px] flex-col rounded-full text-center"
              onClick={() =>
                isPicture
                  ? fileInputRef.current?.click()
                  : openEditor(bubble.key as Exclude<FieldKey, "title">)
              }
              style={{
                left: bubble.x,
                top: bubble.y,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,247,247,0.78) 100%)",
                border: "1px solid rgba(255,255,255,0.82)",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.92) inset, 0 -10px 24px rgba(225,225,225,0.24) inset, 0 0 0 1px rgba(189,189,189,0.18), 0 0 32px rgba(255,255,255,0.98), 0 0 8px rgba(215,215,215,0.7)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
              type="button"
            >
              {isPicture && hasValue ? (
                <div className="absolute inset-[10px] overflow-hidden rounded-full bg-[#d9d9d9]">
                  {picturePreview ? (
                    <img alt="Selected" className="block h-full w-full object-cover" src={picturePreview} />
                  ) : null}
                </div>
              ) : (isDescription || isWhere || isWhen) && hasValue ? (
                <div className="flex h-full flex-col items-start px-[25px] pt-[66px] text-left">
                  <span className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[17px] leading-[24px] text-[#111]">
                    {bubble.label}
                  </span>
                  <span
                    className="mt-[6px] w-[141px] overflow-hidden text-left font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[17px] text-[#7f7f7f]"
                    style={{
                      display: isWhen ? "block" : "-webkit-box",
                      textOverflow: "ellipsis",
                      whiteSpace: isWhen ? "pre-line" : "normal",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: isWhen ? undefined : 2,
                    }}
                  >
                    {bubbleValue}
                  </span>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-[24px]">
                  <span className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[24px] text-[#111]">
                    {bubbleValue || bubble.label}
                  </span>

                  {bubble.note ? (
                    <span className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[18px] text-[#8d8d8d]">
                      {bubble.note}
                    </span>
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-[20px] pb-[12px]">
        <LiquidGlassButton
          className="h-[54px] w-full text-[16px]"
          disabled={!canSavePlan}
          onClick={handleSubmit}
          variant="red"
        >
          {submitLabel}
        </LiquidGlassButton>
      </div>

      <input
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            setPicturePreview("");
            setPictureName("");
            return;
          }

          const reader = new FileReader();
          reader.onload = () => {
            setPicturePreview(typeof reader.result === "string" ? reader.result : "");
            setPictureName(file.name);
          };
          reader.readAsDataURL(file);
        }}
        type="file"
      />

      {descriptionModalOpen ? (
        <>
          <div className="absolute inset-0 z-40 bg-[#16181f]/82" onClick={closeDescriptionModal} />
          <div className="absolute inset-x-0 bottom-0 z-50 mx-auto h-[550px] max-h-[calc(100%-78px)] w-full max-w-[390px] overflow-hidden rounded-t-[32px] bg-[#f7f7f7]">
            <div className="px-[16px] pt-[20px]">
              <div className="mx-auto h-[5px] w-[44px] rounded-full bg-[#6f7991]" />
              <div className="mt-[16px] flex items-start justify-between">
                <h2 className="font-['Milling_Trial:Triplex_1mm',sans-serif] text-[24px] leading-[34px] text-[#071c07]">
                  Explain a bit
                </h2>
                <button
                  className={`flex h-[36px] w-[36px] items-center justify-center rounded-[12px] ${descriptionReady ? "bg-[#fc312e] text-white" : "bg-white text-[#6f7991]"}`}
                  onClick={closeDescriptionModal}
                  type="button"
                >
                  <Check size={20} strokeWidth={2} />
                </button>
              </div>

              <p className="mt-[6px] font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[20px] text-[#8f8f8f]">
                Please write at least 100 characters.
              </p>

              <textarea
                autoFocus
                className="mt-[14px] min-h-[420px] w-full resize-none border-none bg-transparent font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[24px] text-[#071c07] outline-none placeholder:text-[#8f8f8f]"
                onChange={(event) => handleDescriptionChange(event.target.value)}
                placeholder="Start writing..."
                value={formData.description}
              />
            </div>
          </div>
        </>
      ) : null}

      {whenModalOpen ? (
        <>
          <div className="absolute inset-0 z-40 bg-[#16181f]/52" onClick={closeWhenModal} />
          <div className="absolute inset-x-0 bottom-0 z-50 mx-auto h-[550px] max-h-[calc(100%-78px)] w-full max-w-[390px] overflow-hidden rounded-t-[36px] bg-[#f7f7f7] px-[16px] pb-[20px] pt-[18px]">
            <div className="mx-auto h-[5px] w-[44px] rounded-full bg-[#6f7991]" />
            <div className="mt-[16px] flex items-start justify-between">
              <h2 className="font-['Milling_Trial:Triplex_1mm',sans-serif] text-[24px] leading-[34px] text-[#071c07]">
                When?
              </h2>
              <button
                className={`flex h-[36px] w-[36px] items-center justify-center rounded-[12px] ${whenReady ? "bg-[#fc312e] text-white" : "bg-white text-[#6f7991]"}`}
                onClick={closeWhenModal}
                type="button"
              >
                <Check size={20} strokeWidth={2} />
              </button>
            </div>

            <div className="mt-[18px] grid grid-cols-2 gap-[12px]">
              <div>
                <label className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[22px] text-[#111]">
                  Date
                </label>
                <div className="mt-[6px] rounded-[12px] bg-white px-[12px] py-[12px] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_10px_20px_rgba(0,0,0,0.04)]">
                  <input
                    className="w-full border-none bg-transparent font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[22px] text-[#071c07] outline-none"
                    onChange={(event) =>
                      setScheduleDraft((current) => ({
                        ...current,
                        date: event.target.value,
                      }))
                    }
                    placeholder="dd/mm/yyyy"
                    type="date"
                    value={scheduleDraft.date}
                  />
                </div>
              </div>

              <div>
                <label className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[22px] text-[#111]">
                  Hour
                </label>
                <div className="mt-[6px] rounded-[12px] bg-white px-[12px] py-[12px] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_10px_20px_rgba(0,0,0,0.04)]">
                  <input
                    className="w-full border-none bg-transparent font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[22px] text-[#071c07] outline-none"
                    onChange={(event) =>
                      setScheduleDraft((current) => ({
                        ...current,
                        time: event.target.value,
                      }))
                    }
                    placeholder="--:--"
                    type="time"
                    value={scheduleDraft.time}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {whereModalOpen ? (
        <>
          <div className="absolute inset-0 z-40 bg-[#16181f]/82" onClick={closeWhereModal} />
          <div className="absolute inset-x-0 bottom-0 z-50 mx-auto h-[550px] max-h-[calc(100%-78px)] w-full max-w-[390px] overflow-hidden rounded-t-[32px] bg-[#f7f7f7]">
            <div className="px-[16px] pt-[20px]">
              <div className="mx-auto h-[5px] w-[44px] rounded-full bg-[#6f7991]" />
              <div className="mt-[16px] flex items-start justify-between">
                <h2 className="font-['Milling_Trial:Triplex_1mm',sans-serif] text-[24px] leading-[34px] text-[#071c07]">
                  Where?
                </h2>
                <button
                  className={`flex h-[36px] w-[36px] items-center justify-center rounded-[12px] ${whereReady ? "bg-[#fc312e] text-white" : "bg-white text-[#6f7991]"}`}
                  onClick={closeWhereModal}
                  type="button"
                >
                  <Check size={20} strokeWidth={2} />
                </button>
              </div>

              <input
                autoFocus
                className="mt-[18px] w-full border-none bg-transparent font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[24px] text-[#071c07] outline-none placeholder:text-[#8f8f8f]"
                onChange={(event) => {
                  const value = event.target.value;
                  setLocationQuery(value);
                  setFormData((current) => ({
                    ...current,
                    where: value,
                  }));
                  setIsWhereConfirmed(false);
                }}
                placeholder="Search Locations..."
                type="text"
                value={locationQuery}
              />

              <div className="mt-[18px] flex max-h-[540px] flex-col overflow-y-auto pb-[24px]">
                {locationLoading ? (
                  <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[20px] text-[#8f8f8f]">
                    Searching...
                  </p>
                ) : null}

                {!locationLoading && locationError ? (
                  <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[20px] text-[#8f8f8f]">
                    {locationError}
                  </p>
                ) : null}

                {!locationLoading && !locationError && locationSuggestions.length
                  ? locationSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        className="border-b border-[#ececec] py-[14px] text-left font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[20px] text-[#071c07]"
                        onClick={() => handleLocationSelect(suggestion)}
                        type="button"
                      >
                        {suggestion}
                      </button>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </>
      ) : null}

      {activeField && activeFieldMeta ? (
        <>
          <div className="absolute inset-0 z-40 bg-black/20" onClick={closeEditor} />
          <div className="absolute inset-x-[20px] bottom-[24px] z-50 rounded-[28px] bg-[#f3f3f3] p-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[20px] text-[#071c07]">
              {activeFieldMeta.label}
            </p>
            <textarea
              autoFocus
              className="mt-[10px] min-h-[112px] w-full resize-none rounded-[18px] border-none bg-white px-[16px] py-[14px] font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[24px] text-[#071c07] outline-none placeholder:text-[#9b9b9b]"
              onChange={(event) => setDraftValue(event.target.value)}
              placeholder={activeFieldMeta.placeholder}
              rows={activeField === "description" ? 5 : 3}
              value={draftValue}
            />
            <DualActionButtons
              className="mt-[14px]"
              primary={{ label: "Save", onClick: saveField }}
              primaryPosition="right"
              primaryWidthClassName="flex-1"
              secondary={{ label: "Cancel", onClick: closeEditor }}
              secondaryWidthClassName="flex-1"
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
