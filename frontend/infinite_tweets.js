const TweetCompose = require("./tweet_compose");

function InfiniteTweets($el) {
  this.$el = $el;
  this.$el.find('a.fetch-more').on('click', ev => this.fetchTweets());
  this.$tweets = this.$el.find('li');
  this.maxCreatedAt = new Date().toJSON();
  this.fetchTweets();
}

InfiniteTweets.prototype.fetchTweets = function () {
  $.ajax ({
    method: 'GET',
    url: '/feed.json',
    data: {
      max_created_at: this.maxCreatedAt
    },
    success: function(res) {
      console.log(res);
      this.maxCreatedAt = res[res.length - 1].created_at;
      console.log(this.maxCreatedAt);
      this.render(res);
    }.bind(this),
    error: function() {
      console.log('No good things.');
    }
  });
};

InfiniteTweets.prototype.render = function (res) {
  res.forEach(result => {
    // fire tweetcompose method
    $(window).trigger('insert-tweet', result);

    // let $tweet = TweetCompose.prototype.buildTweet.call(this, result);
    // this.$el.append($tweet);
  });

};


module.exports = InfiniteTweets;
