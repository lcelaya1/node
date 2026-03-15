import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { LiquidGlassButton } from "../components/LiquidGlassButton";

export default function CreatePlanScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle plan creation
    console.log("Creating plan:", formData);
    navigate('/home');
  };

  return (
    <div className="bg-[#ededed] h-full overflow-hidden px-[25px]">
      {/* Back Button */}
      <button
        onClick={() => navigate('/home')}
        className="mt-[20px] flex items-center gap-2 text-[#071c07] z-10"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Content */}
      <div className="pb-[8px] pt-[28px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-24">
          <div className="flex flex-col gap-2">
            <h1 className="font-['Milling_Trial:Triplex_1mm',sans-serif] text-[28px] leading-[34px] text-[#071c07]">
              Create a Plan
            </h1>
            <p className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] leading-[20px] text-[#848884]">
              Share your idea and invite others to join.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[13px] text-[#071c07]">
                Plan Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Weekend Brunch"
                className="bg-white rounded-[12px] px-4 py-3 font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] text-[#071c07] placeholder:text-[#848884] border-none outline-none"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[13px] text-[#071c07]">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-white rounded-[12px] px-4 py-3 font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] text-[#071c07] border-none outline-none"
                />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <label className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[13px] text-[#071c07]">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="bg-white rounded-[12px] px-4 py-3 font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] text-[#071c07] border-none outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[13px] text-[#071c07]">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Coffee Shop Downtown"
                className="bg-white rounded-[12px] px-4 py-3 font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] text-[#071c07] placeholder:text-[#848884] border-none outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-['Milling_Trial:Duplex_1mm',sans-serif] text-[13px] text-[#071c07]">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell others what this plan is about..."
                rows={4}
                className="bg-white rounded-[12px] px-4 py-3 font-['Milling_Trial:Duplex_1mm',sans-serif] text-[14px] text-[#071c07] placeholder:text-[#848884] border-none outline-none resize-none"
              />
            </div>
          </div>

          <LiquidGlassButton 
            variant="red" 
            type="submit"
            className="w-full mt-4"
          >
            Create Plan
          </LiquidGlassButton>
        </form>
      </div>
    </div>
  );
}
