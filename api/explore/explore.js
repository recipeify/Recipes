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

function get_boxes(size, first, date_string){
    var month_ings = month_json[new Date(date_string).toLocaleDateString('default', { month: 'long' })];
    var keys = Object.keys(boxes_json);
    keys.push("ingredient");
    var retval = {};

    if (first){
        retval["next holiday"] = holiday(date_string);
        size -= 1;
    }

    while(size > 0){
        let key = randomChoice(keys, false);
        if(key === "ingredient"){
            retval["ingredient"].push(randomChoice(month_ings, true));
        }
        else{
            retval[key].push(randomChoice(boxes_json[key], true));
        }
        size -= 1;
    }

    return retval;
}

router.get('/get_explore', asyncHandler(async (request, response) => {
    const first = request.query.first; /*true if this is the first request for explore, or just an addition request*/
    const date_string = request.query.time; 
    const size = request.query.size; /*how many boxes are required*/

    if (isNaN(new Date(date_string)) || typeof(first) != 'boolean' || typeof(size) != 'number') {
        response.sendStatus(400);
        return;
    }

    var retval = get_boxes(size, first, date_string);
    
    response.send(retval);
}));

module.exports.router = router;