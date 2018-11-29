//dependencies
const MongoClient = require('mongodb').MongoClient;

class DbCtrl {
  connectDb() {
    return new Promise((resolve, reject)=> {
      const url =  `mongodb://${config.database.serverUrl}:27017/${config.database.name}`;
      return resolve();
      MongoClient.connect(url, (err, db)=> {
        if (err) {
          console.error('error while connecting with database');
          return reject(err);
        }

        resolve(db);
      })
    })
  }
}

module.exports = new DbCtrl();
