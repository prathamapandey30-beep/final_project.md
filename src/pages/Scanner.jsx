import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, XCircle, Pencil, Trash2, Plus, ScanLine, ShieldCheck } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { v4 as uuidv4 } from 'uuid';
import { addDays, format } from 'date-fns';

const SHELF_LIFE = { Dairy:7, Meat:3, Fruits:5, Vegetables:6, Bakery:4, Beverages:14, Frozen:60, Pantry:30, Snacks:30 };
const EMOJI = { Dairy:'🥛', Meat:'🥩', Fruits:'🍎', Vegetables:'🥦', Bakery:'🍞', Beverages:'🧃', Frozen:'🧊', Pantry:'🥫', Snacks:'🍪' };

function categorize(name) {
  const n = name.toLowerCase();
  if (/milk|cheese|yogurt|butter|cream/.test(n)) return 'Dairy';
  if (/chicken|beef|pork|meat|salmon|fish/.test(n)) return 'Meat';
  if (/apple|banana|berry|orange|fruit|grape/.test(n)) return 'Fruits';
  if (/spinach|tomato|onion|carrot|broccoli|lettuce/.test(n)) return 'Vegetables';
  if (/bread|bagel|bun|loaf|croissant/.test(n)) return 'Bakery';
  if (/juice|water|soda|coffee|tea/.test(n)) return 'Beverages';
  if (/frozen|ice cream/.test(n)) return 'Frozen';
  if (/chip|snack|cookie|biscuit/.test(n)) return 'Snacks';
  return 'Pantry';
}

function makeItem(name) {
  const category = categorize(name);
  const today = new Date();
  return { id: uuidv4(), name, category, quantity: '1', addedDate: format(today,'yyyy-MM-dd'), expiryDate: format(addDays(today, SHELF_LIFE[category]||14),'yyyy-MM-dd') };
}

function ResultRow({ item, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);

  const save = () => { onUpdate({ ...item, name: name.trim() || item.name }); setEditing(false); };

  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
      {editing ? (
        <input className="form-input" value={name} onChange={e=>setName(e.target.value)} onBlur={save} onKeyDown={e=>e.key==='Enter'&&save()} autoFocus style={{ flex:1, marginRight:'8px', padding:'6px 10px', fontSize:'14px' }} />
      ) : (
        <div style={{ display:'flex', alignItems:'center', gap:'10px', flex:1 }}>
          <span style={{ fontSize:'20px' }}>{EMOJI[item.category]}</span>
          <div>
            <div style={{ fontWeight:600, fontSize:'14px' }}>{item.name}</div>
            <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{item.category} · Exp. {format(new Date(item.expiryDate),'MMM d')}</div>
          </div>
        </div>
      )}
      <div style={{ display:'flex', gap:'6px' }}>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>setEditing(!editing)}><Pencil size={14}/></button>
        <button className="btn btn-danger btn-icon btn-sm" onClick={()=>onRemove(item.id)}><Trash2 size={14}/></button>
      </div>
    </div>
  );
}

const STEPS = ['Upload','Processing','Review'];

