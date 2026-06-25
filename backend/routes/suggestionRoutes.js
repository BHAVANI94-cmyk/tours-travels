const express =
    require("express");

const router =
    express.Router();

const suggestionController =
    require(
        "../controllers/suggestionController"
    );


router.post(
    "/",
    suggestionController.getSuggestion
);


module.exports =
    router;