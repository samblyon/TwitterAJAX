const FollowToggle = require("./follow_toggle");

function UsersSearch($el) {
  this.$el = $el;
  this.$ul = this.$el.find('ul.users');
  this.$input = this.$el.find('input');
  this.$input.on('input', ev => this.handleInput(ev));
}

UsersSearch.prototype.handleInput = function (ev) {
  let $target = $(ev.currentTarget);
  console.log(this.$input.val());
  $.ajax({
    method: 'GET',
    url: '/users/search.json',
    data: {query: this.$input.val()},
    success: function (data) {
      this.renderResults(data);
    }.bind(this),
    error: function() {
      console.log('Error!');
    }
  });
};

UsersSearch.prototype.renderResults = function (data) {
  this.$ul.empty();
  data.forEach((result) => {
    const li = $("<li></li>");
    const button = $("<button></button>");

    const username = result.username;
    const id = result.id;
    const followed = result.followed;
    const html = "<a href=\"/users/" + id + "\">" + username + "</a>";

    new FollowToggle(button, {
      userId: id,
      followState: `${followed}`,
    });

    li.html(html);
    this.$ul.append(li.append(button));
  });
};

module.exports = UsersSearch;
