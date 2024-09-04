import { ObjectId } from 'mongodb';
import dbClient from './db';

/**
 * Extracts the user ID and key from the request.
 * @param {Object} request - The HTTP request object.
 * @returns {Object} - An object containing the userId and key.
 */
export async function getIdAndKey(request) {
  // Extract the key from the request headers
  const authHeader = request.headers.authorization || '';
  const key = authHeader.split('Bearer ')[1]; // Assuming the key is passed as a Bearer token

  if (!key) return { userId: null, key: null };

  // Retrieve userId from the key
  const user = await dbClient.getUser({ sessionKey: key });

  if (user) {
    return { userId: user._id.toString(), key };
  }
  return { userId: null, key: null };
}

/**
 * Checks if the user ID is valid.
 * @param {string} userId - The user ID to check.
 * @returns {boolean} - True if the user is valid, false otherwise.
 */
export async function isValidUser(userId) {
  if (!userId) return false;

  try {
    const user = await dbClient.getUser({ _id: ObjectId(userId) });
    return !!user;
  } catch (err) {
    return false;
  }
}
