const Hebcal = require('hebcal');
const moment = require('moment-holiday');

function nextHoliday(tz) {
  /* tz = time zone offset recieved from the client side */
  /* getting the server time time zone offset */
  const day = new Date();
  const day20 = new Date();
  day20.setDate(day.getDate() + 20);
  if (tz.search('Israel') >= 0) {
    /* assuming Israeli users are jewish.
        This is obviously false but we'll use it for now */
    let hday = new Hebcal.HDate();
    for (let i = 0; i < 21; i += 1) {
      if (hday.holidays()) {
        return hday.holidays()[0];
      }
      hday = hday.next();
    }
    return false;
  }
  if (tz.search('Argentina') >= 0) {
    moment.set('Argentina');
  } else if (tz.search('Canada') >= 0) {
    moment.set('Canada');
  } else if (tz.search('Croatia') >= 0) {
    moment.set('Croatia');
  } else if (tz.search('Denmark') >= 0) {
    moment.set('Denmark');
  } else if (tz.search('Finland') >= 0) {
    moment.set('Finland');
  } else if (tz.search('Germany') >= 0) {
    moment.set('Germany');
  } else if (tz.search('India') >= 0) {
    moment.set('India');
  } else if (tz.search('Switzerland') >= 0) {
    moment.set('Switzerland');
  }
  /* Not knowing this country's holidays' return only US holidays */
  const holidaysBetween = moment().holidaysBetween(day20);
  if (holidaysBetween !== false) {
    return holidaysBetween[0].isHoliday();
  }

  return null;
}

module.exports = nextHoliday;
