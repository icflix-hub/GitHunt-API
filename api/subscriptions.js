import { SubscriptionManager } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import schema from './schema';

const pubsub = new RedisPubSub({
  connection: {
    host: '10.0.0.16',
    port: 6379,
    // reconnect after upto 3000 milis
    retry_strategy: options => Math.max(options.attempt * 100, 3000)
  },
  connectionListener: (err) => {
    if (err) {
      console.error(err);
    }
    console.info('Succefuly connected to redis');
  }
});

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    commentAdded: (options, args) => ({
      commentAdded: comment => comment.repository_name === args.repoFullName,
    })
  },
});

export { subscriptionManager, pubsub };
