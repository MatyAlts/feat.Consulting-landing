import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loadingFt from '../../assets/icons/loading ft.png';
import flechaIcon from '../../assets/icons/flecha.svg';

const faqs = [
  {
    question: "How long does this take?",
    answer: "Calibration is measured in weeks, not quarters.\n\nThe goal isn’t to “study” your business — it’s to isolate the leverage point quickly and align on a clear path forward. The majority of teams leave the first few weeks with directional clarity and a concrete plan of action. From there, we either implement or integrate with your team to move.\n\nOur work is designed to accelerate decisions, not delay them."
  },
  {
    question: "Who is this for (and not for)?",
    answer: "This is built for post-traction teams.\n\nIf you have signal, revenue, or a working engine but growth feels scattered, stalled, or inefficient, this is for you.\n\nIt is not for pre-offer startups, and it’s not for teams looking for surface-level campaign support. This work assumes you’re serious about structural scale."
  },
  {
    question: "What if we already have a direction?",
    answer: "That’s ideal.\n\nIf you come in with a strong point of view, we pressure-test and refine it, not replace it. Calibration often sharpens what’s already working and removes the noise around it.\n\nIf conviction is there, we build from it. If it’s still forming, we shape it together.\n\nEither way, nothing resets unnecessarily."
  },
  {
    question: "How do you work with our internal team?",
    answer: "We integrate.\n\nSome clients rely on us for full cross-surface execution. Others have internal teams we collaborate with directly. In both cases, direction and decisions are shared, and execution is coordinated."
  },
  {
    question: "What happens after calibration?",
    answer: "You have options.\n\nSome teams implement internally with our guidance.\nOthers continue with us to extend the system across surfaces (site, funnels, product, acquisition, sales enablement).\n\nCalibration defines the path. What comes next depends on where scale is constrained."
  },
  {
    question: "How is this different from hiring internally or a typical agency?",
    answer: "Agencies execute tasks.\nInternal hires specialize in lanes.\n\nWe work at the structural layer: aligning Product, Marketing, and Sales around the same growth logic.\n\nThe outcome isn’t more campaigns.\nIt’s a unified system where what works carries across surfaces and compounds over time."
  }
];

