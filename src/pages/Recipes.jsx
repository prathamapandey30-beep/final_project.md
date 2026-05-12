import React, { useMemo, useState } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { ChefHat, Clock, Flame, Users, ChevronDown, ChevronUp, Check, X } from 'lucide-react';

const RECIPES = [
  {
    id:'r1', title:'Banana Oat Smoothie', time:'5 min', serves:1, difficulty:'Easy',
    color:'#fbbf24', emoji:'🍌',
    ingredients:['bananas','milk','oats','honey'],
    steps:['Peel bananas and break into chunks','Add milk, oats, and honey to blender','Blend until smooth','Pour and enjoy!']
  },
  {
    id:'r2', title:'Chicken Spinach Stir Fry', time:'20 min', serves:2, difficulty:'Medium',
    color:'#ef4444', emoji:'🍗',
    ingredients:['chicken breast','spinach','soy sauce','garlic','rice'],
    steps:['Dice chicken into bite-sized pieces','Stir fry chicken with garlic until golden','Add spinach and soy sauce','Cook 2 more minutes, serve over rice']
  },
  {
    id:'r3', title:'Creamy Tomato Pasta', time:'25 min', serves:2, difficulty:'Medium',
    color:'#f97316', emoji:'🍝',
    ingredients:['tomatoes','cream','pasta','cheese','garlic'],
    steps:['Cook pasta al dente','Sauté garlic, add diced tomatoes','Stir in cream and simmer 5 min','Toss with pasta and top with cheese']
  },
  {
    id:'r4', title:'Greek Yogurt Parfait', time:'5 min', serves:1, difficulty:'Easy',
    color:'#a855f7', emoji:'🥣',
    ingredients:['yogurt','bananas','honey','granola'],
    steps:['Layer yogurt in a glass','Add sliced bananas','Drizzle honey and top with granola']
  },
  {
    id:'r5', title:'Cheese Toast with Tomato', time:'10 min', serves:1, difficulty:'Easy',
    color:'#eab308', emoji:'🧀',
    ingredients:['bread','cheese','tomatoes','butter'],
    steps:['Toast bread slices','Butter while hot, add cheese slices','Top with sliced tomatoes','Grill for 2 min until cheese melts']
  },
  {
    id:'r6', title:'Veggie Omelette', time:'10 min', serves:1, difficulty:'Easy',
    color:'#22c55e', emoji:'🥚',
    ingredients:['eggs','spinach','tomatoes','cheese','milk'],
    steps:['Whisk eggs with a splash of milk','Pour into buttered pan on medium heat','Add spinach, tomatoes, cheese','Fold and cook until set']
  },
];

function RecipeCard({ recipe, inventory, expiringNames }) {
  const [expanded, setExpanded] = useState(false);

  const ingredientStatus = recipe.ingredients.map(ing => {
    const isExpiring = expiringNames.some(e => ing.includes(e) || e.includes(ing));
    const hasIt = inventory.some(i => i.name.toLowerCase().includes(ing) || ing.includes(i.name.toLowerCase()));
    return { name: ing, hasIt, isExpiring };
  });

  const haveCount = ingredientStatus.filter(i => i.hasIt).length;
  const matchPct = Math.round((haveCount / recipe.ingredients.length) * 100);

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '14px' }}>
      {/* Header band */}
      <div style={{ height: '6px', background: recipe.color }} />

      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: `${recipe.color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px'
            }}>
              {recipe.emoji}
            </div>
            <div>
              <h3 style={{ marginBottom: '4px' }}>{recipe.title}</h3>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Clock size={12} /> {recipe.time}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Users size={12} /> {recipe.serves}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Flame size={12} /> {recipe.difficulty}</span>
              </div>
            </div>
          </div>
          {/* Match percent */}
          <div style={{
            width: '42px', height: '42px', borderRadius: '50%',
            border: `3px solid ${matchPct === 100 ? 'var(--primary)' : matchPct >= 50 ? 'var(--amber)' : 'var(--border)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 800,
            color: matchPct === 100 ? 'var(--primary)' : matchPct >= 50 ? 'var(--amber)' : 'var(--text-muted)',
            flexShrink: 0
          }}>
            {matchPct}%
          </div>
        </div>

        {/* Ingredients */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {ingredientStatus.map((ing, i) => (
            <span key={i} style={{
              fontSize: '12px', padding: '3px 10px', borderRadius: 'var(--radius-full)',
              display: 'flex', alignItems: 'center', gap: '4px',
              fontWeight: 600,
              background: ing.isExpiring ? 'var(--amber-subtle)' : ing.hasIt ? 'var(--primary-subtle)' : 'var(--bg-alt)',
              color: ing.isExpiring ? 'var(--amber)' : ing.hasIt ? 'var(--primary)' : 'var(--text-muted)',
              textDecoration: !ing.hasIt ? 'line-through' : 'none',
            }}>
              {ing.hasIt ? <Check size={10} /> : <X size={10} />}
              {ing.name}
            </span>
          ))}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px', width: '100%',
            background: 'none', border: 'none', color: 'var(--primary)',
            fontWeight: 600, fontSize: '13px', cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif', padding: '4px 0'
          }}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {expanded ? 'Hide steps' : 'View cooking steps'}
        </button>

        {expanded && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
            {recipe.steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: 'var(--primary-subtle)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 800, flexShrink: 0
                }}>{i + 1}</div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Recipes({ inventory }) {
  const today = new Date();

  const expiringNames = useMemo(() =>
    inventory
      .filter(i => { const d = differenceInDays(parseISO(i.expiryDate), today); return d >= 0 && d <= 5; })
      .map(i => i.name.toLowerCase()),
    [inventory]
  );

  const scored = useMemo(() =>
    RECIPES.map(r => {
      let score = 0;
      r.ingredients.forEach(ing => {
        if (expiringNames.some(e => ing.includes(e) || e.includes(ing))) score += 3;
        else if (inventory.some(i => i.name.toLowerCase().includes(ing) || ing.includes(i.name.toLowerCase()))) score += 1;
      });
      return { ...r, score };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score),
    [inventory, expiringNames]
  );

  return (
    <div className="page-container animate-slide-up">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <ChefHat size={20} color="var(--primary)" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Smart Recipes</span>
        </div>
        <h1 className="page-title">Cook Before It Expires</h1>
        <p className="page-subtitle">Recipes prioritized by items that need to be used first</p>
      </div>

      {expiringNames.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Prioritizing these ingredients:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {expiringNames.map((n, i) => (
              <span key={i} className="badge badge-amber" style={{ textTransform: 'capitalize' }}>{n}</span>
            ))}
          </div>
        </div>
      )}

      {scored.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><ChefHat size={28} /></div>
          <h3>No matching recipes</h3>
          <p style={{ fontSize: '14px' }}>Add more items to your pantry to get recipe suggestions.</p>
        </div>
      ) : (
        scored.map(r => (
          <RecipeCard key={r.id} recipe={r} inventory={inventory} expiringNames={expiringNames} />
        ))
      )}
    </div>
  );
}

export default Recipes;
