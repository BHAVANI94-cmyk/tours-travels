exports.getSuggestion =
async (req, res) => {

    const { budget } =
        req.body;


    let trip;


    if (budget <= 5000) {

        trip = {

            place: "Yercaud",
            days: 2,
            hotel: "Budget Inn"

        };

    }

    else if (budget <= 10000) {

        trip = {

            place: "Ooty",
            days: 3,
            hotel: "Hill View Resort"

        };

    }

    else if (budget <= 20000) {

        trip = {

            place: "Goa",
            days: 4,
            hotel: "Beach Resort"

        };

    }

    else {

        trip = {

            place: "Kerala",
            days: 5,
            hotel: "Luxury Stay"

        };

    }


    res.json(trip);

};