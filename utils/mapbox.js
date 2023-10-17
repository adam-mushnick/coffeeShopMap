// mapbox utility
const axios = require('axios');

const getCoordinates = async (location) => {
  const NEXT_PUBLIC_MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    location
  )}.json?access_token=${NEXT_PUBLIC_MAPBOX_API_KEY}`;

  const response = await axios.get(url);
  const data = response.data;

  if (data.features.length === 0) {
    throw new Error('Location not found');
  }

  const [longitude, latitude] = data.features[0].center;

  return { longitude, latitude };
};
module.exports = { getCoordinates };
