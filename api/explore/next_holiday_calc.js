const Hebcal = require('hebcal');
const moment = require('moment-holiday');

function nextHoliday(tz) {
  /* tz = time zone offset recieved from the client side */
  /* getting the server time time zone offset */
  const day = new Date();
  const day20 = new Date();
  day20.setDate(day.getDate() + 20);
  if (tz.contains('Israel')) {
    /* assuming Israeli users are jewish.
        This is obviously false but we'll use it for now */
    let hday = new Hebcal.HDate();
    // eslint-disable-next-line id-length
    for (let i = 0; i < 21; i += 1) {
      if (hday.prototype.holidays()) {
        return hday.prototype.holidays()[0];
      }
      hday = hday.prototype.next();
    }
    return false;
  }
  if (tz.contains('Argentina')) {
    moment.set('Argentina');
  } else if (tz.contains('Canada')) {
    moment.set('Canada');
  } else if (tz.contains('Croatia')) {
    moment.set('Croatia');
  } else if (tz.contains('Denmark')) {
    moment.set('Denmark');
  } else if (tz.contains('Finland')) {
    moment.set('Finland');
  } else if (tz.contains('Germany')) {
    moment.set('Germany');
  } else if (tz.contains('India')) {
    moment.set('India');
  } else if (tz.contains('Switzerland')) {
    moment.set('Switzerland');
  }
  /* Not knowing this country's holidays' return only US holidays */
  const holidaysBetween = moment().holidaysBetween(day20);
  if (holidaysBetween !== false) {
    return holidaysBetween[0].isHoliday();
  }

  return false;
}

module.exports = nextHoliday;
