import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/icons/loading ft.png";
import doinGlobal from "../../assets/logos/doinGlobal.png";
import ISCP from "../../assets/logos/ISCP.png";
import logoVertical from "../../assets/logos/logo vertical.png";
import MobyBots from "../../assets/logos/MobyBots.png";
import ObrasDeMar from "../../assets/logos/ObrasDeMar.png";

const frictionOptions = [
  "We're testing a lot, but not sure what to double down on.",
  "It's harder than expected to explain what we do.",
  "What converts once in one area doesn't always carry to the next.",
  "Different teams define growth differently.",
  "Growth feels dependent on specific people.",
  "Other (please specify)",
  "Not sure yet",
];

export default function DesktopContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    workEmail: "",
    companyWebsite: "",
    friction: [] as string[],
    moreInfo: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showFrictionMenu, setShowFrictionMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowFrictionMenu(false);
      }
    };
    if (showFrictionMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFrictionMenu]);

  const validateEmail = (email: string) =>
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFrictionSelect = (option: string) => {
    setFormData((prev) => {
      const current = prev.friction;
      let next: string[];
      if (option === "Other (please specify)") {
        const hasOther = current.some((f) => f.startsWith("Other:"));
        next = hasOther
          ? current.filter((f) => !f.startsWith("Other:"))
          : [...current, "Other:"];
      } else {
        next = current.includes(option)
          ? current.filter((f) => f !== option)
          : [...current, option];
      }
      return { ...prev, friction: next };
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.friction;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = "Required";
    if (!formData.lastName) newErrors.lastName = "Required";
    if (!formData.workEmail) {
      newErrors.workEmail = "Required";
    } else if (!validateEmail(formData.workEmail)) {
      newErrors.workEmail = "Invalid email";
    }
    if (formData.friction.length === 0) {
      newErrors.friction = "Required";
    } else if (
      formData.friction.length === 1 &&
      formData.friction[0] === "Other:"
    ) {
      newErrors.friction = "Required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

      if (!webhookUrl) {
        console.warn(
          "VITE_N8N_WEBHOOK_URL not set. Form submission simulated.",
        );
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSubmitStatus("success");
      } else {
        const tier = localStorage.getItem("selectedTier") || "";
        const payload = {
          DATE: new Date().toISOString(),
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.workEmail,
          website: formData.companyWebsite,
          experience: formData.friction
            .map((f) =>
              f.startsWith("Other:")
                ? f.replace("Other:", "Other: ") || "Other"
                : f,
            )
            .join(" + "),
          more: formData.moreInfo,
          tier: tier,
        };

        const jwtToken = import.meta.env.VITE_N8N_WEBHOOK_JWT;
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (jwtToken) headers["Authorization"] = `Bearer ${jwtToken}`;

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        const responseText = await response.text();
        if (responseText === "Enviado") {
          setSubmitStatus("success");
        } else {
          console.error("Unexpected response from webhook:", responseText);
          setSubmitStatus("error");
        }
      }

      sessionStorage.removeItem("scrollPos");
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const frictionLabel =
    formData.friction.length > 0
      ? formData.friction
          .map((f) =>
            f.startsWith("Other:")
              ? f.replace("Other:", "Other: ") || "Other"
              : f,
          )
          .join(", ")
      : "Where are you experiencing friction?*";

  return (
    <div
      className="h-screen overflow-hidden w-full flex flex-col"
      style={{ background: "#FFFFFF" }}
    >
      {/* Header bar with logo + X */}
      <header className="h-15 px-8 flex items-center justify-between border-b border-[#171425]/10">
        <img
          src={logoImg}
          alt="feat.Consulting"
          style={{ height: "24.36px" }}
        />
        <button
          onClick={() => navigate(-1)}
          className="p-2 -mr-2 text-[#171425] text-2xl font-light leading-none"
          aria-label="Close"
        >
          ✕
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1240px] mx-auto px-8 py-12">
          {/* Heading */}
          <h1
            className="font-['Fustat'] font-semibold text-[#171425] leading-[1.05] mb-3 text-center"
            style={{ fontSize: "68.89px" }}
          >
            Turn your traction into durable scale.
          </h1>
          <p
            className="font-['Lato'] font-light text-[#171425] leading-[1.4] mb-10 text-center"
            style={{ fontSize: "24px" }}
          >
            One focused session to identify where scale is stalling, and how to
            correct it.
          </p>

          {/* Two-column layout */}
          <div className="flex gap-10 items-start">
            {/* LEFT: Form card */}
            <div
              className="flex-[7] min-w-0 rounded-2xl p-8"
              style={{
                background: "linear-gradient(180deg, #D2D3FF 0%, #DBE9EE 100%)",
              }}
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name*"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full h-13 px-6 bg-[#F8F8F8] rounded-[15px] font-['Lato'] font-light text-[18px] text-[#011A1F] placeholder:text-[#011A1F]/50 outline-none border transition-colors ${errors.firstName ? "border-red-400" : "border-[#011A1F]/20 focus:border-[#011A1F]/40"}`}
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name*"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full h-13 px-6 bg-[#F8F8F8] rounded-[15px] font-['Lato'] font-light text-[18px] text-[#011A1F] placeholder:text-[#011A1F]/50 outline-none border transition-colors ${errors.lastName ? "border-red-400" : "border-[#011A1F]/20 focus:border-[#011A1F]/40"}`}
                  />
                </div>

                {/* Email + Website row */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="email"
                    name="workEmail"
                    placeholder="Work Email*"
                    value={formData.workEmail}
                    onChange={handleInputChange}
                    className={`w-full h-13 px-6 bg-[#F8F8F8] rounded-[15px] font-['Lato'] font-light text-[18px] text-[#011A1F] placeholder:text-[#011A1F]/50 outline-none border transition-colors ${errors.workEmail ? "border-red-400" : "border-[#011A1F]/20 focus:border-[#011A1F]/40"}`}
                  />
                  <input
                    type="text"
                    name="companyWebsite"
                    placeholder="Company Website"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    className="w-full h-13 px-6 bg-[#F8F8F8] rounded-[15px] font-['Lato'] font-light text-[18px] text-[#011A1F] placeholder:text-[#011A1F]/50 outline-none border border-[#011A1F]/20 focus:border-[#011A1F]/40 transition-colors"
                  />
                </div>

                {/* Friction dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowFrictionMenu((v) => !v)}
                    className={`w-full px-6 bg-[#F8F8F8] rounded-[15px] font-['Lato'] font-light text-[18px] text-left flex items-center justify-between outline-none border transition-colors ${errors.friction ? "border-red-400" : "border-[#011A1F]/20"}`}
                    style={{
                      height: "52px",
                      minHeight: "52px",
                      maxHeight: "52px",
                      overflow: "hidden",
                    }}
                  >
                    <span
                      className={`truncate flex-1 min-w-0 ${formData.friction.length > 0 ? "text-[#011A1F]" : "text-[#011A1F]/50"}`}
                    >
                      {frictionLabel}
                    </span>
                    <svg
                      width="12"
                      height="7"
                      viewBox="0 0 12 7"
                      fill="none"
                      className={`ml-3 shrink-0 transition-transform duration-300 ${showFrictionMenu ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M1 1L6 6L11 1"
                        stroke="#011A1F"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {showFrictionMenu && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white rounded-2xl shadow-xl border border-[#011A1F]/10 overflow-hidden">
                      <div className="max-h-72 overflow-y-auto px-4 py-2">
                        {frictionOptions.map((option, idx) => {
                          const isSelected =
                            option === "Other (please specify)"
                              ? formData.friction.some((f) =>
                                  f.startsWith("Other:"),
                                )
                              : formData.friction.includes(option);
                          return (
                            <div key={idx}>
                              <label
                                className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0 cursor-pointer"
                                onClick={() => handleFrictionSelect(option)}
                              >
                                <span
                                  className={`flex-1 font-['Lato'] font-light text-[16px] leading-snug mr-4 transition-colors duration-200 ${isSelected ? "text-[#8B8CFB] font-normal" : "text-[#171425]"}`}
                                >
                                  {option}
                                </span>
                                <div
                                  className={`w-5 h-5 rounded-sm border shrink-0 flex items-center justify-center transition-all duration-300 ${isSelected ? "bg-[#8B8CFB] border-[#8B8CFB]" : "border-zinc-300"}`}
                                >
                                  {isSelected && (
                                    <svg
                                      width="11"
                                      height="8"
                                      viewBox="0 0 12 9"
                                      fill="none"
                                    >
                                      <path
                                        d="M1 4.5L4.5 8L11 1"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </div>
                              </label>

                              {option === "Other (please specify)" &&
                                formData.friction.some((f) =>
                                  f.startsWith("Other:"),
                                ) && (
                                  <div className="pb-3">
                                    <input
                                      type="text"
                                      placeholder="Please specify..."
                                      autoFocus
                                      value={
                                        formData.friction
                                          .find((f) => f.startsWith("Other:"))
                                          ?.replace("Other:", "") || ""
                                      }
                                      onChange={(e) =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          friction: prev.friction.map((f) =>
                                            f.startsWith("Other:")
                                              ? `Other:${e.target.value}`
                                              : f,
                                          ),
                                        }))
                                      }
                                      className="w-full h-10 px-4 bg-zinc-50 border border-zinc-200 rounded-xl font-['Lato'] font-light text-base outline-none focus:border-[#8B8CFB]/50 transition-all"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                )}
                            </div>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowFrictionMenu(false)}
                        className="w-full h-12 bg-[#8B8CFB] text-white font-['Lato'] font-medium text-[16px] transition-opacity hover:opacity-90"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>

                {/* Textarea */}
                <textarea
                  name="moreInfo"
                  placeholder="Tell us more (optional)"
                  value={formData.moreInfo}
                  onChange={handleInputChange}
                  className="w-full h-24 p-6 bg-[#F8F8F8] rounded-[15px] font-['Lato'] font-light text-[18px] text-[#011A1F] placeholder:text-[#011A1F]/50 outline-none border border-[#011A1F]/20 focus:border-[#011A1F]/40 transition-colors resize-none"
                />

                {/* Submit */}
                <div className="flex flex-col items-center mt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-13 bg-[#171425] text-white rounded-full font-['Fustat'] font-medium text-[18px] flex items-center justify-center transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : submitStatus === "success" ? (
                      "Sent! →"
                    ) : (
                      "Start the conversation →"
                    )}
                  </button>
                  <p className="font-['Lato'] font-light text-[#171425] text-[15px] mt-2.5 opacity-70">
                    No obligation. Just clarity
                  </p>
                </div>
              </form>
            </div>

            {/* RIGHT: Info panel */}
            <div className="flex-[4] pt-2 max-w-[400px]">
              <h2
                className="font-['Fustat'] font-medium text-[#171425] leading-[1.2] mb-5"
                style={{ fontSize: "27.82px" }}
              >
                By the end of this session,
                <br /> you'll know:
              </h2>
              <ul className="flex flex-col gap-3 mb-10">
                {[
                  "What's structurally blocking growth",
                  "What your current traction is telling you",
                  "Which specific cohort and intent deserve focus",
                  "What's worth scaling, and what to stop feeding",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#8B8CFB] font-bold mt-0.5">•</span>
                    <span
                      className="font-['Lato'] font-light text-[#171425] text-[17.46px]"
                      style={{ lineHeight: "116%" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="font-['Lato'] font-light text-[#171425] text-[16px] opacity-70 mb-6 whitespace-nowrap">
                Trusted by post-traction teams scaling across global markets.
              </p>

              <div
                style={{ width: "483px", height: "35px", overflow: "hidden" }}
              >
                <div
                  className="flex items-center gap-8"
                  style={{
                    animation: "marquee 80s linear infinite",
                    width: "max-content",
                  }}
                >
                  {[
                    ...([
                      { type: "img", src: doinGlobal, alt: "doinGlobal" },
                      { type: "img", src: ISCP, alt: "ISCP" },
                      { type: "img", src: MobyBots, alt: "MobyBots" },
                      { type: "img", src: ObrasDeMar, alt: "ObrasDeMar" },
                      { type: "text", label: "Empresa A" },
                      { type: "text", label: "Empresa B" },
                      { type: "text", label: "Empresa C" },
                      { type: "text", label: "Empresa D" },
                      { type: "text", label: "Empresa E" },
                      { type: "text", label: "Empresa F" },
                      { type: "text", label: "Empresa G" },
                      { type: "text", label: "Empresa H" },
                      { type: "text", label: "Empresa I" },
                      { type: "text", label: "Empresa J" },
                      { type: "text", label: "Empresa K" },
                      { type: "text", label: "Empresa L" },
                    ] as const),
                    ...([
                      { type: "img", src: doinGlobal, alt: "doinGlobal" },
                      { type: "img", src: ISCP, alt: "ISCP" },
                      { type: "img", src: MobyBots, alt: "MobyBots" },
                      { type: "img", src: ObrasDeMar, alt: "ObrasDeMar" },
                      { type: "text", label: "Empresa A" },
                      { type: "text", label: "Empresa B" },
                      { type: "text", label: "Empresa C" },
                      { type: "text", label: "Empresa D" },
                      { type: "text", label: "Empresa E" },
                      { type: "text", label: "Empresa F" },
                      { type: "text", label: "Empresa G" },
                      { type: "text", label: "Empresa H" },
                      { type: "text", label: "Empresa I" },
                      { type: "text", label: "Empresa J" },
                      { type: "text", label: "Empresa K" },
                      { type: "text", label: "Empresa L" },
                    ] as const),
                  ].map((item, i) =>
                    item.type === "img" ? (
                      <img
                        key={i}
                        src={item.src}
                        alt={item.alt}
                        style={{
                          height: "28px",
                          filter: "grayscale(100%)",
                          opacity: 0.55,
                        }}
                        className="object-contain shrink-0"
                      />
                    ) : (
                      <span
                        key={i}
                        className="font-['Lato'] font-light text-[13px] text-[#171425]/40 whitespace-nowrap shrink-0"
                      >
                        {item.label}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
