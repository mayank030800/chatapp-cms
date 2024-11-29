const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const { sanitize } = require('@strapi/utils');
import { sanitize } from '@strapi/utils/';

module.exports = {
    async register(ctx) {
        const { username, email, password } = ctx.request.body;
    
        if (!username || !email || !password) {
          return ctx.badRequest('All fields are required.');
        }
    
        const existingUser = await strapi.query('plugin::users-permissions.user').findOne({ where: { email } });
    
        if (existingUser) {
          return ctx.badRequest('Email already in use.');
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = await strapi.query('plugin::users-permissions.user').create({
          data: {
            username,
            email,
            password: hashedPassword,
          },
        });
    
        const sanitizedUser = await sanitize.contentAPI.output(newUser, strapi.getModel('plugin::users-permissions.user'));
    
        const token = jwt.sign(
          { id: sanitizedUser.id, username: sanitizedUser.username, email: sanitizedUser.email },
          process.env.JWT_SECRET || 'default_secret',
          { expiresIn: '1h' }
        );
    
        ctx.send({ user: sanitizedUser, jwt: token });
      },

  async login(ctx) {
    console.log(process.env.JWT_SECRET," janbja")
    const { identifier, password } = ctx.request.body;

    if (!identifier || !password) {
      return ctx.badRequest('All fields are required.');
    }

    const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { email: identifier } });

    if (!user) {
      return ctx.badRequest('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return ctx.badRequest('Invalid email or password.');
    }
    console.log(process.env.JWT_SECRET," janbja")
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    ctx.send({ user, jwt: token });
  },
};
