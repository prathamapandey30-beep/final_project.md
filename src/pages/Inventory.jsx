import React, { useState, useMemo } from 'react';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Trash2, Search, Plus, Pencil, Package } from 'lucide-react';
import AddItemModal from '../components/AddItemModal';

const CATEGORY_EMOJI = {
  Dairy: '🥛', Meat: '🥩', Fruits: '🍎', Vegetables: '🥦',
  Bakery: '🍞', Beverages: '🧃', Frozen: '🧊', Pantry: '🥫', Snacks: '🍪',
};

function ExpiryBar({ daysLeft }) {
  const maxDays = 14;
  const pct = Math.max(0, Math.min(1, daysLeft / maxDays)) * 100;
  const color = daysLeft < 0 ? 'var(--red)' : daysLeft <= 2 ? 'var(--red)' : daysLeft <= 5 ? 'var(--amber)' : 'var(--primary)';
  return (
    <div className="expiry-bar" style={{ marginTop: '8px' }}>
      <div className="expiry-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function EditModal({ item, onClose, onSave }) {
  const [form, setForm] = useState({ ...item });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-handle" />
        <h2 className="modal-title">Edit Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input className="form-input" name="quantity" value={form.quantity} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                {Object.keys(CATEGORY_EMOJI).map(c => (
                  <option key={c} value={c}>{CATEGORY_EMOJI[c]} {c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Expiry Date</label>
            <input className="form-input" type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-ghost btn-full" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-full">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Inventory({ inventory, removeItem, editItem, addItem, addToast }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('expiry');
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const today = new Date();

  const categories = useMemo(() => ['All', ...new Set(inventory.map(i => i.category))], [inventory]);

  const items = useMemo(() => {
    return inventory
      .filter(i => {
        const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'All' || i.category === filter;
        return matchSearch && matchFilter;
      })
      .sort((a, b) => {
        if (sort === 'expiry') return new Date(a.expiryDate) - new Date(b.expiryDate);
        if (sort === 'name')   return a.name.localeCompare(b.name);
        if (sort === 'added')  return new Date(b.addedDate) - new Date(a.addedDate);
        return 0;
      });
  }, [inventory, search, filter, sort]);

  const handleRemove = (id, name) => {
    removeItem(id);
    addToast(`"${name}" removed from pantry`, 'info');
  };

  const handleAdd = (item) => {
    addItem(item);
    addToast(`"${item.name}" added to pantry 🌿`, 'success');
  };

  const handleEdit = (item) => {
    editItem(item);
    addToast(`"${item.name}" updated`, 'success');
  };

  return (
    <div className="page-container animate-slide-up">
      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      {editTarget && <EditModal item={editTarget} onClose={() => setEditTarget(null)} onSave={handleEdit} />}

      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Pantry</h1>
          <p className="page-subtitle">{inventory.length} items tracked</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: '12px' }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          className="search-input"
          placeholder="Search food..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="chips-row" style={{ marginBottom: '8px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`chip ${filter === cat ? 'chip-active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {CATEGORY_EMOJI[cat] || ''} {cat}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Sort:</span>
        {[['expiry', 'Expiry'], ['name', 'Name'], ['added', 'Recent']].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setSort(v)}
            style={{
              fontSize: '12px', fontWeight: 600, padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)',
              background: sort === v ? 'var(--primary)' : 'transparent',
              color: sort === v ? 'white' : 'var(--text-muted)',
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
            }}
          >{l}</button>
        ))}
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Package size={28} /></div>
          <h3>No items found</h3>
          <p style={{ fontSize: '14px' }}>Scan a receipt or add items manually to get started.</p>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Add Item
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map(item => {
            const daysLeft = differenceInDays(parseISO(item.expiryDate), today);
            const labelColor = daysLeft < 0 ? 'var(--red)' : daysLeft <= 2 ? 'var(--red)' : daysLeft <= 5 ? 'var(--amber)' : 'var(--primary)';

            return (
              <div key={item.id} className="card card-hover" style={{ padding: '14px 16px', marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1 }}>
                    {/* Category emoji badge */}
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                      background: 'var(--bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '22px'
                    }}>
                      {CATEGORY_EMOJI[item.category] || '🥡'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '15px' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {item.quantity} · Added {format(parseISO(item.addedDate), 'MMM d')}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: labelColor, marginTop: '4px' }}>
                        {daysLeft < 0 ? `Expired ${Math.abs(daysLeft)}d ago` :
                         daysLeft === 0 ? 'Expires today!' :
                         `Expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`}
                      </div>
                      <ExpiryBar daysLeft={daysLeft} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px', marginLeft: '8px' }}>
                    <button
                      className="btn btn-ghost btn-icon btn-sm"
                      onClick={() => setEditTarget(item)}
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="btn btn-danger btn-icon btn-sm"
                      onClick={() => handleRemove(item.id, item.name)}
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Inventory;
