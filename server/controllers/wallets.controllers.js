const walletModel = require('../models/wallet.model');

module.exports = {

  getAllWallets: (async (req, res, next) => {
    let wallets = await walletModel.find();
    res.json({wallets: wallets});
  }),

  getWalletsByUser: (async (req, res, next) => {
    let user = req.query.user
    console.log("user:::", user);
    let wallets = await walletModel.find({"idSub": user});
    res.json({wallets: wallets});
  }),

  addWallet: (async(req,res,next)=>{
   // let walletEmail = await walletModel.find({"email": user});
   console.log("bpurchase",req.body);
    payload = req.body;
    
    await walletModel.updateOne({idSub: payload.idSub, email: payload.email, picture: payload.picture ,name: payload.name, nickname: payload.nickname, user_created: payload.updated_at}, 
                                {$push : {coins: [{coin: payload.coin, purchase_price: payload.purchase_price, sold_price: payload.market_price,margin: payload.margin, sold:payload.sold}]}},
                                {upsert: true, setDefaultsOnInsert: true});
    res.redirect(200, '/wallet'); 

  }),

  sellCoin: (async(req,res,next)=>{
    console.log("sell",req.body);
    payload= req.body;

    await walletModel.findOneAndUpdate({'coins._id':payload.id}, {'coins.$.sold' : payload.sold, 'coins.$.sold_price': payload.market_price, 'coins.$.margin': payload.margin, 'coins.$.coin_sold':payload.coin_sold},{upsert: true})
    res.json({users: payload});
  }),

  getMarginByUser:(async(req,res,next)=>{
    let user = req.query.user
    console.log("user_margin",user);
    
    let margin = await walletModel.aggregate([
                                              {"$match" : {"idSub": user}}, 
                                              {"$group": {"_id": "$_id", "margin" :{"$sum":{"$sum":"$coins.margin"}}}}])
    res.json({userMargin: margin});
  }),

  getAllMargins:(async(req,res,next)=>{
    let margin = await walletModel.aggregate([{"$group": {_id: {
      "_id": "$_id",
      "email": "$email",
      "name": "$name",
      "coins_margin":"$coins.margin",
      "coins_sold": "$coins.sold",
      "picture": "$picture"
    },
    totalMargin: {
      "$sum":{
        "$sum":"$coins.margin"
      } 
    },
    totalTransactions: {
      "$sum":{
        "$sum":"$coins.margin"
      } 
    }}}])

    res.json({allMargin: margin});
  })

}

// the setDefaultOnInsert option to also apply defaults if the upsert creates a new document.
//, 'coins.$.sold_price': payload.market_price, 'coins.$.margin': payload.margin