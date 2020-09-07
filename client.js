function ask() {
const publicVapidKey = 'BIDzYuSnEsuZo3XU5jdB6avGVODC4wIqB62PpGWCDm5V4fEiBDUg-xnDx0EiKGfODz7NXbCRiLfSrfXNz_XAOVU';

//if ('serviceWorker' in navigator) {
  console.log('Registering service worker');

  run().catch(error => console.error(error));
//}
//else {
/*  

*/
  //}
async function run() {

  console.log('Registering service worker');
  const registration = await navigator.serviceWorker.
    register('/worker.js', {scope: '/'});
  console.log('Registered service worker');

  console.log('Registering push');
  let subscription = null;
  navigator.serviceWorker.ready.then((registration) =>
   registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    })
  ).then(function(subscription)  {
  console.log('Registered push');
  console.log("SUBSCRIPTION BEFORE PUSHING TO SERVER: ",subscription);
  fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
})
  var h = document.createElement("H1");
  var t = document.createTextNode("SUCCESS");
  h.appendChild(t);
  document.body.appendChild(h);

}

// Boilerplate borrowed from https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
}
