'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/rooms/user/:userId',
      handler: 'room.getRoomsForUser',
      config: {
        auth: {
            scope: ['authenticated'], 
          },
        policies: [], // Add policies if needed
        middlewares: [], // Add middlewares if needed
      },
    },
  ],
};
