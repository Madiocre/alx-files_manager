import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on('error', (error) => {
      console.log(`Redis client not connected to server: ${error.message}`);
      this.client.quit();
    });

    this.client.on('connect', () => {
      console.log('Redis client connected to the server');
    });

    // Promisify the Redis methods
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
    this.expireAsync = promisify(this.client.expire).bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value;
    } catch (error) {
      console.error('Error getting key:', error);
      throw error;
    }
  }

  async set(key, val, dur) {
    try {
      await this.setAsync(key, val);
      if (dur) {
        // If duration is provided, set the key with expiration
        await this.expireAsync(key, dur);
      }
    } catch (error) {
      console.error('Error setting key:', error);
      throw error;
    }
  }

  async del(key) {
    try {
      const result = await this.delAsync(key);
      return result; // returns the number of keys removed
    } catch (error) {
      console.error('Error deleting key:', error);
      throw error;
    }
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
