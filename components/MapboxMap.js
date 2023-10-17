import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const MapboxComponent = () => {
  const mapContainerRef = useRef(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts when component mounts
    fetch('/api/posts')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.data); // Adjust based on your API response
        console.log('api response:', data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (posts.length === 0) return; // Don't initialize map if posts are not yet fetched

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [
        posts[0].coordinates[0].longitude,
        posts[0].coordinates[0].latitude,
      ],
      zoom: 9,
    });

    posts.forEach((post) => {
      if (Array.isArray(post.coordinates) && post.coordinates.length > 0) {
        const { latitude, longitude } = post.coordinates[0];
        if (!isNaN(longitude) && !isNaN(latitude)) {
          //create a marker
          const marker = new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map);
          // Create a popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="popup-container">
            <h3 class="popup-title">${post.name}</h3>
            <h6 class="popup-subtitle">${post.location}</h6>
            <a class="popup-link" href="/coffeeShops/${post._id}">Visit Shop</a>
            </div>`
          );
          //attach popup to marker
          marker.setPopup(popup);
        } else {
          console.warn('Invalid coordinates:', post.coordinates);
        }
      }
    });

    return () => map.remove();
  }, [posts]);

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '17rem' }} />
  );
};

export default MapboxComponent;
