// dependencies
const MongoClient = require('mongodb').MongoClient;

const config = require("../config")["development"];

function connectDb() {
  return new Promise((resolve, reject)=> {
    const url =  `mongodb://${config.database.serverUrl}:27017/${config.database.name}`;
    MongoClient.connect(url, (err, db)=> {
      resolve(db);
    });
  });
}

function getRecords(db, skip=0, records=[]) {
  return new Promise((resolve, reject)=> {
    db.collection('users').find().limit(1000).skip(skip).toArray(async (err, response)=> {
      records = records.concat(response);
      if (response.length < 1000) return resolve(records);

      resolve(await getRecords(db, skip+1000, records));
    })
  })
}

function modifyRecords(records) {
  return new Promise((resolve, reject)=> {
      records.forEach((record)=> {
        record.updated_on = new Date();
      })
      resolve(records);
  })
}

function updateRecords(db, records) {
  return new Promise((resolve, reject)=> {
    const col = db.collection("users");
    const batch = col.initializeUnorderedBulkOp({ useLegacyOps: true });
    records.forEach((record)=> {
      const _id = record._id;
      delete record._id;
      batch.find({ _id: ObjectID(_id) }).updateOne({ $set: record });
    })
    batch.execute((err, result)=> {
      resolve();
    });
  })
}

async function start() {
  const db = await connectDb();
  let records = await getRecords(db);
  records = await modifyRecords(records);
  await updateRecords(db, records);
  console.log("completed")
}

start();
