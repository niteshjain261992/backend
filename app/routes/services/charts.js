const chartCtrl = require('../../controllers/charts');

module.exports = (router)=> {
  router.get('/api/v1/chart/top_ten_products', (req, res)=> {
    const response = await chartCtrl.top_ten_products(req);
    res.status = response.statusCode;
    res.send(res.payload);
  });

  router.get('/api/v1/chart/monthly_revenue', (req, res)=> {
    const response = await chartCtrl.monthly_revenue(req);
    res.status = response.statusCode;
    res.send(res.payload);
  });
}
