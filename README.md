# Magicpitch Warmup

Powerful WebApp to automate the process of warming up email servers.

## 🥳Upcoming features 🎉🎊 - 29 Feb 2024
- Support account switching - A user should be able to add multiple accounts and easily switch between different profiles.
    How this feature works: when user logs into their account, token should be saved in the client side, when user adds another account, the account token should not overwrite the existing token if the user id are different. user can easily switch and then use that token to make requests.
- Support for adding custom time to schedule warmups - Users should be able to add a custom time which they want their warmup to always run.
- Migrate servers to azure app services and configure ci/cd
- Feature for email open tracking - Track email opens and give insights
- Migrate data from old MongoDB to new MongoDB
- Add support for broadcasting announcements

- Add support to view information from developer/announcements like snackbars and notifications
- Add date time field in create warmup form to select time for warmup (remember to convert date entered by user in their own timezone to a utc timestamp which the server can work with)
- Revamp warmup details page
    - Show graph of warmup days (emails sent and open rate , both total open rate and open rate per day.)
    - Neatly arrange items
- New profile page to view user information. 
- Add new component for switching between profiles.


## Features
* Automated workflow
* Support for automatic image increase
* Provides statistics about warmup status, Reply rate ... etc..
* Support for automatic replies.

Please message project admin for environment variables

## How to run
```commandline
docker-compose up -d --build
```