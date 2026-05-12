import React, { useState } from 'react';
import { ShoppingCart, Plus, Check, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

function ShoppingList({ addToast }) {
  const [items, setItems] = useState([
    { id: '1', name: 'Almond Milk', checked: false },
    { id: '2', name: 'Eggs (12 pack)', checked: true },
    { id: '3', name: 'Whole Wheat Bread', checked: false }
  ]);
  const [newItemName, setNewItemName] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    
    setItems([{ id: uuidv4(), name: newItemName.trim(), checked: false }, ...items]);
    setNewItemName('');
    addToast('Item added to shopping list');
  };

  const toggleCheck = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearChecked = () => {
    const remaining = items.filter(item => !item.checked);
    if (remaining.length < items.length) {
      setItems(remaining);
      addToast('Cleared checked items');
    }
  };

  const uncheckedItems = items.filter(i => !i.checked);
  const checkedItems = items.filter(i => i.checked);

  return (
    <div className="page-container animate-slide-up">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Shopping List</h1>
          <p className="page-subtitle">Plan your next grocery trip</p>
        </div>
        <div style={{ background: 'var(--primary-subtle)', p: '10px', borderRadius: 'var(--radius-md)', padding: '12px' }}>
          <ShoppingCart size={24} color="var(--primary)" />
        </div>
      </div>

      <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input
          type="text"
          className="input"
          placeholder="Add a new item..."
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0 16px' }}>
          <Plus size={20} />
        </button>
      </form>

      {items.length === 0 ? (
        <div className="empty-state">
          <ShoppingCart size={48} color="var(--border)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Your list is empty</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '250px', margin: '0 auto' }}>
            Add items you need to buy for your next grocery trip.
          </p>
        </div>
      ) : (
        <>
          {uncheckedItems.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div className="section-header">
                <h2>To Buy</h2>
                <span className="badge badge-amber">{uncheckedItems.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {uncheckedItems.map(item => (
                  <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', marginBottom: 0, gap: '12px' }}>
                    <button 
                      onClick={() => toggleCheck(item.id)}
                      style={{ 
                        width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--border)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', cursor: 'pointer' 
                      }}
                    />
                    <span style={{ flex: 1, fontSize: '15px', fontWeight: 600 }}>{item.name}</span>
                    <button onClick={() => deleteItem(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {checkedItems.length > 0 && (
            <div>
              <div className="section-header" style={{ marginBottom: '12px' }}>
                <h2>Completed</h2>
                {checkedItems.length > 0 && (
                  <button onClick={clearChecked} style={{ fontSize: '13px', color: 'var(--red)', background: 'transparent', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                    Clear
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {checkedItems.map(item => (
                  <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', marginBottom: 0, gap: '12px', opacity: 0.6 }}>
                    <button 
                      onClick={() => toggleCheck(item.id)}
                      style={{ 
                        width: '24px', height: '24px', borderRadius: '50%', border: 'none', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: 'white', cursor: 'pointer' 
                      }}
                    >
                      <Check size={14} strokeWidth={3} />
                    </button>
                    <span style={{ flex: 1, fontSize: '15px', fontWeight: 600, textDecoration: 'line-through', color: 'var(--text-muted)' }}>{item.name}</span>
                    <button onClick={() => deleteItem(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ShoppingList;
