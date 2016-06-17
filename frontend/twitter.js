const FollowToggle = require('./follow_toggle');
const UsersSearch = require('./users_search');
const TweetCompose = require('./tweet_compose');
const InfiniteTweets = require('./infinite_tweets');

$(() => {
  $('button.follow-toggle').each((index, element) => {
    new FollowToggle(element);
  });
  const nav = $('.users-search');
  new UsersSearch(nav);
  new TweetCompose($('.tweet-compose'), 140);
  new InfiniteTweets($('.infinite-tweets'));
});
