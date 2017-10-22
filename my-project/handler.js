const serverPush = require('./scripts/server-push');

export const hello = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const response = await serverPush('⚡');
  callback(null, response);
};
