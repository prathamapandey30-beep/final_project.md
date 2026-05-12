import React, { useState } from 'react';
import { ArrowRight, Leaf, ScanLine, BellRing, ChefHat } from 'lucide-react';

const SLIDES = [
  {
    icon: <Leaf size={52} strokeWidth={1.5} />,
    color: '#2e7d32',
    bg: 'rgba(46,125,50,0.08)',
    title: 'Welcome to GreenPlate',
    desc: 'Your smart kitchen companion that helps Finnish households reduce food waste and save money — automatically.',
  },
  {
    icon: <ScanLine size={52} strokeWidth={1.5} />,
    color: '#1976d2',
    bg: 'rgba(25,118,210,0.08)',
    title: 'Scan Any Receipt',
    desc: 'Point your camera at a grocery receipt. GreenPlate extracts every item instantly using on-device OCR — no cloud, no privacy risk.',
  },
  {
    icon: <BellRing size={52} strokeWidth={1.5} />,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    title: 'Never Waste Food Again',
    desc: 'Get smart alerts before items expire. GreenPlate tracks shelf life for every category so you always know what to use first.',
  },
  {
    icon: <ChefHat size={52} strokeWidth={1.5} />,
    color: '#9c27b0',
    bg: 'rgba(156,39,176,0.08)',
    title: 'Cook Before It Expires',
    desc: 'Receive personalized recipe suggestions based on ingredients that are about to expire. Turn waste into delicious meals.',
  },
];

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const current = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return (
    <div className="onboarding-overlay" style={{ justifyContent: 'space-between', padding: '60px 24px 48px' }}>
      {/* Skip */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onComplete}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}
        >
          Skip
        </button>
      </div>

      {/* Slide Content */}
      <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        <div style={{
          width: '120px', height: '120px',
          borderRadius: '36px',
          background: current.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: current.color,
          boxShadow: `0 12px 40px ${current.bg}`,
          transition: 'all 0.4s ease',
        }}>
          {current.icon}
        </div>

        <div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '12px', lineHeight: 1.2 }}>
            {current.title}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '300px', margin: '0 auto' }}>
            {current.desc}
          </p>
        </div>
      </div>

      {/* Dots & CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: i === step ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === step ? 'var(--primary)' : 'var(--border-strong)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        <button
          className="btn btn-primary btn-full"
          style={{ fontSize: '16px', padding: '16px 24px' }}
          onClick={() => isLast ? onComplete() : setStep(s => s + 1)}
        >
          {isLast ? '🌱 Get Started' : <>Next <ArrowRight size={18} /></>}
        </button>
      </div>
    </div>
  );
}

export default Onboarding;
