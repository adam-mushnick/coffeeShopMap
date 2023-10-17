//edit route

import dbConnect from '../../../../utils/dbConnect';
import Post from '../../../../models/Post';
import Joi from 'joi';
import { getServerSession } from 'next-auth/next';
import { getToken } from 'next-auth/jwt';

//don't need author because author is not being updated, only used to verify that the post can be updated
const postSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().required(),
  // if there's an image field and it's optional
  image: Joi.string(),
});

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  //check for a valid session
  const session = await getServerSession(req, res);
  //access the jwt
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (method != 'GET') {
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!session) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  }

  switch (method) {
    case 'PUT':
      try {
        const post = await Post.findById(id);
        if (!post) {
          return res
            .status(404)
            .json({ success: false, message: 'Post not found' });
        }

        // Check if the session's user ID matches the post's author ID
        if (session && token.sub && post && post.author) {
          if (token.sub.toString() !== post.author.toString()) {
            return res.status(403).json({
              success: false,
              message: 'Forbidden: You are not the author',
            });
          }
          // If they are equal, proceed with the update
        } else {
          return res
            .status(500)
            .json({ success: false, message: 'Internal Server Error' });
        }

        //validate request body against JOI schema
        const { error, value } = postSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ success: false, error: error.details });
        }

        const updatedPost = await Post.findByIdAndUpdate(id, value.body, {
          new: true,
          runValidators: true,
        });

        if (!updatedPost) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: updatedPost });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'GET':
      try {
        const post = await Post.findById(id);

        if (!post) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: post });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        //check for user/author match
        const post = await Post.findById(id);

        if (!post) {
          return res
            .status(404)
            .json({ success: false, message: 'Post not found' });
        }

        // Check if the session's user ID matches the post's author ID
        if (session && token.sub && post && post.author) {
          if (token.sub.toString() !== post.author.toString()) {
            return res.status(403).json({
              success: false,
              message: 'Forbidden: You are not the author',
            });
          }
          // If they are equal, proceed with the update
        }
        //delete the post
        const deletedPost = await Post.deleteOne({ _id: id });

        if (!deletedPost) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
