import React from 'react';

export default function MobileDecisionStage() {
  const chips = [
    "Awareness depth",
    "Problem clarity",
    "Solution familiarity",
    "Channel context",
    "Evaluation mode",
    "Risk sensitivity",
    "Intent strength",
    "Acquisition source"
  ];

  return (
    <section className="bg-[#FCFAF3] py-20 overflow-hidden">
      <div className="self-stretch inline-flex flex-col justify-start items-start gap-2.5 w-full">
        {/* Header Block */}
        <div className="self-stretch flex flex-col justify-center items-center px-5">
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="self-stretch flex flex-col justify-start items-start gap-1">
              <div className="w-80 text-center justify-start">
                <span className="text-gray-900 text-4xl font-semibold font-['Fustat'] leading-9">Match the Build to the </span>
                <span className="text-indigo-400 text-4xl font-semibold font-['Fustat'] leading-9">Decision Stage</span>
                <span className="text-gray-900 text-4xl font-normal font-['Fustat'] leading-9">.</span>
              </div>
              <div className="self-stretch h-6 text-center justify-start text-slate-900 text-base font-light font-['Fustat']">
                Growth isn’t static. Execution must adapt.
              </div>
            </div>
          </div>
        </div>

        {/* Chips Infinite Carousel */}
        <div className="w-full relative overflow-hidden mt-[10px]">
          <div className="flex w-fit animate-marquee gap-[5px]">
            {/* Primero el set original */}
            {chips.map((text, idx) => (
              <div 
                key={`orig-${idx}`}
                className="px-7 py-4 bg-violet-100/70 rounded-[10px] outline outline-[0.43px] outline-stone-50 backdrop-blur-md flex justify-center items-center gap-1 whitespace-nowrap flex-shrink-0"
              >
                <div className="opacity-80 text-center text-slate-900 text-lg font-extralight font-['Fustat'] leading-5">
                  {text}
                </div>
              </div>
            ))}
            {/* Duplicamos el set para el loop infinito */}
            {chips.map((text, idx) => (
              <div 
                key={`dup-${idx}`}
                className="px-7 py-4 bg-violet-100/70 rounded-[10px] outline outline-[0.43px] outline-stone-50 backdrop-blur-md flex justify-center items-center gap-1 whitespace-nowrap flex-shrink-0"
              >
                <div className="opacity-80 text-center text-slate-900 text-lg font-extralight font-['Fustat'] leading-5">
                  {text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Takes Shape Section */}
        <div className="mt-[51px] self-stretch flex flex-col justify-start items-center gap-8">
          <div className="self-stretch h-6 text-center justify-start text-zinc-600 text-xl font-normal font-['Fustat']">
            This is how the system takes shape:
          </div>
          
          <div className="w-80 flex flex-col justify-start items-start gap-24">
            <div className="self-stretch flex flex-col justify-start items-start gap-20">
              <div className="flex flex-col justify-start items-center gap-6">
                <div className="flex flex-col justify-start items-center">
                  {/* Case Study Card */}
                  <div className="w-80 h-[467px] px-2.5 py-5 bg-[#3B070B]/95 rounded-[40px] flex flex-col justify-center items-center gap-5">
                    <div className="w-80 flex flex-col justify-start items-start px-5">
                      <div className="w-64 justify-center text-white text-xl font-medium font-['Fustat'] leading-6">Context</div>
                      <div className="self-stretch justify-center text-white text-xl font-light font-['Lato'] leading-6">Institutional site wasn’t converting members.</div>
                    </div>
                    <div className="w-80 flex flex-col justify-start items-start px-5">
                      <div className="w-64 justify-center text-white text-xl font-medium font-['Fustat'] leading-6">Intervention</div>
                      <div className="self-stretch justify-center text-white text-xl font-light font-['Lato'] leading-6">Stage-aware landing ecosystem + member-first messaging.</div>
                    </div>
                    <div className="w-80 flex flex-col justify-start items-start px-5">
                      <div className="w-64 justify-center text-white text-xl font-medium font-['Fustat'] leading-6">Impact</div>
                      <div className="self-stretch justify-center text-white text-xl font-light font-['Lato'] leading-6">+27% conversion<br/>Unified positioning across 12+ touchpoints.</div>
                    </div>
                  </div>

                  {/* Category Pill */}
                  <div className="h-12 px-5 py-3.5 bg-zinc-800/95 rounded-[44.92px] flex flex-col justify-end items-center gap-2 -mt-6 z-10">
                    <div className="opacity-90 inline-flex justify-start items-center gap-3.5">
                      <div className="w-3 h-2 origin-top-left -rotate-90 opacity-10 bg-stone-50" />
                      <div className="justify-start text-white text-lg font-medium font-['Fustat'] leading-5">Ads</div>
                      <div className="justify-start text-slate-200 text-lg font-extralight font-['Fustat'] leading-5">Landings</div>
                      <div className="justify-start text-slate-200 text-lg font-extralight font-['Fustat'] leading-5">Websites</div>
                      <div className="justify-start text-slate-200 text-lg font-extralight font-['Fustat'] leading-5">Brands</div>
                      <div className="w-3 h-2 origin-top-left -rotate-90 opacity-30 bg-stone-50" />
                    </div>
                  </div>
                </div>

                {/* Sub-navigation labels */}
                <div className="inline-flex justify-start items-center gap-6">
                  <div className="justify-start text-zinc-600 text-lg font-normal font-['Fustat'] leading-5">Ads</div>
                  <div className="justify-start text-zinc-600 text-lg font-light font-['Fustat'] leading-5">Landings</div>
                  <div className="justify-start text-zinc-600 text-lg font-light font-['Fustat'] leading-5">Websites</div>
                  <div className="justify-start text-zinc-600 text-lg font-light font-['Fustat'] leading-5">Brands</div>
                </div>

                {/* Dots Pagination */}
                <div className="w-28 inline-flex justify-start items-center gap-2">
                  <div className="w-24 flex justify-start items-center gap-3.5">
                    <div className="flex justify-start items-center gap-3.5">
                      <div className="w-3 h-2 origin-top-left -rotate-90 bg-black/25" />
                      <div className="flex justify-start items-center gap-1.5">
                        <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full border-[0.50px] border-black/10" />
                        <div className="w-2 h-2 bg-zinc-300 rounded-full border-[0.50px] border-black/10" />
                        <div className="w-2 h-2 bg-zinc-300 rounded-full border-[0.50px] border-black/10" />
                        <div className="w-2 h-2 bg-zinc-300 rounded-full border-[0.50px] border-black/10" />
                        <div className="w-2 h-2 bg-zinc-300 rounded-full border-[0.50px] border-black/10" />
                      </div>
                    </div>
                    <div className="w-3 h-2 origin-top-left -rotate-90 bg-black/25" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fin de sección */}
            <div className="mt-[135.12px] w-full border-t border-zinc-200/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
