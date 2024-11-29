'use strict';
const { setupWebSocket } = require('../src/websocket/websocket'); // Adjust the path to where websocket.js is stored


module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(strapi) {
    // const server = strapi.server.httpServer;

    // Setup WebSocket server with additional functionality
    // setupWebSocket(server);
  },

};
