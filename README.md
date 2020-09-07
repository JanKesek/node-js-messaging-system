# node.js-messaging-system

Sending push notifications to all subscribed devices, made for bossanol scraping program to avoid SMS route. To use: subscribe on localhost:3000/sub, send POST request from any client
to localhost:3000/send with JSON object (put title of notification in 'body' key). You will also need privateVapidKey and GCMI key (optionally), you can generate VAPID key with web-push
libary, and you will find GCMI in your firebase console. Put them into keys.txt file. Messages will be saved into database, and displayed to / route as html file.