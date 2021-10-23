import { IgApiClient, Feed } from "instagram-private-api";
import { config } from "dotenv";
import { writeFileSync } from 'fs'

config();

const USERNAME = process.env.IG_USERNAME;
const PASSWORD = process.env.IG_PASSWORD;

if (!USERNAME || !PASSWORD) {
  console.log("Please add your username and password for this to work");
  process.exit(1);
}



const ig = new IgApiClient();

ig.state.generateDevice(USERNAME);

/**
 * Source: https://github.com/dilame/instagram-private-api/issues/969#issuecomment-551436680
 * @param feed
 * @returns All items from the feed
 */

async function getAllItemsFromFeed<T>(feed: Feed<unknown, T>): Promise<T[]> {
  let items: T[] = [];
  do {
    items = items.concat(await feed.items());
  } while (feed.isMoreAvailable());
  return items;
}

await ig.simulate.preLoginFlow();
await ig.account.login(USERNAME, PASSWORD);
await ig.simulate.postLoginFlow();

console.log("Logged in!");

const followingFeed = ig.feed.accountFollowing(ig.state.cookieUserId);

// const followers = await getAllItemsFromFeed(followersFeed);
const following = await getAllItemsFromFeed(followingFeed);
// // Making a new map of users username that follow you.
// const followersUsername = new Set(followers.map(({ username }) => username));
// Filtering through the ones who aren't following you.
// const notFollowingYou = following.filter(({ username }) =>
//   !followersUsername.has(username)
// );

// console.log(notFollowingYou.length)

let startPoint = parseInt(process.argv[2])
let count =   0

const unsubscribeList = following.slice(startPoint)

while (count < unsubscribeList.length) {
    try {
        const user = unsubscribeList[count]
        await ig.friendship.mutePostsOrStoryFromFollow({ targetReelAuthorId: `${user.pk}` })
        count += 1
        console.log(`Muted ${startPoint + count} users, last muted user ${user.username}`)
        const time = Math.round(Math.random() * 10000) + 5000;
        await new Promise(resolve => setTimeout(resolve, time));
    } catch (err) {
        console.error(err)
        console.log(`Completed ${startPoint + count}`)
        writeFileSync('data.txt',`Completed ${startPoint + count}`)
        const thirtyMinsCoolDown = 1000 * 60 * 15
        console.log('Waiting 15 mins, current time', new Date().toTimeString())
        await new Promise(resolve => setTimeout(resolve, thirtyMinsCoolDown));
    }

}

console.log('Done!',unsubscribeList.length, following.length)