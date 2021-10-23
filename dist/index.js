import { IgApiClient } from "instagram-private-api";
import { config } from "dotenv";
import { writeFileSync } from "fs";
config();
const USERNAME = process.env.IG_USERNAME;
const PASSWORD = process.env.IG_PASSWORD;
if (!USERNAME || !PASSWORD) {
  console.log("Please add your username and password for this to work");
  process.exit(1);
}
const ig = new IgApiClient();
ig.state.generateDevice(USERNAME);
async function getAllItemsFromFeed(feed) {
  let items = [];
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
const following = await getAllItemsFromFeed(followingFeed);
let startPoint = parseInt(process.argv[2]);
let count = 0;
const unsubscribeList = following.slice(startPoint);
while (count < unsubscribeList.length) {
  try {
    const user = unsubscribeList[count];
    await ig.friendship.mutePostsOrStoryFromFollow({ targetReelAuthorId: `${user.pk}` });
    count += 1;
    console.log(`Muted ${startPoint + count} users, last muted user ${user.username}`);
    const time = Math.round(Math.random() * 1e4) + 5e3;
    await new Promise((resolve) => setTimeout(resolve, time));
  } catch (err) {
    console.error(err);
    console.log(`Completed ${startPoint + count}`);
    writeFileSync("data.txt", `Completed ${startPoint + count}`);
    const thirtyMinsCoolDown = 1e3 * 60 * 15;
    console.log("Waiting 15 mins, current time", new Date().toTimeString());
    await new Promise((resolve) => setTimeout(resolve, thirtyMinsCoolDown));
  }
}
console.log("Done!", unsubscribeList.length, following.length);
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IElnQXBpQ2xpZW50LCBGZWVkIH0gZnJvbSBcImluc3RhZ3JhbS1wcml2YXRlLWFwaVwiO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSBcImRvdGVudlwiO1xuaW1wb3J0IHsgd3JpdGVGaWxlU3luYyB9IGZyb20gJ2ZzJ1xuXG5jb25maWcoKTtcblxuY29uc3QgVVNFUk5BTUUgPSBwcm9jZXNzLmVudi5JR19VU0VSTkFNRTtcbmNvbnN0IFBBU1NXT1JEID0gcHJvY2Vzcy5lbnYuSUdfUEFTU1dPUkQ7XG5cbmlmICghVVNFUk5BTUUgfHwgIVBBU1NXT1JEKSB7XG4gIGNvbnNvbGUubG9nKFwiUGxlYXNlIGFkZCB5b3VyIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBmb3IgdGhpcyB0byB3b3JrXCIpO1xuICBwcm9jZXNzLmV4aXQoMSk7XG59XG5cblxuXG5jb25zdCBpZyA9IG5ldyBJZ0FwaUNsaWVudCgpO1xuXG5pZy5zdGF0ZS5nZW5lcmF0ZURldmljZShVU0VSTkFNRSk7XG5cbi8qKlxuICogU291cmNlOiBodHRwczovL2dpdGh1Yi5jb20vZGlsYW1lL2luc3RhZ3JhbS1wcml2YXRlLWFwaS9pc3N1ZXMvOTY5I2lzc3VlY29tbWVudC01NTE0MzY2ODBcbiAqIEBwYXJhbSBmZWVkXG4gKiBAcmV0dXJucyBBbGwgaXRlbXMgZnJvbSB0aGUgZmVlZFxuICovXG5cbmFzeW5jIGZ1bmN0aW9uIGdldEFsbEl0ZW1zRnJvbUZlZWQ8VD4oZmVlZDogRmVlZDx1bmtub3duLCBUPik6IFByb21pc2U8VFtdPiB7XG4gIGxldCBpdGVtczogVFtdID0gW107XG4gIGRvIHtcbiAgICBpdGVtcyA9IGl0ZW1zLmNvbmNhdChhd2FpdCBmZWVkLml0ZW1zKCkpO1xuICB9IHdoaWxlIChmZWVkLmlzTW9yZUF2YWlsYWJsZSgpKTtcbiAgcmV0dXJuIGl0ZW1zO1xufVxuXG5hd2FpdCBpZy5zaW11bGF0ZS5wcmVMb2dpbkZsb3coKTtcbmF3YWl0IGlnLmFjY291bnQubG9naW4oVVNFUk5BTUUsIFBBU1NXT1JEKTtcbmF3YWl0IGlnLnNpbXVsYXRlLnBvc3RMb2dpbkZsb3coKTtcblxuY29uc29sZS5sb2coXCJMb2dnZWQgaW4hXCIpO1xuXG5jb25zdCBmb2xsb3dpbmdGZWVkID0gaWcuZmVlZC5hY2NvdW50Rm9sbG93aW5nKGlnLnN0YXRlLmNvb2tpZVVzZXJJZCk7XG5cbi8vIGNvbnN0IGZvbGxvd2VycyA9IGF3YWl0IGdldEFsbEl0ZW1zRnJvbUZlZWQoZm9sbG93ZXJzRmVlZCk7XG5jb25zdCBmb2xsb3dpbmcgPSBhd2FpdCBnZXRBbGxJdGVtc0Zyb21GZWVkKGZvbGxvd2luZ0ZlZWQpO1xuLy8gLy8gTWFraW5nIGEgbmV3IG1hcCBvZiB1c2VycyB1c2VybmFtZSB0aGF0IGZvbGxvdyB5b3UuXG4vLyBjb25zdCBmb2xsb3dlcnNVc2VybmFtZSA9IG5ldyBTZXQoZm9sbG93ZXJzLm1hcCgoeyB1c2VybmFtZSB9KSA9PiB1c2VybmFtZSkpO1xuLy8gRmlsdGVyaW5nIHRocm91Z2ggdGhlIG9uZXMgd2hvIGFyZW4ndCBmb2xsb3dpbmcgeW91LlxuLy8gY29uc3Qgbm90Rm9sbG93aW5nWW91ID0gZm9sbG93aW5nLmZpbHRlcigoeyB1c2VybmFtZSB9KSA9PlxuLy8gICAhZm9sbG93ZXJzVXNlcm5hbWUuaGFzKHVzZXJuYW1lKVxuLy8gKTtcblxuLy8gY29uc29sZS5sb2cobm90Rm9sbG93aW5nWW91Lmxlbmd0aClcblxubGV0IHN0YXJ0UG9pbnQgPSBwYXJzZUludChwcm9jZXNzLmFyZ3ZbMl0pXG5sZXQgY291bnQgPSAgIDBcblxuY29uc3QgdW5zdWJzY3JpYmVMaXN0ID0gZm9sbG93aW5nLnNsaWNlKHN0YXJ0UG9pbnQpXG5cbndoaWxlIChjb3VudCA8IHVuc3Vic2NyaWJlTGlzdC5sZW5ndGgpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB1c2VyID0gdW5zdWJzY3JpYmVMaXN0W2NvdW50XVxuICAgICAgICBhd2FpdCBpZy5mcmllbmRzaGlwLm11dGVQb3N0c09yU3RvcnlGcm9tRm9sbG93KHsgdGFyZ2V0UmVlbEF1dGhvcklkOiBgJHt1c2VyLnBrfWAgfSlcbiAgICAgICAgY291bnQgKz0gMVxuICAgICAgICBjb25zb2xlLmxvZyhgTXV0ZWQgJHtzdGFydFBvaW50ICsgY291bnR9IHVzZXJzLCBsYXN0IG11dGVkIHVzZXIgJHt1c2VyLnVzZXJuYW1lfWApXG4gICAgICAgIGNvbnN0IHRpbWUgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDAwMCkgKyA1MDAwO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGltZSkpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgY29uc29sZS5sb2coYENvbXBsZXRlZCAke3N0YXJ0UG9pbnQgKyBjb3VudH1gKVxuICAgICAgICB3cml0ZUZpbGVTeW5jKCdkYXRhLnR4dCcsYENvbXBsZXRlZCAke3N0YXJ0UG9pbnQgKyBjb3VudH1gKVxuICAgICAgICBjb25zdCB0aGlydHlNaW5zQ29vbERvd24gPSAxMDAwICogNjAgKiAxNVxuICAgICAgICBjb25zb2xlLmxvZygnV2FpdGluZyAxNSBtaW5zLCBjdXJyZW50IHRpbWUnLCBuZXcgRGF0ZSgpLnRvVGltZVN0cmluZygpKVxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcnR5TWluc0Nvb2xEb3duKSk7XG4gICAgfVxuXG59XG5cbmNvbnNvbGUubG9nKCdEb25lIScsdW5zdWJzY3JpYmVMaXN0Lmxlbmd0aCwgZm9sbG93aW5nLmxlbmd0aCkiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUVBLE1BQU0sV0FBVyxRQUFRLElBQUk7QUFDN0IsTUFBTSxXQUFXLFFBQVEsSUFBSTtBQUU3QixJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVU7QUFDMUIsVUFBUSxJQUFJO0FBQ1osVUFBUSxLQUFLO0FBQUE7QUFLZixNQUFNLEtBQUssSUFBSTtBQUVmLEdBQUcsTUFBTSxlQUFlO0FBUXhCLG1DQUFzQyxNQUFzQztBQUMxRSxNQUFJLFFBQWE7QUFDakIsS0FBRztBQUNELFlBQVEsTUFBTSxPQUFPLE1BQU0sS0FBSztBQUFBLFdBQ3pCLEtBQUs7QUFDZCxTQUFPO0FBQUE7QUFHVCxNQUFNLEdBQUcsU0FBUztBQUNsQixNQUFNLEdBQUcsUUFBUSxNQUFNLFVBQVU7QUFDakMsTUFBTSxHQUFHLFNBQVM7QUFFbEIsUUFBUSxJQUFJO0FBRVosTUFBTSxnQkFBZ0IsR0FBRyxLQUFLLGlCQUFpQixHQUFHLE1BQU07QUFHeEQsTUFBTSxZQUFZLE1BQU0sb0JBQW9CO0FBVTVDLElBQUksYUFBYSxTQUFTLFFBQVEsS0FBSztBQUN2QyxJQUFJLFFBQVU7QUFFZCxNQUFNLGtCQUFrQixVQUFVLE1BQU07QUFFeEMsT0FBTyxRQUFRLGdCQUFnQixRQUFRO0FBQ25DLE1BQUk7QUFDQSxVQUFNLE9BQU8sZ0JBQWdCO0FBQzdCLFVBQU0sR0FBRyxXQUFXLDJCQUEyQixFQUFFLG9CQUFvQixHQUFHLEtBQUs7QUFDN0UsYUFBUztBQUNULFlBQVEsSUFBSSxTQUFTLGFBQWEsZ0NBQWdDLEtBQUs7QUFDdkUsVUFBTSxPQUFPLEtBQUssTUFBTSxLQUFLLFdBQVcsT0FBUztBQUNqRCxVQUFNLElBQUksUUFBUSxhQUFXLFdBQVcsU0FBUztBQUFBLFdBQzVDLEtBQVA7QUFDRSxZQUFRLE1BQU07QUFDZCxZQUFRLElBQUksYUFBYSxhQUFhO0FBQ3RDLGtCQUFjLFlBQVcsYUFBYSxhQUFhO0FBQ25ELFVBQU0scUJBQXFCLE1BQU8sS0FBSztBQUN2QyxZQUFRLElBQUksaUNBQWlDLElBQUksT0FBTztBQUN4RCxVQUFNLElBQUksUUFBUSxhQUFXLFdBQVcsU0FBUztBQUFBO0FBQUE7QUFLekQsUUFBUSxJQUFJLFNBQVEsZ0JBQWdCLFFBQVEsVUFBVTsiLAogICJuYW1lcyI6IFtdCn0K