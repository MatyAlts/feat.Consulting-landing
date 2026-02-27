import { useEffect, useState } from 'react';
import logo from '../../assets/icons/loading ft.png';

interface LoadingProps {
    onComplete?: () => void;
}

export default function Loading({ onComplete }: LoadingProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Disable scrolling
        document.body.style.overflow = 'hidden';

        const timers = [
            setTimeout(() => setStep(1), 400),   // Logo slides left
            setTimeout(() => setStep(2), 1400),  // Text slides out
            setTimeout(() => setStep(3), 3200),  // Text hides back (Reduced 400ms total)
            setTimeout(() => setStep(4), 4400),  // Logo returns to center
            setTimeout(() => setStep(5), 5400),  // Page reveal
            setTimeout(() => {
                setIsVisible(false);
                document.body.style.overflow = ''; // Re-enable scrolling
            }, 6400),
        ];

        // Avisar a la app un poco antes de que termine el reveal para que el Hero se prepare
        const completeTimer = setTimeout(() => {
            onComplete?.();
        }, 5400);

        return () => {
            timers.forEach(clearTimeout);
            clearTimeout(completeTimer);
            document.body.style.overflow = '';
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#0B1932] transition-transform duration-800 ease-in-out z-[9999] ${step === 5 ? 'translate-y-full pointer-events-none' : 'translate-y-0'
                }`}
        >
            <div className="relative flex items-center justify-center">
                {/* Moving Unit: Contiene Logo y el portal de salida del Texto */}
                <div
                    className={`relative flex items-center justify-center transition-transform duration-800 cubic-bezier(0.22, 1, 0.36, 1) ${step >= 1 && step <= 3 ? '-translate-x-[115.5px]' : 'translate-x-0'
                        }`}
                >
                    {/* Portal de salida del Texto (Máscara) */}
                    <div
                        className="absolute overflow-hidden flex items-center"
                        style={{
                            left: '50%',
                            marginLeft: '54.91px', // Empieza justo en el borde derecho del logo (109.82 / 2)
                            width: '300px',
                            height: '100px',
                        }}
                    >
                        <div
                            className={`whitespace-nowrap font-['Prompt'] text-[53px] font-extralight italic text-[#B9D6EF] transition-all duration-1000 cubic-bezier(0.22, 1, 0.36, 1) ${step === 2
                                ? 'translate-x-[7.2px] opacity-100'
                                : 'translate-x-[-100%] opacity-0'
                                }`}
                        >
                            Direction
                        </div>
                    </div>

                    {/* Logo Container - Actúa como el bloque sólido de donde sale el texto */}
                    <div className="relative z-10 bg-[#0B1932]">
                        <img
                            src={logo}
                            alt="FT Logo"
                            style={{
                                width: '109.82px',
                                height: 'auto',
                                transform: 'translateZ(0)',
                                backfaceVisibility: 'hidden'
                            }}
                            className="block"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
