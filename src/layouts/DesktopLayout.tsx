import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { saveScrollAnchor } from "../utils/scrollRestore";
import MobileLayout from "./MobileLayout";
import logoBlanco from "../assets/icons/LOGO BLANCO.svg";
import flechaIcon from "../assets/icons/flecha.svg";
import qrCode from "../assets/desktop/qr.png";
import mobileSimulated from "../assets/desktop/mobile_simulated.png";
import Logo from "../components/shared/Logo";

const BASE_W = 1920;
const BASE_H = 1080;
const LOGICAL_VIEWPORT_WIDTH = 440;
const LOGICAL_VIEWPORT_HEIGHT = 724;
const EMULATOR_TOPBAR_HEIGHT = 60;
const EMULATOR_PRESENTATION_SCALE = 1.32;
const EMULATOR_FRAME_WIDTH = Math.round(
  LOGICAL_VIEWPORT_WIDTH * EMULATOR_PRESENTATION_SCALE,
);
const EMULATOR_FRAME_HEIGHT = Math.round(
  (LOGICAL_VIEWPORT_HEIGHT + EMULATOR_TOPBAR_HEIGHT) *
    EMULATOR_PRESENTATION_SCALE,
);

function useDesktopScale() {
  const [scale, setScale] = useState(() => {
    const sx = window.innerWidth / BASE_W;
    const sy = window.innerHeight / BASE_H;
    return Math.min(sx, sy);
  });

  useEffect(() => {
    const onResize = () => {
      const sx = window.innerWidth / BASE_W;
      const sy = window.innerHeight / BASE_H;
      setScale(Math.min(sx, sy));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return scale;
}

interface DesktopLayoutProps {
  showForm?: boolean;
}

export default function DesktopLayout({
  showForm = false,
}: DesktopLayoutProps) {
  const [showMobile, setShowMobile] = useState(showForm);
  const [desktopHeroAnimationEnabled, setDesktopHeroAnimationEnabled] =
    useState(showForm);
  const [btnHovered, setBtnHovered] = useState(false);
  const scale = useDesktopScale();

  const scrollEmulatorToStart = () => {
    const main = document.querySelector(
      ".emulator-container",
    ) as HTMLElement | null;
    if (!main) return;
    main.classList.remove("story-snap-enabled");
    sessionStorage.setItem("storyAnchorJumpTs", "1");
    window.setTimeout(
      () => sessionStorage.removeItem("storyAnchorJumpTs"),
      1700,
    );
    main.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-[#020A30] flex items-center justify-center">
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${!showMobile ? "opacity-100" : "opacity-0 pointer-events-none scale-95 blur-sm"}`}
      >
        <div
          style={{
            width: `${BASE_W * scale}px`,
            height: `${BASE_H * scale}px`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: `${BASE_W}px`,
              height: `${BASE_H}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              position: "relative",
            }}
          >
            <div
              className="absolute flex flex-col"
              style={{ left: "92px", top: "80px" }}
            >
              <button
                onClick={scrollEmulatorToStart}
                className="bg-transparent border-none p-0 m-0 cursor-pointer w-fit"
                aria-label="Volver al inicio"
              >
                <img
                  src={logoBlanco}
                  alt="feat. Consulting"
                  style={{ width: "29.71px", height: "32.77px", flexShrink: 0 }}
                />
              </button>

              <div style={{ marginTop: "85px", maxWidth: "730px" }}>
                <p
                  style={{
                    fontFamily: "Fustat, sans-serif",
                    fontWeight: 400,
                    fontSize: "64.89px",
                    color: "#FFFFFF",
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  We designed this for how how people{" "}
                  <span
                    style={{
                      fontFamily: '"Lato", sans-serif',
                      fontStyle: "italic",
                      fontWeight: 400,
                      color: "#B7A9FF",
                    }}
                  >
                    actually
                  </span>{" "}
                  decide.
                </p>
              </div>

              <div
                style={{
                  marginTop: "33px",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <img
                  src={qrCode}
                  alt="Escanea el QR para continuar en movil"
                  style={{ width: "150px", height: "150px", flexShrink: 0 }}
                />
                <p
                  style={{
                    fontFamily: '"Lato", sans-serif',
                    fontWeight: 300,
                    fontSize: "32.4px",
                    color: "#FFFFFF",
                    lineHeight: 1.3,
                    margin: 0,
                  }}
                >
                  Scan to
                  <br />
                  continue
                  <br />
                  on mobile.
                </p>
              </div>
            </div>

            <div
              className="absolute"
              style={{
                right: "120px",
                bottom: 0,
                width: "550px",
              }}
            >
              <img
                src={mobileSimulated}
                alt=""
                style={{
                  width: "100%",
                  height: "auto",
                  opacity: 0.5,
                  objectFit: "contain",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "40%",
                  background:
                    "linear-gradient(to bottom, transparent 0%, #020A30 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            <p
              className="absolute whitespace-nowrap"
              style={{
                fontFamily: '"Lato", sans-serif',
                fontWeight: 300,
                fontSize: "22.77px",
                color: "#FFFFFF",
                bottom: "100px",
                right: "395px",
                transform: "translateX(50%)",
                margin: 0,
              }}
            >
              Prefer to stay on Desktop?
            </p>

            <button
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              onClick={() => {
                setDesktopHeroAnimationEnabled(true);
                setShowMobile(true);
              }}
              className="absolute"
              style={{
                bottom: "40px",
                right: "395px",
                transform: "translateX(50%)",
                paddingLeft: btnHovered ? "52px" : "32px",
                paddingRight: btnHovered ? "52px" : "32px",
                height: "52px",
                backgroundColor: btnHovered ? "#C6D7F9" : "transparent",
                border: "1px solid rgba(255, 255, 255, 0.30)",
                borderRadius: "24px",
                cursor: "pointer",
                transition: "all 380ms cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontFamily: '"Lato", sans-serif',
                  fontWeight: 300,
                  fontSize: "20px",
                  color: btnHovered ? "#0A0B26" : "#FFFFFF",
                  transition: "color 380ms ease",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.3px",
                }}
              >
                Click here {"->"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${showMobile ? "opacity-100 scale-100" : "opacity-0 pointer-events-none scale-105"}`}
      >
        <div
          style={{
            width: `${BASE_W * scale}px`,
            height: `${BASE_H * scale}px`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: `${BASE_W}px`,
              height: `${BASE_H}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              position: "relative",
            }}
          >
            <button
              onClick={scrollEmulatorToStart}
              className="absolute bg-transparent border-none p-0 m-0 cursor-pointer"
              style={{ top: "35.66px", left: "87px" }}
              aria-label="Volver al inicio"
            >
              <img
                src={logoBlanco}
                alt="feat. logo"
                style={{ width: "35px", height: "38.6px" }}
              />
            </button>

            <div
              className={`absolute left-1/2 -translate-x-1/2 shadow-2xl rounded-t-[35px] bg-[#FCFAF3] flex flex-col overflow-hidden transition-all duration-1000 delay-300 ${showMobile ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
              style={{
                bottom: "0px",
                width: `${EMULATOR_FRAME_WIDTH}px`,
                height: `${EMULATOR_FRAME_HEIGHT}px`,
              }}
            >
              <div
                className="w-full h-full flex flex-col"
                style={{
                  width: `${LOGICAL_VIEWPORT_WIDTH}px`,
                  height: `${LOGICAL_VIEWPORT_HEIGHT + EMULATOR_TOPBAR_HEIGHT}px`,
                  transform: `scale(${EMULATOR_PRESENTATION_SCALE})`,
                  transformOrigin: "top left",
                }}
              >
                <div
                  className="shrink-0 flex items-center bg-[#FCFAF3] z-50 border-b border-brand-dark/10"
                  style={{
                    height: `${EMULATOR_TOPBAR_HEIGHT}px`,
                    paddingLeft: "23px",
                  }}
                >
                  <button
                    onClick={scrollEmulatorToStart}
                    className="bg-transparent border-none p-0 m-0 cursor-pointer flex items-center"
                    aria-label="Volver al inicio"
                  >
                    <Logo width={23} height={26} variant="dark" />
                  </button>
                </div>
                <div
                  className="relative overflow-hidden"
                  style={{ height: `${LOGICAL_VIEWPORT_HEIGHT}px` }}
                >
                  <MobileLayout
                    isDesktopContainer={true}
                    showForm={showForm}
                    enableHeroEntryAnimation={desktopHeroAnimationEnabled}
                  />
                </div>
              </div>
            </div>

            <p
              className="absolute whitespace-nowrap"
              style={{
                color: "#C6D7F9",
                fontFamily: "Lato",
                fontWeight: 300,
                fontSize: "18.21px",
                bottom: "95.46px",
                right: "154px",
                lineHeight: 1,
              }}
            >
              Ready to get growing?
            </p>

            <Link
              to="/contact"
              onClick={() => {
                saveScrollAnchor();
                localStorage.removeItem("selectedTier");
              }}
              className="absolute flex items-center cursor-pointer group hover:opacity-80 transition-opacity"
              style={{ right: "164px", bottom: "36px", textDecoration: "none" }}
            >
              <span
                style={{
                  color: "#FFFFFF",
                  fontFamily: "Fustat",
                  fontWeight: 300,
                  fontSize: "41.81px",
                  lineHeight: 1,
                }}
              >
                Let's talk
              </span>
            </Link>

            <img
              src={flechaIcon}
              alt="Arrow"
              className="absolute"
              style={{
                bottom: "48.89px",
                right: "121.03px",
                width: "23.5px",
                height: "23.5px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
