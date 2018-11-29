class chartCtrl {

  top_ten_products(req) {
    return new Promise((resolve, reject)=> {
      req.db.collection('orders').aggregate({$match: {status: {$ne: 'cancelled'}}}, {$unwind: "$items"}, {
            $group: {
                _id: '$items._id',
                name: {$push: "$items.name"},
                price: {$push: "$items.price"},
                quantity: {$sum: "$items.quantity"},
                order_count: {$sum: 1}
            }
        }, {$sort: {quantity: -1}}, {$limit: 10}, (err, data)=> {
            resolve({ statusCode: 200, message: data });
        });
    });
  }

  monthly_revenue(req) {
    return new Promise((resolve, reject)=> {
      req.db.collection('orders').aggregate({'$match': {
                            $and: [
                                {'created_on': {'$exists': true}},
                                {'total': {'$exists': true}},
                                {'status': {$ne: 'cancelled'}}
                            ]
                        }
                    }, {
                        $group: {
                            _id: {
                                month: {$month: '$created_on'},
                                year: {$year: '$created_on'}
                            },
                            total: {$sum: "$total"},
                            first: {$first: "$created_on"}
                        }
                    }, {$sort: {first: 1}},
                    function (err, data) {
                        if (err) {
                            throw err;
                        }
                        var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        for (var i = 0; i < data.length; i++) {
                            data[i].first = month[data[i].first.getMonth()];
                        }
                        resolve({ statusCode: 200, message: data });
                    });
    });
  }
}

module.exports = new chartCtrl();
