Facts = new Meteor.Collection("facts");

Meteor.methods({
  newFact: function (text) {
    if (text.length < 10)
      throw new Meteor.Error(413, "What is this, Leavenworth? You can do better than that (fact not long enough)");
    return Facts.insert({
        text: text,
        random: Math.random()
    });
  }
});

if (Meteor.isClient) {

  // Fact Template
  ////////////////////////////////////////
  Template.fact.random_fact = function() {
      var facts, fact;
      var newFact = Session.get("newlyCreatedFact");
      if (newFact) {
          fact = Facts.findOne({'_id': newFact});
      } else {
          facts = Facts.find({'_id': {'$ne': Session.get('previous_fact')}}, reactive=false).fetch();
          var random = Math.floor(Math.random() * facts.length);
          fact = facts[random];
      }
      //var fact = Facts.findOne({}, skip=random);
      if (fact) {
          Session.set('current_fact', fact._id);
          return fact.text;
      }
  };

  Template.fact.events({
      'click #new': function() {
          Session.set('newlyCreatedFact', false);
          Session.set('previous_fact', Session.get('current_fact'));
      },
      'click #submit': function(){
          Session.set('showSubmitDialog', true);
      }
  });

  var openCreateDialog = function () {
    Session.set("submitError", null);
    Session.set("showSubmitDialog", true);
  };

  Template.page.showSubmitDialog = function () {
    return Session.get("showSubmitDialog");
  };

  Template.submitFact.rendered = function() {
      var self = this;
      self.input = self.find("input");
      $(self.input).focus();
  };

  Template.submitFact.error = function () {
    return Session.get("submitError");
  }; 

  Template.submitFact.events({
    'click .save': function (event, template) {
      var text = template.find(".fact").value;
      callback = function(err, data){
          Session.set("newlyCreatedFact", data);
      }
      Meteor.call('newFact', text, callback);
      Session.set("showSubmitDialog", false);
    },
    'click .cancel': function() {
      Session.set("showSubmitDialog", false);
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
