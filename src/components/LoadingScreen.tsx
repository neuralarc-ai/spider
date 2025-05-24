// components/LoadingScreen.tsx
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

const steps = [
  {
    title: 'Document Processing',
    description: 'Extracting text and data from pitch deck.'
  },
  {
    title: 'Startup Profile',
    description: 'Analyzing company information and business model.'
  },
  {
    title: 'Market Analysis',
    description: 'Evaluating market position and competition.'
  },
  {
    title: 'Sentiment Analysis',
    description: 'Assessing pitch clarity and investor impact.'
  },
  {
    title: 'Report Generation',
    description: 'Creating comprehensive investment analysis.'
  }
];

interface LoadingScreenProps {
  progress?: number;
  text?: string;
}

const LoadingScreen = ({ progress = 0 }: LoadingScreenProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const animationDuration = 500;
    const startTime = Date.now();
    const startProgress = animatedProgress;
    const targetProgress = progress;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const prog = Math.min(elapsed / animationDuration, 1);
      const currentProgress = startProgress + (targetProgress - startProgress) * prog;
      setAnimatedProgress(currentProgress);
      if (prog < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [progress]);

  const currentStep = Math.min(Math.floor(progress / 20), steps.length - 1);

  return (
    <div className="flex-grow flex flex-row items-center justify-center gap-12">
      {/* Left blank card */}
      <Card className="w-[35vw] h-[80vh] rounded-[16px] border-none flex flex-col" style={{ background: 'linear-gradient(180deg, #765E54 0%, #312119 100%)' }}>
        <div className="pt-8 pl-8 text-white text-[32px] font-normal" style={{ fontFamily: 'Fustat, sans-serif' }}>
          Spider
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img src="/images/loginspark.svg" alt="Login Spark" className="w-[90%] max-w-[600px] h-auto" />
        </div>
      </Card>
      <div className="text-2xl font-semibold flex flex-col items-center justify-center">
        Processing....
        {/* Progress Bar */}
        <div className="w-72 h-1 rounded-full mt-4 mb-6" style={{ background: '#E0E0E0', overflow: 'hidden' }}>
          <div
            style={{
              width: `${animatedProgress}%`,
              height: '100%',
              borderRadius: 8,
              background: 'linear-gradient(90deg, #262626 0%, #3987BE 52%, #D48EA3 100%)',
              transition: 'width 0.2s ease-out'
            }}
          />
        </div>
        {/* Steps */}
        <div className="flex flex-col gap-6 w-full max-w-xs items-start mb-6">
          {steps.map((step, idx) => {
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            return (
              <div
                key={idx}
                className={`flex items-start gap-4 w-full transition-all duration-300 ${isActive ? 'opacity-100 translate-x-[2px]' : isCompleted ? 'opacity-100' : 'opacity-60'}`}
              >
                {/* Circle */}
                <div
                  className={`flex items-center justify-center mt-[2px] transition-all duration-300`}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: isCompleted ? '#4C4740' : isActive ? '#4C474073' : '#DADADA',
                    border: isCompleted || isActive ? '12px solid #29241E' : '12px solid #DADADA',
                    boxShadow: isActive ? '0 0 0 2px #e0e0e0' : undefined,
                  }}
                />
                {/* Texts */}
                <div className="flex-1 pt-[6px]">
                  <div className="font-medium mb-[2px] text-[15px] leading-[1.5] tracking-tight pl-[2px]" style={{ color: isActive ? '#232323' : '#BDBDBD' }}>{step.title}</div>
                  <div className="text-sm" style={{ color: isActive ? '#232323' : '#BDBDBD' }}>{step.description}</div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Important Notice */}
        <div className="w-full max-w-xs p-4 rounded-[8px] border text-sm" style={{ border: '1.5px solid #BB525273', color: '#BB5252' }}>
          <strong className="block mb-2">Important Notice</strong>
          <div>
            Please stay on screen. Do not refresh or change while analysis is in progress. This process will take few minutes to complete. Thank you for patience!
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
