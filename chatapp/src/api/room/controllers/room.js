'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::room.room', ({ strapi }) => ({
  async getRoomsForUser(ctx) {
    console.log(ctx)
    const { userId } = ctx.params;

    try {
      const rooms = await strapi.service('api::room.room').getRoomsForUser(userId);
      ctx.body = {
        success: true,
        data: rooms,
      };
    } catch (error) {
      ctx.body = {
        success: false,
        error: error.message || 'An error occurred while fetching rooms.',
      };
    }
  },

  async createRoom(ctx) {
    try {
      const room = await strapi.service('api::room.room').createRoom(ctx.request.body);
      ctx.body = {
        success: true,
        data: room,
      };
    } catch (error) {
      ctx.body = {
        success: false,
        error: error.message || 'An error occurred while creating the room.',
      };
    }
  },
}));
