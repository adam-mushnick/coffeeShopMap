//coffee shop submit route
import dbConnect from '../../../utils/dbConnect';
import Post from '../../../models/Post';
import Joi from 'joi';
import { getCoordinates } from '../../../utils/mapbox';

const postSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().required(),
  images: Joi.array().items(Joi.string()).required(),
  author: Joi.string().required(),
});

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      console.log('Shop POST request');
      try {
        //validate the request body against JOI schema
        const { error, value } = postSchema.validate(req.body);

        if (error) {
          //if validation fails, send 400 response
          console.log('Validation Error:', error);
          console.log('Request Body:', req.body);

          res.status(400).json({ success: false, error: error.details });
          return;
        }
        // Get coordinates from Mapbox
        const coordinates = await getCoordinates(value.location);
        console.log('new post coordinates:', coordinates);
        console.log('value:', value);

        // Add coordinates to the validated request body
        value.coordinates = coordinates;
        console.log('value w coordinates:', value);

        //use the validated request body
        const post = await Post.create(value);
        res.status(201).json({ success: true, data: post });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
