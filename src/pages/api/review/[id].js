//review api route
import dbConnect from '../../../../utils/dbConnect';
import Review from '../../../../models/Review';
import CoffeeShop from '../../../../models/Post';
import Joi from 'joi';

const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  body: Joi.string().required(),
  author: Joi.string(),
});

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        const { error, value } = reviewSchema.validate(req.body);
        if (error) {
          console.log('error1 req body:', req.body);
          res.status(400).json({ success: false, error: error.details });
          return;
        }

        const coffeeShop = await CoffeeShop.findById(req.query.id);
        if (!coffeeShop) {
          res.status(404).json({ success: false });
          return;
        }

        const review = new Review({ ...value, coffeeShop: req.query.id });
        await review.save();

        res.status(201).json({ success: true, data: review });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'GET':
      try {
        const reviews = await Review.find({
          coffeeShop: req.query.id,
        }).populate('author');
        res.status(200).json({ success: true, data: reviews });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const review = await Review.findById(req.query.id);
        if (!review) {
          res.status(404).json({ success: false });
          return;
        }

        await Review.deleteOne({ _id: req.query.id });

        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
