// import { HttpError } from 'http-errors';

export const notFoundHandler = ( req, res,) => {
  
    res.status(404).json({
      message: `${req.url} not found`
    });
  };