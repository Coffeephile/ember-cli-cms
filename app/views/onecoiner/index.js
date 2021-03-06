import Ember from 'ember';
import config from '../../config/environment';
/*global flipCounter */

export default Ember.View.extend({

  initOnecoiner: function () {
    //forntend counter
    if (Ember.$("div#joinedPeople").length > 0) {
      this.makeCounter(this.flipCounter());
    }
  }.on('didInsertElement'),

  flipCounter: function () {
    var myCounter = new flipCounter("counter", {pace: 800, auto: false});
    return myCounter;
  },

  makeCounter: function (myCounter) {
    var _this = this;
    var url = 'api/v1/onecoiners';

    if (config.adapter.host){
      url = config.adapter.host + "/" + url;
    }

    Ember.$.getJSON(url).then(function (data) {
      myCounter.setValue(data.counter);

      _this.initClock().on('finish.countdown', function () {
        Ember.run(function () {
          _this.makeCounter(myCounter);
          _this.initClock();
        });
      });
    });
  },

  // Turn on Bootstrap
  //$('[data-toggle="tooltip"]').tooltip();

  // 60s from now!
  get15dayFromNow: function () {
    return new Date(new Date().valueOf() + 60 * 1000);
  },

  clock: function () {
    return Ember.$('#clock');
  },

  initClock: function () {
    //var _this = this;
    return this.clock().countdown(this.get15dayFromNow(), function (event) {
      Ember.$(this).html(event.strftime('%H:%M:%S'));
    });
  },

  actions: {
    refresh: function () {
      this.makeCounter(this.flipCounter());
      //this.initClock();
    },

    pause: function () {
      this.clock().countdown('pause');
    },

    resume: function () {
      this.clock().countdown('resume');
    }
  }

});
