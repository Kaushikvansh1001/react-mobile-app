import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import StatusBar from '../components/StatusBar';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import { fetchRestaurants } from '../services/restaurantService';
import '../styles/home.css';

const BEST_SELLERS = [
  { id: 'sushi', price: '$03.0', image: '/sushi.png' },
  { id: 'rice', price: '$50.0', image: '/rice.png' },
  { id: 'mint', price: '$12.99', image: '/mint.png' },
  { id: 'cupcake', price: '$8.20', image: '/cupcake.png' },
];

const POPULAR_ITEMS = [
  {
    id: 'shake',
    name: 'Strawberry Shake',
    date: '29 Nov, 01:20 pm',
    price: '₹20.00',
    quantity: '2 Items',
    image: '/shake.png',
  },
  {
    id: 'burger',
    name: 'Chicken Burger',
    date: '17 Oct, 01:20 pm',
    price: '₹20.00',
    quantity: '1 Item',
    image: '/burger.png',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantState, setRestaurantState] = useState('loading');
  const [restaurantError, setRestaurantError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const greeting = user?.name || 'Karan';

  useEffect(() => {
    let active = true;
    setRestaurantState('loading');
    setRestaurantError('');

    fetchRestaurants()
      .then((results) => {
        if (!active) {
          return;
        }
        setRestaurants(results);
        setRestaurantState('ready');
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        setRestaurantError(getErrorMessage(error));
        setRestaurantState('error');
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  function openProduct() {
    navigate('/product/pizza');
  }

  return (
    <main className="home">
      <StatusBar />

      <div className="location-row">
        <div>
          <p className="location-label">Current Locations</p>
          <p className="location-name">Model Town, New Delhi</p>
        </div>
        <button type="button" className="logout-button" onClick={logout}>
          Log out
        </button>
      </div>

      <div className="home-toolbar">
        <div className="name-pill">{greeting}</div>
        <button type="button" className="tool-button tool-call" aria-label="Call">
          <img src="/call.png" alt="" />
        </button>
        <button type="button" className="tool-button tool-wallet" aria-label="Wallet">
          <img src="/wallet.png" alt="" />
        </button>
      </div>

      <h2>Best Seller</h2>
      <p className="sample-note">Sample dishes from the design. These are not restaurant API records.</p>
      <div className="seller-row">
        {BEST_SELLERS.map((item) => (
          <article className="seller-card" key={item.id}>
            <img className="photo" src={item.image} alt="" />
            <span>{item.price}</span>
          </article>
        ))}
      </div>

      <article
        className="offer-card"
        role="link"
        tabIndex={0}
        onClick={openProduct}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openProduct();
          }
        }}
      >
        <img className="offer-bg" src="/discount.png" alt="" />
        <div className="offer-copy">
          <p>Experience our delicious new dish</p>
          <strong>30% OFF</strong>
        </div>
      </article>
      <div className="offer-dots" aria-hidden="true">
        <span className="is-active" />
        <span />
        <span />
      </div>

      <h2>Popular Items</h2>
      <p className="sample-note">Sample orders from the design. Cancel and track are not connected to an API.</p>
      <div className="popular-list">
        {POPULAR_ITEMS.map((item) => (
          <article className="popular-item" key={item.id}>
            <img className="photo" src={item.image} alt="" />
            <div className="popular-copy">
              <div className="popular-heading">
                <h3>{item.name}</h3>
                <strong>{item.price}</strong>
              </div>
              <div className="popular-meta">
                <span>{item.date}</span>
                <span>{item.quantity}</span>
              </div>
              <div className="order-actions">
                <button type="button" className="order-button order-cancel">
                  Cancel Order
                </button>
                <button type="button" className="order-button order-track">
                  Track Driver
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <h2>Restaurants</h2>
      <p className="sample-note">Live results for city 118.</p>
      {restaurantState === 'loading' ? <p className="restaurant-status">Loading restaurants...</p> : null}
      {restaurantState === 'error' ? (
        <div className="restaurant-status">
          <p className="restaurant-error">{restaurantError}</p>
          <button type="button" className="retry-button" onClick={() => setReloadKey((current) => current + 1)}>
            Try again
          </button>
        </div>
      ) : null}
      {restaurantState === 'ready' && restaurants.length === 0 ? (
        <p className="restaurant-status">No restaurants found for this city.</p>
      ) : null}
      {restaurantState === 'ready' && restaurants.length > 0 ? (
        <div className="restaurant-list">
          {restaurants.map((restaurant) => (
            <RestaurantCard restaurant={restaurant} key={restaurant.restaurant_id} />
          ))}
        </div>
      ) : null}
    </main>
  );
}
