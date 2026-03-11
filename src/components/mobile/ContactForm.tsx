import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/icons/loading ft.png";

const frictionOptions = [
  "We’re testing a lot, but not sure what to double down on.",
  "It’s harder than expected to explain what we do.",
  "What converts once in one area doesn’t always carry to the next.",
  "Different teams define growth differently.",
  "Growth feels dependent on specific people.",
  "Other (please specify)",
  "Not sure yet",
];

export default function ContactForm() {
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

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFrictionSelect = (option: string) => {
    setFormData((prev) => {
      const current = prev.friction;
      let next: string[];

      if (option === "Other (please specify)") {
        const hasOther = current.some((f) => f.startsWith("Other:"));
        if (hasOther) {
          next = current.filter((f) => !f.startsWith("Other:"));
        } else {
          next = [...current, "Other:"];
        }
      } else {
        if (current.includes(option)) {
          next = current.filter((f) => f !== option);
        } else {
          next = [...current, option];
        }
      }

      return { ...prev, friction: next };
    });

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.friction;
      return newErrors;
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

        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "linear-gradient(180deg, #D2D3FF 0%, #DBE9EE 100%)",
      }}
    >
      <header className="h-15 px-5 flex items-center justify-between border-b border-brand-dark/10">
        <img
          src={logoImg}
          alt="feat.Consulting"
          style={{ height: "24.36px" }}
        />
        <button
          onClick={() => navigate(-1)}
          className="p-2 -mr-2 text-[#171425] text-2xl font-light"
          aria-label="Close"
        >
          ✕
        </button>
      </header>

      <div className="px-5.75 pt-7.75">
        <h1
          className="font-['Fustat'] font-semibold leading-[1.05] text-[#171425]"
          style={{ fontSize: "39.69px" }}
        >
          Turn your traction <br />
          into durable scale.
        </h1>

        <p
          className="font-['Lato'] font-light text-[#171425] leading-[1.3] mt-2 mb-8"
          style={{ fontSize: "21.3px" }}
        >
          One focused session to identify
          <br />
          where scale is stalling, and how to
          <br />
          correct it.
        </p>

        <form
          id="contact-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-2.5 pb-10"
        >
          <input
            type="text"
            name="firstName"
            placeholder="First Name*"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full h-13 px-6 bg-[#F8F8F8] rounded-[15px] font-['Lato'] font-light text-[18px] text-[#011A1F] placeholder:text-[#011A1F]/50 outline-none border border-[#011A1F]/20 transition-colors ${errors.firstName ? "border-red-400" : "focus:border-brand-hero-body/40"}`}
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name*"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full h-13 px-6 bg-[#F8F8F8] rounded-[15px] font-['Lato'] font-light text-[18px] text-[#011A1F] placeholder:text-[#011A1F]/50 outline-none border border-[#011A1F]/20 transition-colors ${errors.lastName ? "border-red-400" : "focus:border-brand-hero-body/40"}`}
            required
          />

          <input
            type="email"
            name="workEmail"
            placeholder="Work Email*"
            value={formData.workEmail}
            onChange={handleInputChange}
            className={`w-full h-13 px-6 bg-[#F8F8F8] rounded-[15px] font-['Lato'] font-light text-[18px] text-[#011A1F] placeholder:text-[#011A1F]/50 outline-none border border-[#011A1F]/20 transition-colors ${errors.workEmail ? "border-red-400" : "focus:border-brand-hero-body/40"}`}
            required
          />

          <input
            type="text"
            name="companyWebsite"
            placeholder="Company Website"
            value={formData.companyWebsite}
            onChange={handleInputChange}
            className="w-full h-13 px-6 bg-[#F8F8F8] rounded-[15px] font-['Lato'] font-light text-[18px] text-[#011A1F] placeholder:text-[#011A1F]/50 outline-none border border-[#011A1F]/20 focus:border-brand-hero-body/40 transition-colors"
          />

          <button
            type="button"
            onClick={() => setShowFrictionMenu(true)}
            className={`w-full h-13 px-6 bg-[#F8F8F8] rounded-[15px] font-['Lato'] font-light text-[18px] text-left flex items-center justify-between outline-none border border-[#011A1F]/20 transition-colors ${errors.friction ? "border-red-400" : ""}`}
          >
            <span
              className={`truncate flex-1 min-w-0 ${formData.friction.length > 0 ? "text-[#011A1F]" : "text-[#011A1F]/50"}`}
            >
              {formData.friction.length > 0
                ? formData.friction
                    .map((f) =>
                      f.startsWith("Other:")
                        ? f.replace("Other:", "Other: ") || "Other"
                        : f,
                    )
                    .join(", ")
                : "Where are you experiencing friction?*"}
            </span>
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              className={`transition-transform duration-300 ${showFrictionMenu ? "rotate-180" : ""}`}
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

          <textarea
            name="moreInfo"
            placeholder="Tell us more (optional)"
            value={formData.moreInfo}
            onChange={handleInputChange}
            className="w-full h-22.25 p-6 bg-[#F8F8F8] rounded-[15px] font-['Lato'] font-light text-[18px] text-[#011A1F] placeholder:text-[#011A1F]/50 outline-none border border-[#011A1F]/20 focus:border-brand-hero-body/40 transition-colors resize-none mb-2"
          />

          <div className="flex flex-col items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-13 mt-4 bg-brand-hero-body text-white rounded-full font-['Fustat'] font-medium text-[18px] flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : submitStatus === "success" ? (
                "Sent! →"
              ) : (
                "Start the conversation →"
              )}
            </button>
            <p className="font-['Lato'] font-light text-[#171425] text-[15.19px] mt-2.5 opacity-70">
              No obligation. Just clarity
            </p>
          </div>
        </form>
      </div>

      <div
        className={`fixed inset-0 z-100 transition-all duration-300 ${showFrictionMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setShowFrictionMenu(false)}
        />

        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[30px] flex flex-col transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${showFrictionMenu ? "translate-y-0" : "translate-y-full"}`}
          style={{ maxHeight: "92vh" }}
        >
          <div className="p-6 pb-2 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="font-['Lato'] font-light text-[#171425] text-lg">
              Where are you experiencing friction?
            </h3>
            <button
              type="button"
              onClick={() => setShowFrictionMenu(false)}
              className="text-zinc-400"
            >
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                <path
                  d="M1 7L7 1L13 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="flex flex-col gap-0">
              {frictionOptions.map((option, idx) => {
                const isSelected =
                  option === "Other (please specify)"
                    ? formData.friction.some((f) => f.startsWith("Other:"))
                    : formData.friction.includes(option);
                return (
                  <div key={idx}>
                    <label
                      className="flex items-center justify-between py-4 border-b border-zinc-100 last:border-0 cursor-pointer group active:bg-zinc-50 active:scale-[0.99] transition-all duration-200"
                      onClick={() => handleFrictionSelect(option)}
                    >
                      <span
                        className={`flex-1 font-['Lato'] font-light text-[18px] leading-snug mr-4 transition-colors duration-200 ${isSelected ? "text-brand-hero-body font-normal" : "text-[#171425]"}`}
                      >
                        {option}
                      </span>
                      <div
                        className={`w-5.5 h-5.5 rounded-sm border shrink-0 flex items-center justify-center transition-all duration-300 ${isSelected ? "bg-[#8B8CFB] border-[#8B8CFB] scale-110" : "border-zinc-300 scale-100"}`}
                      >
                        {isSelected && (
                          <svg
                            width="12"
                            height="9"
                            viewBox="0 0 12 9"
                            fill="none"
                            className="animate-zoom-in"
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
                      formData.friction.some((f) => f.startsWith("Other:")) && (
                        <div className="pb-4 animate-slide-down">
                          <input
                            type="text"
                            name="friction_other"
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
                            className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 rounded-xl font-['Lato'] font-light text-base outline-none focus:border-brand-hero-body/30 transition-all"
                          />
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowFrictionMenu(false)}
            className="w-full h-16 bg-[#8B8CFB] text-white flex items-center justify-center font-['Lato'] font-medium text-[18px] active:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
