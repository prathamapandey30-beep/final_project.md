import React, { useState } from 'react';
import { X, Package } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

const CATEGORY_SHELF_LIFE = {
  Dairy: 7,
  Meat: 3,
  Fruits: 5,
  Vegetables: 6,
  Bakery: 4,
  Beverages: 14,
  Frozen: 60,
  Pantry: 90,
  Snacks: 30,
};

const CATEGORY_EMOJI = {
  Dairy: '🥛', Meat: '🥩', Fruits: '🍎', Vegetables: '🥦',
  Bakery: '🍞', Beverages: '🧃', Frozen: '🧊', Pantry: '🥫', Snacks: '🍪',
};

function AddItemModal({ onClose, onAdd }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState({
    name: '',
    category: 'Pantry',
    quantity: '',
    unit: 'pcs',
    addedDate: today,
    expiryDate: format(addDays(new Date(), CATEGORY_SHELF_LIFE['Pantry']), 'yyyy-MM-dd'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updates = { [name]: value };

    if (name === 'category') {
      const days = CATEGORY_SHELF_LIFE[value] || 14;
      updates.expiryDate = format(addDays(new Date(form.addedDate), days), 'yyyy-MM-dd');
    }

    setForm(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd({
      id: uuidv4(),
      name: form.name.trim(),
      category: form.category,
      quantity: `${form.quantity} ${form.unit}`.trim(),
      addedDate: form.addedDate,
      expiryDate: form.expiryDate,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-handle" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="modal-title" style={{ marginBottom: 0 }}>Add Item</h2>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Item Name *</label>
            <input
              className="form-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Organic Milk"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" name="category" value={form.category} onChange={handleChange}>
              {Object.keys(CATEGORY_SHELF_LIFE).map(cat => (
                <option key={cat} value={cat}>{CATEGORY_EMOJI[cat]} {cat}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                className="form-input"
                name="quantity"
                type="number"
                min="0"
                value={form.quantity}
                onChange={handleChange}
                placeholder="1"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <select className="form-select" name="unit" value={form.unit} onChange={handleChange}>
                {['pcs', 'g', 'kg', 'ml', 'L', 'pack', 'can', 'bag'].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Expiry Date</label>
            <input
              className="form-input"
              name="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={handleChange}
              min={today}
            />
          </div>

          <div style={{ 
            padding: '12px 14px', 
            borderRadius: 'var(--radius-sm)', 
            background: 'var(--primary-subtle)', 
            marginBottom: '20px',
            fontSize: '13px',
            color: 'var(--primary)'
          }}>
            💡 <strong>Tip:</strong> Category auto-estimates expiry. Adjust the date if needed.
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-ghost btn-full" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-full">
              <Package size={16} /> Add to Pantry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;
