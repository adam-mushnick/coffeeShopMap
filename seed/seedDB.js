//run this from the root directory with node or it won't find .env variables
//run command node --loader ts-node/esm seed/seedDB.js to avoid import errors from mapbox.js file
const dbConnect = require('../utils/dbConnect');
const cities = require('../seed/cities');
const { descriptors, places } = require('../seed/seedHelpers');
const Post = require('../models/Post');
const { getCoordinates } = require('../utils/mapbox'); // Import the getCoordinates function
require('dotenv').config();

const sample = (array) => array[Math.floor(Math.random() * array.length)]; //function for picking random element of array

dbConnect();

async function seedDB() {
  //first wait for database connection
  await dbConnect();

  // Delete existing data
  await Post.deleteMany({});

  // Seed new data with random names
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const location = `${cities[random1000].city}, ${cities[random1000].state}`;
    const coordinates = await getCoordinates(location); // Fetch coordinates

    const coffeeShop = new Post({
      name: `${sample(descriptors)} ${sample(places)}`,
      location,
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius perferendis reiciendis saepe quod, vero reprehenderit beatae est quibusdam. Repellat laboriosam, odit libero vero cupiditate corrupti neque sunt aut labore mollitia.',
      images: '/images/stock-cafe-img.jpg',
      author: 'Stock Author',
      coordinates,
    });

    await coffeeShop.save();
  }

  console.log('Database seeded!');
  process.exit(0);
}

seedDB().catch((err) => {
  console.error(err);
  process.exit(1);
});

seedDB();
