# CS 4241 Final Project
Tanuj Sane
Matthew Piazza
Nikhil Castelino

Welcome to IMadeThis.com! This is a site for bartering craft items users have made in 
their workshops at home and trading to each other. 

The main page features a browsing section populating the screen with random items in 
the category or with the given search string within their title. Each item may be 
individually viewed and a trade with its owner proposed. 
(trade submissions were not created yet) 

Inside the portfolio new items may be added to the user's collection and pictures for 
them may be uploaded and saved. 

Login sessions are made through session storage and checking "remember me" enables 
local storage to be used. However, we did find that our pages could be accessed 
directly without logging in, albeit minus population of any items, and even with
a client-side redirect to the login page, a slow connection would allow the webpage
to be seen, so we opted to include cookie authorization to let the server choose
whether or not to serve a page in the first place based on the cookie data.
Unfortunately this does come with the security concern of keeping username and 
password information in a cookie.