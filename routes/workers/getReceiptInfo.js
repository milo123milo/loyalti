const request = require('request');
const util = require('util');


async function get(url) {
  const params = parseUrl(url);
  const options = {
    url: 'https://mapr.tax.gov.me/ic/api/verifyInvoice',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: {
      iic: params.iic,
      dateTimeCreated: params.date,
      tin: params.tin,
    },
  };

  const requestAsync = util.promisify(request);

  try {
    const response = await requestAsync(options);
    const res = JSON.parse(response.body);
    console.log(res)
    return res;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
function formatDate(date){
    const dateTimeString = date;
    
    const formattedDateTimeString = decodeURIComponent(dateTimeString);
    

    const dateTime = new Date(formattedDateTimeString);

    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const day = dateTime.getDate().toString().padStart(2, '0');
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    const timeZoneOffset = dateTime.getTimezoneOffset();
    const timeZoneOffsetHours = '02'
    const timeZoneOffsetMinutes = '00'

    //const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:00 ${timeZoneOffsetHours}:${timeZoneOffsetMinutes}`;
    const formattedDateTime = formattedDateTimeString

    return formattedDateTime
}

function parseUrl(url){
//const url = url /*"https://mapr.tax.gov.me/ic/#/verify?iic=9623B061BA18D72926216173C080892E&tin=03293220&crtd=2023-05-03T16:59:05%2B02:00&ord=14647&bu=xg560gl291&cr=lc358nn393&sw=yi005ix126&prc=2.70";*/

// extract the iic and tin values from the URL
const iicMatch = url.match(/iic=([^&]*)/);
const iic = iicMatch ? iicMatch[1] : null;

const tinMatch = url.match(/tin=([^&]*)/);
const tin = tinMatch ? tinMatch[1] : null;

const crtdMatch = url.match(/crtd=([^&]*)/);
const crtd = crtdMatch ? crtdMatch[1] : null;
const date = formatDate(crtd ?? null);



return {iic, tin, date}
}


/*get('https://mapr.tax.gov.me/ic/#/verify?iic=9623B061BA18D72926216173C080892E&tin=03293220&crtd=2023-05-03T16:59:05%2B02:00&ord=14647&bu=xg560gl291&cr=lc358nn393&sw=yi005ix126&prc=2.70')*/
module.exports = {get}
