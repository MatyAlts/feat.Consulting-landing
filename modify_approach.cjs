const fs = require('fs');
const filepath = 'src/components/mobile/Approach.tsx';
let content = fs.readFileSync(filepath, 'utf8');

const startMarker = '{/* ── Scroll-scrub wrapper (Release Step 48) ────────────────────── */}';
const endMarker = '{/* ── New Section: Direction Clear ── */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    console.log('Found markers. Applying changes...');
    
    // 1. Delete the JSX section
    content = content.substring(0, startIndex) + content.substring(endIndex);

    // 2. Remove hooks
    content = content.replace('const wrapperRef = useRef<HTMLDivElement>(null);', '');
    content = content.replace('const stickyRef = useRef<HTMLDivElement>(null);', '');
    content = content.replace('const textRef = useRef<HTMLDivElement>(null);', '');
    content = content.replace('const containerRef = useRef<HTMLDivElement>(null);', '');
    content = content.replace('const [translateX, setTranslateX] = useState(0);', '');
    content = content.replace('const textOverflowRef = useRef(0);', '');
    content = content.replace('const [isWeCreateOpen, setIsWeCreateOpen] = useState(false);', '');

    // 3. Remove tracker hook
    const stepTrackerStart = '/* ── Step Tracker ── */';
    const measureStart = '/* ── Measure: wrapper height = sticky natural height + pan travel ── */';
    const sIdx = content.indexOf(stepTrackerStart);
    const mIdx = content.indexOf(measureStart);
    if(sIdx !== -1 && mIdx !== -1) {
        content = content.substring(0, sIdx) + content.substring(mIdx);
    }

    // 4. Remove measure hook
    const scrollStart = '/* ── Scroll → translateX ── */';
    const mIdx2 = content.indexOf(measureStart);
    const cIdx2 = content.indexOf(scrollStart);
    if(mIdx2 !== -1 && cIdx2 !== -1) {
        content = content.substring(0, mIdx2) + content.substring(cIdx2);
    }
    
    // 5. Remove scroll hook
    const accordionStart = '/* ── Accordion State ── */';
    const scrIdx = content.indexOf(scrollStart);
    const accIdx = content.indexOf(accordionStart);
    if(scrIdx !== -1 && accIdx !== -1) {
        content = content.substring(0, scrIdx) + content.substring(accIdx);
    }
    
    content = content.replace('/* ── Accordion State ── */', '');
    
    // 6. Fix redundant blank lines created by removal
    content = content.replace(/(\r?\n){4,}/g, '\n\n');
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Successfully updated Approach.tsx');
} else {
    console.log('Markers not found', startIndex, endIndex);
}
