var API_URL='http://www.myradio360.com/api/';
exports.getJSON=function(url) {
    //console.log(url);
  return fetch(url).then(function(response) {
    return response.json();
  });
}

