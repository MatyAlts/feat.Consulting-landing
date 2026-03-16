import { StaggerReveal } from '../shared/StaggerReveal';

export default function TractionReveal() {
  return (
    <div 
      className="flex flex-col w-full overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #FCFAF3 0%, #626472 40%, #626472 85%, #FCFAF3 100%)' }}
    >
      {/* Phrase 1 Section */}
      <section className="w-full flex flex-col justify-center pt-[15vh] pb-[20vh]">
        <div className="w-full flex justify-end px-7">
          <div className="flex flex-col items-end text-right">
            <StaggerReveal staggerDelay={80} baseDelay={200} rootMargin="-20% 0px -20% 0px">
              <h2 
                style={{ 
                  fontFamily: 'Fustat', 
                  fontWeight: 300, 
                  fontSize: '26px', 
                  color: '#1A1A1A',
                  lineHeight: '1.2'
                }}
              >
                It’s not about adding
              </h2>
            </StaggerReveal>
            <StaggerReveal staggerDelay={80} baseDelay={600} rootMargin="-20% 0px -20% 0px">
              <h2 
                style={{ 
                  fontFamily: 'Fustat', 
                  fontWeight: 600, 
                  fontSize: '25px', 
                  color: '#1A1A1A',
                  lineHeight: '1.2'
                }}
              >
                more activity.
              </h2>
            </StaggerReveal>
          </div>
        </div>
      </section>

      {/* Phrase 2 Section */}
      <section className="w-full flex flex-col justify-center pt-[15vh] pb-[25vh]">
        <div className="w-full flex justify-start px-7">
          <div className="flex flex-col items-start text-left">
            <StaggerReveal staggerDelay={80} baseDelay={200} rootMargin="-20% 0px -20% 0px">
              <h2 
                style={{ 
                  fontFamily: 'Fustat', 
                  fontWeight: 300, 
                  fontSize: '25px', 
                  color: '#FFFFFF',
                  lineHeight: '1.2'
                }}
              >
                It’s about making traction
              </h2>
            </StaggerReveal>
            <StaggerReveal staggerDelay={80} baseDelay={600} rootMargin="-20% 0px -20% 0px">
              <h2 
                style={{ 
                  fontFamily: 'Fustat', 
                  fontWeight: 500, 
                  fontSize: '25px', 
                  color: '#FFFFFF',
                  lineHeight: '1.2'
                }}
              >
                easier to repeat.
              </h2>
            </StaggerReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
