function TweetCompose ($el, charsLeft) {
  this.$el = $el;
  this.$textarea = this.$el.find('textarea');
  this.charsLeft = charsLeft;
  this.$submit = $('.tweet-compose').children().eq(-1);
  this.selectHtml = this.$el.find('script').html();

  // Listeners
  this.$el.on("submit", ev => this.submit(ev) );
  this.$textarea.on('input', ev => this.updateCharCount());
  this.$el.find('a.add-mentioned-user').on("click", ev => {
    this.addMention(ev);
  });

  $(window).on('insert-tweet', (ev, result) => {
    this.handleSuccess(result);
  });
}

TweetCompose.CHARLIMIT = 140;

TweetCompose.prototype.addMention = function (event) {
  console.log("adding mention");
  event.preventDefault();
  this.$el.find('.mentioned-users').append(this.selectHtml);
  this.$el.find('a.remove-mentioned-user').on("click", ev => {
    this.removeMention(ev);
  });
};

TweetCompose.prototype.removeMention = function (ev) {
  $(ev.currentTarget).parent().remove();
};

TweetCompose.prototype.submit = function (ev) {
  ev.preventDefault();
  this.$submit.attr("disabled", "true");
  console.log(this.$el.serialize());
  $.ajax({
    method: 'POST',
    url: '/tweets.json',
    data: this.$el.serialize(),
    success: function (res) {
      this.handleSuccess(res, true);
    }.bind(this),
    error: function () {
      console.log("Error!!");
    }
  });
};

TweetCompose.prototype.clearInput = function () {
  $('textarea').val('');
  $('.mentioned-users').empty();
};

TweetCompose.prototype.buildTweet = function (res) {
  const $tweet = $("<li></li>");
  const html =
    res.content +
     " -- <a href=\"/users/" +
      res.user_id +
        "\">" +
          res.user.username +
            "</a> -- " +
              res.created_at;

  $tweet.html(html);

  if (res.mentions.length > 0) {
    let $mentionsList = $("<ul></ul>");
    res.mentions.forEach( (mention) => {
      let $mention = $("<li></li>");
      let mentionHtml =
       "<a href=\"/users/" +
        mention.user.id +
          "\">" +
            mention.user.username +
              "</a>" ;
      $mention.html(mentionHtml);
      $mentionsList.append($mention);
    });
    $tweet.append($mentionsList);
  }

  return $tweet;
};

TweetCompose.prototype.handleSuccess = function (res, justMadeTweet) {
  console.log("hiiiii");
  let $tweet = this.buildTweet(res);
  let feed = this.$el.attr('data-tweets-ul');
  if (justMadeTweet) {
    $(feed).prepend($tweet);
    this.clearInput();
  } else {
    $(feed).append($tweet);
  }
  this.$submit.removeAttr("disabled");
};

TweetCompose.prototype.updateCharCount = function () {
  let chars = TweetCompose.CHARLIMIT - this.$textarea.val().length;
  this.charsLeft = chars;

  const $charCount = this.$el.find('.char-count');
  $charCount.text(chars);

  let disabled;
  if (chars < 0 || chars === TweetCompose.CHARLIMIT) {
    disabled = true;
    $charCount.addClass("over-char-limit");
  } else {
    disabled = false;
    $charCount.removeClass("over-char-limit");
  }

  this.$submit.prop("disabled", disabled);

};

module.exports = TweetCompose;
