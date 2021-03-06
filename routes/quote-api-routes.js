const db = require('../models');

module.exports = function(app) {
  app.post('/api/quote', function(req, res) {
    let quarts = req.body.quarts;
    let quote = parseFloat(Math.ceil(req.body.oilAmount.replace(/[^\d\.]*/g, '')) * 6);
      quote += 5; // cost of oil filter
      quote += 35; // cost of labor + trip
      quote.toFixed(2);
      console.log(req.body);
    db.Quote.create({
      carMake: req.body.carMake,
      carModel: req.body.carModel,
      carYear: req.body.carYear,
      quoteAmt: quote,
      oilType: req.body.oilType,
      oilAmount: req.body.oilAmount
    }).then(function(response){
      res.json(response);
    });
  });

  app.get('/api/quote/:id', function(req, res) {
    db.Quote.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(quote) {
      res.json(quote);
    });
  });
};