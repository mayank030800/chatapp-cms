'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::room.room', {
  only: ['find', 'findOne', 'create'], // Add `create` route explicitly
  config: {
    find: {
      auth: {
        scope: ['authenticated'], // Requires authentication for fetching rooms
      },
      policies: [], // Add policies if needed
      middlewares: [], // Add middlewares if needed
    },
    create: {
      auth: {
        scope: ['authenticated'], // Requires authentication for creating a room
      },
      policies: [], // Add policies if needed
      middlewares: [], // Add middlewares if needed
    },
  },
});
