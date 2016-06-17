function FollowToggle (el, options) {
  this.$el = $(el);
  this.userId = this.$el.attr("data-user-id") || options.userId;
  this.followState = this.$el.attr("data-initial-follow-state") ||
    options.followState; 
  this.render();
  this.$el.on("click", ev =>  this.handleClick(ev));
}

FollowToggle.prototype.render = function () {
  if(this.followState === "true") {
    this.$el.text('Unfollow!');
  } else if (this.followState === "false") {
    this.$el.text('Follow!');
  } else {
    this.$el.text(`${this.followState}...`);
    this.$el.attr("disabled", "true");
  }
};

//// TWEAK
FollowToggle.prototype.toggleFollowState = function () {
  this.followState = (this.followState === "Following") ? "true" : "false";
  this.$el.removeAttr("disabled");
  this.render();
};


FollowToggle.prototype.handleClick = function(ev) {
  let $target = $(ev.currentTarget);
  let method = (this.followState === "true") ? 'DELETE' : 'POST';

  if (this.followState === "true") {
    this.followState = "Unfollowing";
  } else {
    this.followState = "Following";
  }

  this.render();

  $.ajax ({
    url: `/users/${this.userId}/follow.json`,
    method: `${method}`,
    data: {
      user_id: this.userId
    },
    success: function(data) {
      // this.toggleFollowState();
      console.log(data);
      this.toggleFollowState();
    }.bind(this),
    error() {
      console.log("an error!!!");
    }
  });
};

module.exports = FollowToggle;
