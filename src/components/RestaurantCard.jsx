import { useState } from 'react';

function formatAddress(address) {
  if (typeof address !== 'string') {
    return 'Address unavailable';
  }

  const trimmed = address.trim();
  if (!trimmed || trimmed.toLowerCase() === 'null') {
    return 'Address unavailable';
  }

  return trimmed;
}

export default function RestaurantCard({ restaurant }) {
  const [broken, setBroken] = useState(false);
  const name = restaurant.restaurant_name || 'Restaurant';
  const logo = typeof restaurant.logo === 'string' ? restaurant.logo : '';
  const showImage = logo && !broken;

  return (
    <article className="restaurant-card">
      {showImage ? (
        <img src={logo} alt="" onError={() => setBroken(true)} />
      ) : (
        <span className="logo-fallback" aria-hidden="true">
          {name.slice(0, 1).toUpperCase()}
        </span>
      )}
      <div>
        <h3>{name}</h3>
        <p>{formatAddress(restaurant.address_complete)}</p>
      </div>
    </article>
  );
}
