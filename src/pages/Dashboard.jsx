import React, { useMemo } from 'react';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Flame, Leaf, Euro, Wind, AlertTriangle, ChevronRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

// Animated circular progress ring
function ProgressRing({ value, max, color, size = 72, stroke = 7, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const dash = pct * circ;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', lineHeight: 1.1,
      }}>
        {children}
      </div>
    </div>
  );
}

// Expiry urgency label
function UrgencyBadge({ daysLeft }) {
  if (daysLeft < 0)  return <span className="badge badge-red">Expired</span>;
  if (daysLeft === 0) return <span className="badge badge-red">Today!</span>;
  if (daysLeft <= 2)  return <span className="badge badge-amber">{daysLeft}d left</span>;
  return <span className="badge badge-green">{daysLeft}d left</span>;
}

const ACHIEVEMENTS = [
  { id: 'a1', emoji: '🌱', label: 'First Scan', desc: 'Scanned your first receipt', earned: true },
  { id: 'a2', emoji: '🍽️', label: 'Zero Waste Week', desc: 'No items expired for 7 days', earned: true },
  { id: 'a3', emoji: '💚', label: 'Eco Warrior', desc: 'Saved 5 kg of food waste', earned: false },
  { id: 'a4', emoji: '👨‍🍳', label: 'Chef in Training', desc: 'Used 10 recipe suggestions', earned: false },
];

function Dashboard({ inventory, addToast }) {
  const today = new Date();

  const stats = useMemo(() => {
    const expiring = inventory.filter(i => {
      const d = differenceInDays(parseISO(i.expiryDate), today);
      return d >= 0 && d <= 3;
    }).sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

    const expired = inventory.filter(i => differenceInDays(parseISO(i.expiryDate), today) < 0);
    const safe = inventory.filter(i => differenceInDays(parseISO(i.expiryDate), today) > 3);

    return { expiring, expired, safe, total: inventory.length };
  }, [inventory, today]);

  const impact = { money: 124.5, wasteKg: 12.4, co2Kg: 31.0, streak: 7, monthlyGoal: 20 };

  return (
    <div className="page-container animate-slide-up">

      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Leaf size={20} color="var(--primary)" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>GreenPlate</span>
          </div>
          <h1 className="page-title">Your Impact</h1>
          <p className="page-subtitle">{format(today, 'EEEE, MMMM d')}</p>
        </div>
        <div style={{ textAlign: 'center', background: 'var(--primary-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
            <Flame size={18} color="var(--amber)" />
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--amber)' }}>{impact.streak}</span>
          </div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Day Streak</div>
        </div>
      </div>

      {/* Impact Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '24px' }}>
        {[
          { icon: <Euro size={18} />, value: `€${impact.money}`, label: 'Saved', color: '#22c55e' },
          { icon: <Leaf size={18} />, value: `${impact.wasteKg}kg`, label: 'Waste ↓', color: 'var(--primary)' },
          { icon: <Wind size={18} />, value: `${impact.co2Kg}kg`, label: 'CO₂ ↓', color: 'var(--blue)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ color: s.color, marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Monthly Goal Progress */}
      <div className="card card-body" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ProgressRing value={impact.wasteKg} max={impact.monthlyGoal} color="var(--primary)" size={80} stroke={8}>
            <span style={{ fontSize: '15px', fontWeight: 800 }}>{Math.round((impact.wasteKg / impact.monthlyGoal) * 100)}%</span>
          </ProgressRing>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>Monthly Goal</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              {impact.wasteKg} kg of {impact.monthlyGoal} kg waste prevented
            </div>
            <div className="expiry-bar">
              <div
                className="expiry-bar-fill"
                style={{ width: `${(impact.wasteKg / impact.monthlyGoal) * 100}%`, background: 'var(--primary-grad)' }}
              />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '6px', fontWeight: 600 }}>
              <TrendingUp size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {impact.monthlyGoal - impact.wasteKg} kg to go this month
            </div>
          </div>
        </div>
      </div>

      {/* Pantry Overview */}
      <div className="section-header">
        <h2>Pantry Overview</h2>
        <Link to="/inventory" style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '13px', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          View all <ChevronRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '24px' }}>
        {[
          { label: 'Total Items', value: stats.total, color: 'var(--blue)', bg: 'var(--blue-subtle)' },
          { label: 'Expiring Soon', value: stats.expiring.length, color: 'var(--amber)', bg: 'var(--amber-subtle)' },
          { label: 'Expired', value: stats.expired.length, color: 'var(--red)', bg: 'var(--red-subtle)' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ background: s.bg, border: `1px solid ${s.bg}` }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: s.color, fontWeight: 600, opacity: 0.8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Expiring Soon List */}
      {stats.expiring.length > 0 && (
        <>
          <div className="section-header">
            <h2>Use These First</h2>
            <span className="badge badge-amber">
              <AlertTriangle size={10} /> {stats.expiring.length} urgent
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {stats.expiring.map(item => {
              const daysLeft = differenceInDays(parseISO(item.expiryDate), today);
              const pct = Math.max(0, Math.min(1, daysLeft / 7));
              const barColor = daysLeft <= 1 ? 'var(--red)' : daysLeft <= 3 ? 'var(--amber)' : 'var(--primary)';

              return (
                <div key={item.id} className="card card-hover" style={{ padding: '14px 16px', marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.quantity} · {item.category}</div>
                    </div>
                    <UrgencyBadge daysLeft={daysLeft} />
                  </div>
                  <div className="expiry-bar">
                    <div className="expiry-bar-fill" style={{ width: `${pct * 100}%`, background: barColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Achievements */}
      <div className="section-header" style={{ marginBottom: '12px' }}>
        <h2>Achievements</h2>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {ACHIEVEMENTS.filter(a => a.earned).length}/{ACHIEVEMENTS.length}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {ACHIEVEMENTS.map(a => (
          <div key={a.id} className="achievement" style={{ opacity: a.earned ? 1 : 0.45 }}>
            <div className="achievement-icon" style={{ background: a.earned ? 'var(--primary-subtle)' : 'var(--border)' }}>
              {a.emoji}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>{a.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.desc}</div>
            </div>
            {a.earned && <span className="badge badge-green" style={{ marginLeft: 'auto', flexShrink: 0 }}>Earned</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
