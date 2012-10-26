Facts = new Meteor.Collection("facts");

Meteor.methods({
  // options should include: title, description, x, y, public
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
  Template.hello.greeting = function () {
    return "Welcome to wenatchee-facts.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Template.fact.random_fact = function() {
      var facts = Facts.find({'_id': {'$ne': Session.get('previous_fact')}}, reactive=false).fetch();
      var random = Math.floor(Math.random() * facts.length);
      var fact = facts[random];
      var unused = Session.get('fact_count');
      //var fact = Facts.findOne({}, skip=random);
      if (fact) {
          //Session.set('previous_fact', fact._id);
          return fact.text;
      }
  };

  Template.fact.events({
      'click #new': function() {
          Session.set('fact_count', Session.get('fact_count') + 1);
      }
  });

  Meteor.startup(function() {
      Session.set('fact_count', 1);
  });
      
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
