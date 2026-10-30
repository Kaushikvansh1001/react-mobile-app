import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { useCart } from '../context/CartContext';
import '../styles/product.css';

const BASE_PRICE = 14;

const PORTIONS = [
  { id: 'personal', label: 'Personal (4 Slides)', extra: 0, price: '$0.00' },
  { id: 'medium', label: 'Medium (8 Slides)', extra: 3, price: '$3.00' },
  { id: 'familiar', label: 'Familiar (10 Slides)', extra: 6, price: '$6.00' },
  { id: 'jumbo', label: 'Jumbo (12 Slides)', extra: 10, price: '$10.00' },
];

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(3);
  const [portionId, setPortionId] = useState('jumbo');
  const [saved, setSaved] = useState(false);
  const selectedPortion = PORTIONS.find((portion) => portion.id === portionId) || PORTIONS[0];
  const totalPrice = BASE_PRICE + selectedPortion.extra;

  return (
    <main className="product">
      <StatusBar />

      <img className="detail-photo" src="/pizza.png" alt="Pizza" />

      <div className="price-row">
        <p className="detail-price">₹{totalPrice.toFixed(2)}</p>
        <div className="qty-control">
          <button
            type="button"
            className="qty-button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => {
              setQuantity((current) => Math.max(1, current - 1));
              setSaved(false);
            }}
          >
            <Minus size={14} strokeWidth={2.5} />
          </button>
          <span className="qty-value">{quantity}</span>
          <button
            type="button"
            className="qty-button"
            aria-label="Increase quantity"
            onClick={() => {
              setQuantity((current) => current + 1);
              setSaved(false);
            }}
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <h1>Lorem ipsum dolor sit amet</h1>
      <p className="detail-copy">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore.
      </p>

      <h2>Personal portion</h2>
      <div className="portion-list">
        {PORTIONS.map((portion) => {
          const selected = portion.id === portionId;
          return (
            <button
              type="button"
              className="portion-row"
              key={portion.id}
              aria-pressed={selected}
              onClick={() => {
                setPortionId(portion.id);
                setSaved(false);
              }}
            >
              <span className="portion-name">{portion.label}</span>
              <span className="portion-leader" aria-hidden="true" />
              <span className="portion-price">{portion.price}</span>
              <span className={`portion-radio${selected ? ' is-selected' : ''}`} />
            </button>
          );
        })}
      </div>

      <div className="product-footer">
        <button
          type="button"
          className="cart-button"
          onClick={() => {
            addItem({
              id,
              name: 'Lorem ipsum dolor sit amet',
              quantity,
              portionId: selectedPortion.id,
              portionLabel: selectedPortion.label,
              unitPrice: totalPrice,
            });
            setSaved(true);
          }}
        >
          {saved ? 'Added to cart' : 'Add to cart'}
        </button>
        {saved ? <p className="cart-note">Saved on this device only. No order was sent.</p> : null}
        <div className="home-indicator" aria-hidden="true" />
      </div>
    </main>
  );
}
