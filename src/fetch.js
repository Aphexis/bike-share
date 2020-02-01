const fetch = require('node-fetch');
global.Headers = fetch.Headers;

function getEvents() {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "prj_live_sk_d56b166e6c662999e3bd92574257b4d79cf30cb7"
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch("https://api.radar.io/v1/events", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log("error", error));
  }

  getEvents();