import { useEffect, useRef, useState } from 'react';
import logo from '../../assets/icons/loading ft.png';

interface LoadingProps {
    onComplete?: () => void;
}

export default function Loading({ onComplete }: LoadingProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [step, setStep] = useState(0);
    const onCompleteRef = useRef(onComplete);
    const [viewport, setViewport] = useState(() => ({
        width: window.innerWidth,
        height: window.innerHeight,
    }));

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        const handleResize = () => {
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const timers = [
            setTimeout(() => setStep(1), 350),
            setTimeout(() => setStep(2), 1100),
            setTimeout(() => setStep(5), 2200),
            setTimeout(() => {
                setIsVisible(false);
                document.body.style.overflow = '';
            }, 3000),
        ];

        const completeTimer = setTimeout(() => {
            onCompleteRef.current?.();
        }, 2200);

        return () => {
            timers.forEach(clearTimeout);
            clearTimeout(completeTimer);
            document.body.style.overflow = '';
        };
    }, []);

    if (!isVisible) return null;

    const isMobile = viewport.width < 1024;
    const sizeByWidth = viewport.width / 390;
    const sizeByHeight = viewport.height / 844;
    const minScale = viewport.height <= 570 ? 0.74 : 0.84;
    const introScale = isMobile ? Math.min(1, Math.max(minScale, Math.min(sizeByWidth, sizeByHeight))) : 1;

    const logoWidth = 109.82 * introScale;
    const unitShift = 115.5 * introScale;
    const portalWidth = 300 * introScale;
    const portalHeight = 100 * introScale;
    const textSize = 53 * introScale;
    const textEnterOffset = 7.2 * introScale;

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#0B1932] transition-transform duration-800 ease-in-out z-[9999] ${step === 5 ? 'translate-y-full pointer-events-none' : 'translate-y-0'}`}
        >
            <div className="relative flex items-center justify-center">
                <div
                    className="relative flex items-center justify-center transition-transform duration-800 cubic-bezier(0.22, 1, 0.36, 1)"
                    style={{ transform: step >= 1 && step <= 3 ? `translateX(-${unitShift}px)` : 'translateX(0px)' }}
                >
                    <div
                        className="absolute overflow-hidden flex items-center"
                        style={{
                            left: '50%',
                            marginLeft: `${logoWidth / 2}px`,
                            width: `${portalWidth}px`,
                            height: `${portalHeight}px`,
                        }}
                    >
                        <div
                            className="whitespace-nowrap font-['Prompt'] font-extralight italic text-[#B9D6EF] transition-all duration-1000 cubic-bezier(0.22, 1, 0.36, 1)"
                            style={{
                                fontSize: `${textSize}px`,
                                transform: step === 2 ? `translateX(${textEnterOffset}px)` : 'translateX(-100%)',
                                opacity: step === 2 ? 1 : 0,
                            }}
                        >
                            Direction
                        </div>
                    </div>

                    <div className="relative z-10 bg-[#0B1932]">
                        <img
                            src={logo}
                            alt="FT Logo"
                            style={{
                                width: `${logoWidth}px`,
                                height: 'auto',
                                transform: 'translateZ(0)',
                                backfaceVisibility: 'hidden',
                            }}
                            className="block"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
