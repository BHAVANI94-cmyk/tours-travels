const Offer =
    require("../models/Offer");


exports.addOffer =
async (req, res) => {

    const offer =
        await Offer.create(
            req.body
        );

    res.json(offer);

};


exports.getOffers =
async (req, res) => {

    const offers =
        await Offer.find();

    res.json(offers);

};