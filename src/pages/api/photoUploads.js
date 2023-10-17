import multer from 'multer';
import cloudinary from '../../../utils/cloudinary';
import { v2 as cloudinaryV2 } from 'cloudinary';

const upload = multer({ dest: 'uploads/' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    //10 is max number of files
    const uploadMultiple = upload.array('images', 10);

    uploadMultiple(req, res, async (err) => {
      console.log('req.files:', req.files);
      console.log('req.body:', req.body);

      //error handler
      if (err) {
        console.error('Upload Error:', err);
        return res.status(400).json({ error: err.message });
      }

      if (!req.files || req.files.length === 0) {
        console.error('No files uploaded');
        return res.status(400).json({ error: 'No files uploaded' });
      }

      //initialize empty array for cloudinary urls of uploaded images
      //and I can save these URLs to my database
      const urls = [];
      try {
        //loop through array of files from Multer
        for (const file of req.files) {
          //extract the file path property from the 'file' object from Multer
          const { path } = file;
          //upload the file from the local 'path' to cloudinary
          //returns object which contains the files URL from cloudinary
          const newPath = await cloudinaryV2.uploader.upload(path);
          console.log('newPath:', newPath);
          //push filepath to URL array
          urls.push(newPath);
        }
      } catch (error) {
        console.error('Cloudinary Error:', error);
        return res.status(400).json({ error: 'Cloudinary upload failed' });
      }
      console.log('Image Upload Success');
      res.status(200).json({ urls });
    });
  } else {
    //method not allowed
    res.status(405).json({ error: 'Method not allowed' });
  }
}
