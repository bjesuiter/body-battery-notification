# body-battery-notification
A Deno.cron (job) which reads the body battery value from the inofficial web API and posts it to a telegram bot

## Important Links 

Dashboard on Deno Deploy: https://dash.deno.com/projects/jb-body-battery-bot
API Entrypoint: jb-body-battery-bot.deno.dev

### Prod Routes
Refresh auth in prod: https://jb-body-battery-bot.deno.dev/set-auth?jwtFgp=&refreshToken=
Get daily summary in prod: https://jb-body-battery-bot.deno.dev/get-daily-summary

## Utils 

- Instructions on how to use the API: https://wiki.brianturchyn.net/programming/apis/garmin/
- Web access lives at: https://wiki.brianturchyn.net/programming/apis/garmin/

## How to get JWT_FGP Cookie Token 

- log into the Garmin Connect website (https://connect.garmin.com/modern/home)
- open the developer tools
- got to the application tab
- go to "Cookies" 
- find the cookie with the name "JWT_FGP"
- copy the value of the cookie
- paste the value into the .env file

## How to get the REFRESH_TOKEN

- log into the Garmin Connect website (https://connect.garmin.com/modern/home)
- open the developer tools
- got to the application tab
- go to "Local Storage" 
- find the "token" key (this is a json object)
- copy the "refreshToken" value
- paste the value into the .env file with the key "REFRESH_TOKEN"

## How to get the Telegram Bot Token

- create a new bot using the BotFather (https://t.me/BotFather)
- copy the token from the BotFather
- paste the token into the .env file

--- 
restart trigger