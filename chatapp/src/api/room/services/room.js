'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::room.room', ({ strapi }) => ({
  /**
   * Get rooms for a specific user
   * @param {number} userId - The user ID
   * @returns {Promise<Array>} List of rooms
   */
  async getRoomsForUser(userId) {
    try {
      // Fetch rooms where the user is associated
      const rooms = await strapi.entityService.findMany('api::room.room', {
        filters: {
          users: {
            id: userId,
          },
        },
        populate: {
          messages: true, // Include related messages
          users: true,    // Include related users
        },
      });

      return rooms;
    } catch (error) {
      strapi.log.error('Error fetching rooms for user:', error);
      throw new Error('Unable to fetch rooms for user.');
    }
  },

  /**
   * Create a new room
   * @param {Object} data - The room data
   * @param {string} data.roomId - Unique room identifier
   * @param {Array<Object>} data.users - Array of users to associate with the room
   * @returns {Promise<Object>} The created room
   */
  async createRoom(data) {
    const { roomId, users } = data;

    if (!roomId || !Array.isArray(users) || users.length === 0) {
      throw new Error('Invalid data: roomId and users are required.');
    }

    try {
      // Create the room with associated users
      const userConnections = users.map((user) => {
        if (!user.id) {
          throw new Error('Invalid user object: Each user must have an `id`.');
        }
        return { id: user.id };
      });

      const room = await strapi.entityService.create('api::room.room', {
        data: {
          roomId,
          users: userConnections, // Pass the array of `connect` objects
        },
      });

      return room;
    } catch (error) {
      strapi.log.error('Error creating room:', error);
      throw new Error('Unable to create room.');
    }
  },
}));
