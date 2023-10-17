//protect API routes on backend
import { getSession } from 'next-auth/react';

export const requireSession = async (req) => {
  const session = await getSession({ req });
  if (!session) {
    return false;
  }
  // Store the user in the request object
  req.user = session.user;
  return true;
};