export default function MobileFAQs() {
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faqs" className="w-full">
      <div className="bg-[#FCFAF3]">
        <div className="pl-[21px] pr-5">
          <h2 
            className="font-['Fustat'] font-medium leading-[1.05] text-[#171425]"
            style={{ fontSize: '45.18px', paddingTop: '87.62px' }}
          >
            Frequently <br /> Asked Questions
          </h2>
          
          <p 
            className="font-['Fustat'] font-normal text-[#48435D]"
            style={{ fontSize: '16.21px', marginTop: '1px' }}
          >
            The practical details.
          </p>

          <p 
            className="font-['Fustat'] font-light text-[#191432] leading-[1.3]"
            style={{ fontSize: '22.05px', marginTop: '13px' }}
          >
            This isn’t a traditional consulting engagement. <br />
            It’s a structural growth intervention.<br /><br />
            Here’s what most teams want <br />
            clarified before moving forward.
          </p>
        </div>

        <div className="mt-[19.12px] flex flex-col gap-4 px-[15px]">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div 
                key={idx}
                className="w-full bg-[#FFFEFE] overflow-hidden transition-colors duration-300"
                style={{ 
                  border: '0.2px solid #191432',
                  borderRadius: '8px'
                }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className={`w-full flex items-center text-left pl-[16.48px] pr-6 outline-none transition-colors duration-300 ${isOpen ? 'bg-[#191432]' : 'bg-transparent'}`}
                  style={{ height: '55.66px' }}
                >
                  <span 
                    className={`font-['Fustat'] font-normal flex-1 transition-colors duration-300`}
                    style={{ fontSize: '17px', color: isOpen ? '#FFFFFF' : '#191432' }}
                  >
                    {faq.question}
                  </span>
                  <span 
                    className={`ml-2 text-2xl font-light transition-colors duration-300`}
                    style={{ color: isOpen ? '#FFFFFF' : '#191432' }}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div 
                    className="pl-[16.48px] pr-[16.48px] pt-6 pb-8 font-['Fustat'] font-light text-[#191432] whitespace-pre-line bg-[#F0F3F4]"
                    style={{ fontSize: '16px', lineHeight: '1.4' }}
                  >
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="h-4" /> {/* 16px spacer after FAQs */}
      </div>

      {/* background transition and CTA section */}
      <div className="relative">
        {/* Background layer: half cream, half dark blue */}
        <div className="absolute inset-0 flex flex-col pointer-events-none">
          <div className="h-[50%] w-full bg-[#FCFAF3]" />
          <div className="h-[50%] w-full bg-[#021B30]" />
        </div>

        {/* content layer */}
        <div className="relative z-10 px-[15px]">
          <div 
            className="w-full bg-[#FFFFFF] flex flex-col items-center text-center px-6 pb-12 shadow-xl"
            style={{ 
              border: '0.2px solid #191432',
              borderRadius: '19.97px'
            }}
          >
            <h2 
              className="font-['Fustat'] font-semibold text-[#191432] leading-tight"
              style={{ fontSize: '39.69px', marginTop: '54.91px' }}
            >
              Have a specific <br /> question?
            </h2>
            
            <p 
              className="font-['Fustat'] font-light text-[#191432] leading-snug"
              style={{ fontSize: '21.3px', marginTop: '0px' }}
            >
              If something isn’t covered <br /> above, you can ask us directly.
            </p>

            <button 
              onClick={() => navigate('/contact')}
              className="w-full max-w-[325px] flex items-center justify-center rounded-full active:scale-[0.98] transition-transform shadow-sm"
              style={{ 
                backgroundColor: '#8B8CFB', 
                height: '60px',
                marginTop: '15.98px'
              }}
            >
              <span className="text-[#191432] font-['Fustat'] font-medium" style={{ fontSize: '18.75px' }}>
                Get in touch →
              </span>
            </button>

            <p 
              className="font-['Lato'] font-extralight text-[#191432]"
              style={{ fontSize: '14.56px', marginTop: '10px' }}
            >
              Clarity first. Decisions later.
            </p>
          </div>
        </div>
      </div>

      {/* Dark background section for footer elements */}
      <div className="bg-[#021B30] pb-32">
        <div className="flex flex-col items-start px-[19px]">
          <img 
            src={loadingFt} 
            alt="feat. logo" 
            className="w-[66px] object-contain"
            style={{ marginTop: '119.56px' }}
          />
          
          <h2 
            className="text-white font-['Fustat'] font-light leading-[1.1] tracking-tight" 
            style={{ fontSize: '48px', marginTop: '29px' }}
          >
            It’s time to <br />
            optimize your <br />
            <span className="font-normal" style={{ color: '#A3A8F7' }}>Positioning</span>
          </h2>

          <div style={{ marginTop: '29px' }}>
            <a 
              href="/contact" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/contact');
              }}
              className="flex items-center text-white font-['Fustat'] font-light tracking-tight group"
              style={{ fontSize: '23px' }}
            >
              <span className="underline underline-offset-[6px] decoration-white/30 group-hover:decoration-white transition-colors">
                Let’s make it perform
              </span>
              <img 
                src={flechaIcon} 
                alt="" 
                className="w-[14px] h-[14px] inline-block"
                style={{ 
                  marginLeft: '5.8px',
                  filter: 'brightness(0) invert(1)' 
                }}
              />
            </a>
          </div>

          <div style={{ marginTop: '231px' }}>
            <p 
              className="font-['Fustat'] font-light" 
              style={{ fontSize: '20.61px', color: '#D2D2FF' }}
            >
              feat. partners globally.
            </p>
            <p 
              className="font-['Fustat'] font-extralight" 
              style={{ fontSize: '17px', color: '#D2D2FF' }}
            >
              Across markets, stages, and time zones.
            </p>
            
            <div className="flex items-center" style={{ marginTop: '37px', gap: '37px' }}>
              <a 
                href="mailto:hi@feat.consulting" 
                className="font-['Fustat'] font-extralight underline underline-offset-[4px] decoration-[#D2D2FF]/30 hover:decoration-[#D2D2FF] transition-colors" 
                style={{ fontSize: '16.32px', color: '#D2D2FF' }}
              >
                hi@feat.consulting
              </a>
              <a 
                href="https://www.linkedin.com/company/feat-consulting" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Fustat'] font-extralight underline underline-offset-[4px] decoration-[#D2D2FF]/30 hover:decoration-[#D2D2FF] transition-colors" 
                style={{ fontSize: '16.32px', color: '#D2D2FF' }}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
