const holiday = require('./next_holiday_calc');
const month_json = require('./ingredients_of_the_month.json');
const boxes_json = require('./random_boxes.json');
const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router();

function randomChoice(arr, del) {
    let ind = Math.floor(arr.length * Math.random());
    let retval = arr[ind];
    if(del){
        //To avoid repetitions, the arrays will get smaller as we go. 
        //If the user will request for all of the options we have, maybe tell them they reached the end? 
        arr.splice(ind, 1); 
    }
    return retval; 
}

function get_boxes(amount, first, date, retval){
    var month_ings = month_json[date.toLocaleDateString('default', { month: 'long' })];
    var keys = Object.keys(retval);

    if (first){
        amount -= 1;
    }

    while(amount > 0){
        let key = randomChoice(keys, false);
        if(key === "ingredient"){
            retval["ingredient"].push(randomChoice(month_ings, true));
        }
        else{
            retval[key].push(randomChoice(boxes_json[key], true));
        }
        amount -= 1;
    }

    return retval;
}

router.get('/get_explore', asyncHandler(async (request, response) => {
    const first = request.query.first; /*true if this is the first request for explore, or just an addition request*/
    const date_string = request.query.time; 
    const amount = request.query.amount; /*how many boxes are required*/
    const date = new Date(date_string);

    if (isNaN(date) || typeof(first) != 'boolean' || typeof(amount) != 'number') {
        response.sendStatus(400);
        return;
    }

    let next_holiday; 

    if (first){
        next_holiday = holiday(date_string);
    }
    else{
        next_holiday = null;
    }

    var retval = {
        "cuisine": [],
        "daily cooking": [],
        "easy": [],
        "guests": [],
        "ingredient": [],
        "nextholiday": next_holiday,
        "try making": []
        };

    retval = get_boxes(amount, first, date, retval);
    
    response.send(retval);
}));

module.exports.router = router;