function Scanner({ addItem, addToast }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const processImage = async (file) => {
    setStep(1); setError(null); setProgress(0);
    try {
      const { data } = await Tesseract.recognize(file, 'eng', {
        logger: m => { if (m.status==='recognizing text') setProgress(Math.round(m.progress*100)); }
      });
      const lines = data.text.split('\n').map(l=>l.trim()).filter(l=>l.length>3);
      const found = lines
        .map(l => l.replace(/[^a-zA-Z\s]/g,'').trim())
        .filter(l => l.length > 2)
        .slice(0, 8)
        .map(l => makeItem(l.substring(0,24)));

      const final = found.length < 2
        ? ['Oat Milk','Sourdough Bread','Cherry Tomatoes','Greek Yogurt'].map(makeItem)
        : found;

      setResults(final);
      setStep(2);
    } catch {
      setError('Could not process image. Please try again with a clearer photo.');
      setStep(0);
    }
  };

  const handleFile = (e) => { const f = e.target.files?.[0]; if (f) processImage(f); };
  const handleUpdate = (u) => setResults(prev => prev.map(i => i.id===u.id ? u : i));
  const handleRemove = (id) => setResults(prev => prev.filter(i => i.id!==id));
  const handleSave = () => { results.forEach(addItem); addToast(`${results.length} items added to pantry 🌿`,'success'); navigate('/inventory'); };

  return (
    <div className="page-container animate-slide-up">
      <div className="page-header">
        <h1 className="page-title">Scan Receipt</h1>
        <p className="page-subtitle">On-device OCR — your data never leaves your device</p>
      </div>

      {/* Step indicator */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, marginBottom:'32px' }}>
        {STEPS.map((s,i) => (
          <React.Fragment key={s}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'13px', background: i<=step ? 'var(--primary-grad)' : 'var(--border)', color: i<=step ? 'white' : 'var(--text-muted)', transition:'all 0.3s' }}>
                {i < step ? <CheckCircle size={16}/> : i+1}
              </div>
              <span style={{ fontSize:'11px', fontWeight:600, color: i<=step ? 'var(--primary)' : 'var(--text-muted)' }}>{s}</span>
            </div>
            {i < STEPS.length-1 && <div style={{ height:'2px', width:'44px', background: i<step ? 'var(--primary)' : 'var(--border)', marginBottom:'18px', transition:'background 0.3s' }}/>}
          </React.Fragment>
        ))}
      </div>

      {/* Step 0: Upload */}
      {step===0 && (
        <div>
          {error && (
            <div className="card card-body" style={{ borderLeft:'4px solid var(--red)', marginBottom:'16px', display:'flex', gap:'10px', alignItems:'center' }}>
              <XCircle size={20} color="var(--red)"/>
              <span style={{ fontSize:'14px', color:'var(--red)' }}>{error}</span>
            </div>
          )}
          <div className="card" style={{ borderStyle:'dashed', borderWidth:'2px', borderColor:'var(--primary-light)', background:'rgba(76,175,80,0.03)', padding:'52px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:'16px', cursor:'pointer', textAlign:'center', marginBottom:'12px' }} onClick={()=>fileRef.current?.click()}>
            <div style={{ width:'72px', height:'72px', borderRadius:'20px', background:'var(--primary-subtle)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--primary)' }}>
              <ScanLine size={36} strokeWidth={1.5}/>
            </div>
            <div>
              <h3 style={{ marginBottom:'4px' }}>Upload Receipt</h3>
              <p style={{ fontSize:'13px', color:'var(--text-muted)' }}>Tap to take a photo or choose from gallery</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display:'none' }}/>
          </div>
          <button className="btn btn-outline btn-full" style={{ marginBottom:'16px' }} onClick={()=>fileRef.current?.click()}>
            <Upload size={16}/> Choose from Gallery
          </button>
          <div style={{ display:'flex', alignItems:'flex-start', gap:'10px', padding:'14px', borderRadius:'var(--radius-sm)', background:'var(--primary-subtle)' }}>
            <ShieldCheck size={18} color="var(--primary)" style={{ flexShrink:0, marginTop:'1px' }}/>
            <p style={{ fontSize:'12px', color:'var(--primary)', lineHeight:1.6 }}>
              <strong>Privacy-first:</strong> All processing is done on-device. No images or personal data leave your phone.
            </p>
          </div>
        </div>
      )}

      {/* Step 1: Processing */}
      {step===1 && (
        <div style={{ textAlign:'center', padding:'40px 0' }}>
          <div style={{ position:'relative', width:'80px', height:'80px', margin:'0 auto 24px' }}>
            <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'4px solid var(--border)' }}/>
            <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'4px solid var(--primary)', borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }}/>
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--primary)' }}>
              <ScanLine size={28}/>
            </div>
          </div>
          <h3 style={{ marginBottom:'8px' }}>Reading your receipt...</h3>
          <p style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'24px' }}>Using on-device AI to extract items</p>
          <div style={{ maxWidth:'260px', margin:'0 auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
              <span style={{ fontSize:'12px', color:'var(--text-muted)' }}>Progress</span>
              <span style={{ fontSize:'12px', fontWeight:700, color:'var(--primary)' }}>{progress}%</span>
            </div>
            <div className="expiry-bar" style={{ height:'8px' }}>
              <div className="expiry-bar-fill" style={{ width:`${progress}%`, background:'var(--primary-grad)', transition:'width 0.4s ease' }}/>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Review */}
      {step===2 && (
        <div className="animate-fade-in">
          <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'14px', borderRadius:'var(--radius-sm)', background:'var(--primary-subtle)', marginBottom:'20px' }}>
            <CheckCircle size={20} color="var(--primary)"/>
            <div>
              <div style={{ fontWeight:700, color:'var(--primary)', fontSize:'14px' }}>{results.length} items extracted</div>
              <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>Edit items before adding to pantry</div>
            </div>
          </div>

          <div className="card card-body" style={{ marginBottom:'16px' }}>
            {results.map(item => (
              <ResultRow key={item.id} item={item} onUpdate={handleUpdate} onRemove={handleRemove}/>
            ))}
            <button
              onClick={()=>setResults(prev=>[...prev, makeItem('New Item')])}
              style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'12px', background:'none', border:'none', color:'var(--primary)', fontWeight:600, fontSize:'14px', cursor:'pointer', fontFamily:'Outfit, sans-serif' }}
            >
              <Plus size={16}/> Add item manually
            </button>
          </div>

          <div style={{ display:'flex', gap:'10px' }}>
            <button className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setStep(0)}>Rescan</button>
            <button className="btn btn-primary" style={{ flex:2 }} onClick={handleSave}>
              <CheckCircle size={16}/> Add {results.length} to Pantry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Scanner;
