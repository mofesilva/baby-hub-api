import config from '../config/env.js';

export const getPixInstructions = () => ({
  key: config.pix.key,
  recipient: config.pix.recipient,
  description: config.pix.description,
});
