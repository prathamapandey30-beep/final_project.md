import React from 'react';
import { UserCircle, Shield, Bell, Moon, LogOut, ChevronRight, Leaf, Heart } from 'lucide-react';

function SettingRow({ icon, label, desc, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '14px 0',
      borderBottom: '1px solid var(--border)',
      cursor: 'pointer',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '12px',
        background: 'var(--bg-alt)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: 'var(--primary)', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '14px' }}>{label}</div>
        {desc && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</div>}
      </div>
      {action || <ChevronRight size={16} color="var(--text-muted)" />}
    </div>
  );
}

function Profile({ addToast }) {
  return (
    <div className="page-container animate-slide-up">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Settings & preferences</p>
      </div>

      {/* User Card */}
      <div className="card card-body" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'var(--primary-grad)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', flexShrink: 0,
        }}>
          <UserCircle size={32} strokeWidth={1.5} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '16px' }}>GreenPlate User</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Free Plan · Finland 🇫🇮</div>
        </div>
      </div>

      {/* Settings Section */}
      <h2 style={{ marginBottom: '4px' }}>Settings</h2>
      <div className="card card-body" style={{ marginBottom: '24px' }}>
        <SettingRow
          icon={<Bell size={18} />}
          label="Notifications"
          desc="Expiry alerts & reminders"
        />
        <SettingRow
          icon={<Moon size={18} />}
          label="Appearance"
          desc="Follows your system theme"
        />
        <SettingRow
          icon={<Shield size={18} />}
          label="Privacy & Data"
          desc="GDPR compliant · On-device processing"
        />
      </div>

      {/* About Section */}
      <h2 style={{ marginBottom: '4px' }}>About</h2>
      <div className="card card-body" style={{ marginBottom: '24px' }}>
        <SettingRow
          icon={<Leaf size={18} />}
          label="GreenPlate v1.0.0"
          desc="MVP · Built for Finnish households"
          action={<span className="badge badge-green">Latest</span>}
        />
        <SettingRow
          icon={<Heart size={18} />}
          label="Rate GreenPlate"
          desc="Help us reach more people"
        />
      </div>

      {/* GDPR Notice */}
      <div style={{
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--primary-subtle)',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Shield size={16} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--primary)' }}>Privacy Notice</span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          GreenPlate is designed privacy-first. All receipt scanning and data processing happens entirely on your device. 
          No personal data is sent to external servers. We comply with GDPR regulations. 
          You can delete all your data at any time.
        </p>
      </div>

      {/* Danger Zone */}
      <div className="card card-body">
        <button
          className="btn btn-danger btn-full"
          onClick={() => {
            localStorage.clear();
            addToast('All local data cleared', 'info');
          }}
        >
          <LogOut size={16} /> Clear All Data
        </button>
      </div>
    </div>
  );
}

export default Profile;
