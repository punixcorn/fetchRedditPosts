## Fetch Reddit Posts 

## Run 
- first :`npm install` 
- each time : `npm run dev`

output data in `fetchs.json`

## USE 

### subreddit
Edit `subredditname` in `src/app.ts` : `main()`

### categlory 
Edit `categlory` in `src/app.ts` : `main()`

### Data 
data fetched
```ts
interface responseObj {
    selftext: string;
    author_fullname: string;
    title: string;
    ups: number;
    over_18: boolean;
    permalink: string;
    url: string;
}

```
