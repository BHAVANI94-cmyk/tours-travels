const express =
    require("express");

const router =
    express.Router();

const offerController =
    require(
        "../controllers/offerController"
    );


router.post(
    "/add",
    offerController.addOffer
);

router.get(
    "/",
    offerController.getOffers
);


module.exports =
    router;