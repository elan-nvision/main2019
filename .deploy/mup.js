module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '159.65.146.192',
      username: 'root',
      pem: '~/.ssh/id_rsa'
      // password: 'ghanta123'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    // TODO: change app name and path
    name: 'CAPortal',
    path: '../',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'https://elan.org.in',
      MONGO_URL: 'mongodb://mongodb/meteor',
      MONGO_OPLOG_URL: 'mongodb://mongodb/local',
    },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'abernix/meteord:node-8.4.0-base',
    },
    volumes: {
      // '/home/abhishek/cryptex': '/cryptex'
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  proxy: {
    domains: 'elan.org.in',

    ssl: {
      // Enable Let's Encrypt
      forceSSL: true,
      letsEncryptEmail: 'web@elan.org.in'
    }
  }
};
