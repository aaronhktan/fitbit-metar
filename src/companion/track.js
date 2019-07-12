export function trackEvent(event) {
  let query = [ 'v=1' ];

  if (event.propertyId) {
    query.push(`tid=${event.propertyId}`);
  }
  if (event.clientId) {
    query.push(`cid=${event.clientId}`);
  }
  if (event.hitType) {
    query.push(`t=${event.hitType}`);
  }
  if (event.eventCategory) {
    query.push(`ec=${event.eventCategory}`);
  }
  if (event.eventAction) {
    query.push(`ea=${event.eventAction}`);
  }
  if (event.exceptionDescription) {
    query.push(`exd=${event.exceptionDescription}`);
  }
  if (event.data) {
    for (let index = 0; index < event.data.length; index++) {
      query.push(`cm${index}=${event.data[index]}`);
    }
  }

  console.log(query.join('&'));

  fetch('https://www.google-analytics.com/collect', {
    method: 'POST',
    body: query.join('&')
  }).then(response => {
    console.log(response.status)
  }).catch(error => {
    console.log(error)
  });
}