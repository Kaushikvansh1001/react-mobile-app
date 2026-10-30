import api, { assertSuccess } from './api';

let pendingRequest = null;

export async function fetchRestaurants(cityId = 118) {
  if (pendingRequest) {
    return pendingRequest;
  }

  pendingRequest = api
    .get('/v1/m/restaurant', { params: { city_id: cityId } })
    .then((response) => {
      const payload = assertSuccess(response.data);
      const results = payload.data?.results;

      if (!Array.isArray(results)) {
        throw new Error('Restaurant list was missing from the response.');
      }

      return results;
    })
    .finally(() => {
      pendingRequest = null;
    });

  return pendingRequest;
}
