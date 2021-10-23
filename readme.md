# Instagram Muter

## Why

I think instagram is a much better experience when you have stories muted so this script lets you do that

## How to use

1. Create a `.env` with username and password

```
IG_USERNAME=
IG_PASSWORD=
```

2. Run the script `node dist/index.js`

3. It will run in the background muting all your stories, slowly. Whenever it hits a rate limit, it will wait 30 mins and try again
   - It will also write the last user muted to `data.txt`.
   - You can use use `node dist/index.js [NUMBER]`. The number will be where to start the muting, you can get it from `data.txt`

This might brake and you might need to patch it yourself, it is built using the `instagram-private-api` package
