//dependencies
const MongoClient = require('mongodb').MongoClient;

class DbCtrl {
  connectDb() {
    return new Promise((resolve, reject)=> {
      const url =  `mongodb://${config.database.serverUrl}:27017`;
      console.log(url);
      MongoClient.connect(url, (err, client)=> {
        if (err) {
          console.error('error while connecting with database');
          return reject(err);
        }

        const db = client.db(config.database.name);
        client.close();

        resolve(db);
      })
    })
  }
}

module.exports = new DbCtrl();
