import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ScanLine, ChefHat, UserCircle, ShoppingCart } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { addDays, format } from 'date-fns';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Scanner from './pages/Scanner';
import Recipes from './pages/Recipes';
import Profile from './pages/Profile';
import ShoppingList from './pages/ShoppingList';
import Toast from './components/Toast';
import Onboarding from './components/Onboarding';

// ── Seed Data ───────────────────────────────────────────────────────────────
const today = new Date();
const seed = [
  { id: uuidv4(), name: 'Oat Milk', category: 'Dairy', addedDate: format(addDays(today, -5), 'yyyy-MM-dd'), expiryDate: format(addDays(today, 2), 'yyyy-MM-dd'), quantity: '1 L' },
  { id: uuidv4(), name: 'Bananas', category: 'Fruits', addedDate: format(addDays(today, -2), 'yyyy-MM-dd'), expiryDate: format(addDays(today, 1), 'yyyy-MM-dd'), quantity: '6 pcs' },
  { id: uuidv4(), name: 'Chicken Breast', category: 'Meat', addedDate: format(addDays(today, -1), 'yyyy-MM-dd'), expiryDate: format(addDays(today, 2), 'yyyy-MM-dd'), quantity: '500 g' },
  { id: uuidv4(), name: 'Baby Spinach', category: 'Vegetables', addedDate: format(addDays(today, -4), 'yyyy-MM-dd'), expiryDate: format(addDays(today, -1), 'yyyy-MM-dd'), quantity: '1 bag' },
  { id: uuidv4(), name: 'Greek Yogurt', category: 'Dairy', addedDate: format(addDays(today, -3), 'yyyy-MM-dd'), expiryDate: format(addDays(today, 4), 'yyyy-MM-dd'), quantity: '400 g' },
  { id: uuidv4(), name: 'Sourdough Bread', category: 'Bakery', addedDate: format(addDays(today, -1), 'yyyy-MM-dd'), expiryDate: format(addDays(today, 3), 'yyyy-MM-dd'), quantity: '1 loaf' },
  { id: uuidv4(), name: 'Cheddar Cheese', category: 'Dairy', addedDate: format(addDays(today, -6), 'yyyy-MM-dd'), expiryDate: format(addDays(today, 8), 'yyyy-MM-dd'), quantity: '200 g' },
  { id: uuidv4(), name: 'Cherry Tomatoes', category: 'Vegetables', addedDate: format(addDays(today, -2), 'yyyy-MM-dd'), expiryDate: format(addDays(today, 5), 'yyyy-MM-dd'), quantity: '250 g' },
];

// ── Bottom Navigation ────────────────────────────────────────────────────────
function Navigation({ onScanClick }) {
  const location = useLocation();

  const navItem = (to, Icon, label) => (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
    >
      <Icon size={22} strokeWidth={location.pathname === to ? 2.5 : 1.8} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <nav className="bottom-nav">
      {navItem('/', LayoutDashboard, 'Home')}
      {navItem('/inventory', Package, 'Pantry')}

      <button className="nav-fab" onClick={onScanClick} aria-label="Scan receipt">
        <div className="nav-fab-icon">
          <ScanLine size={26} strokeWidth={2} />
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600 }}>Scan</span>
      </button>

      {navItem('/recipes', ChefHat, 'Recipes')}
      {navItem('/shopping-list', ShoppingCart, 'Shop')}
      {navItem('/profile', UserCircle, 'Profile')}
    </nav>
  );
}

// ── App Shell ───────────────────────────────────────────────────────────────
function AppShell({ inventory, addItem, removeItem, editItem, toasts, addToast, removeToast }) {
  const navigate = useNavigate();

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <Routes>
        <Route path="/" element={<Dashboard inventory={inventory} addToast={addToast} />} />
        <Route path="/inventory" element={<Inventory inventory={inventory} removeItem={removeItem} editItem={editItem} addItem={addItem} addToast={addToast} />} />
        <Route path="/scan" element={<Scanner addItem={addItem} addToast={addToast} />} />
        <Route path="/recipes" element={<Recipes inventory={inventory} />} />
        <Route path="/shopping-list" element={<ShoppingList addToast={addToast} />} />
        <Route path="/profile" element={<Profile addToast={addToast} />} />
      </Routes>
      <Navigation onScanClick={() => navigate('/scan')} />
    </>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
function App() {
  const [inventory, setInventory] = useState(seed);
  const [toasts, setToasts] = useState([]);
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem('gp_onboarded') === 'true');

  const addToast = useCallback((message, type = 'success') => {
    const id = uuidv4();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addItem = useCallback((item) => {
    setInventory(prev => [item, ...prev]);
  }, []);

  const removeItem = useCallback((id) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  }, []);

  const editItem = useCallback((updatedItem) => {
    setInventory(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('gp_onboarded', 'true');
    setOnboarded(true);
  };

  return (
    <Router>
      {!onboarded && <Onboarding onComplete={completeOnboarding} />}
      <AppShell
        inventory={inventory}
        addItem={addItem}
        removeItem={removeItem}
        editItem={editItem}
        toasts={toasts}
        addToast={addToast}
        removeToast={removeToast}
      />
    </Router>
  );
}

export default App;
