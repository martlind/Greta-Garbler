
var Region = Backbone.Model.extend({
  initialize: function() {
    var self = this;
    this.on('change:waveSurferRegion', function() {
      self.wireUpRegion();
    });
  },
  setInitialAttributes: function() {
    // this.set('in', );
  },
  wireUpRegion: function() {
    var waveSurferRegion = this.get('waveSurferRegion');
    var self = this;
    waveSurferRegion.on('in', function() {
      self.trigger('start');
    });
    waveSurferRegion.on('out', function() {
      self.trigger('stop');
    });
    waveSurferRegion.on('remove', function() {
      self.trigger('remove');
    });
    waveSurferRegion.on('update', function() {
      self.trigger('update');
    });
  },
  play: function() {
    this.get('waveSurferRegion').play();
  },
  modify: function(options) {
    this.get('waveSurferRegion').update(options);
  },
  remove: function() {
    this.get('waveSurferRegion').remove();
  }
});

var TimeLine = Backbone.Collection.extend({
  model: Region,
  initialize: function() {
    this.currentRegionIndex = 0;
    this.wavesurfer = null;
    this.playing = false;
    this.controls = new Controls({
      el: $('#controls'),
      collection: this
    });
  },
  ready: function() {
    var self = this;
    this.wavesurfer.on('ready', function() {
      self.addRegion();
      self.addRegion();
      self.addRegion();
      self.addRegion(); // Best loop ever!
    });
    this.wavesurfer.load('http://upload.wikimedia.org/wikipedia/commons/7/7a/The_Yellow_Rose_Of_Texas.ogg');
  },
  addRegion: function(start, end) {
    if (start == null) {
      start = randomIntFromInterval(0, this.wavesurfer.getDuration());
    }
    if (end == null) {
      end = start + 5 // FIXME
    }
    var region = new Region({
      start: start,
      end: end
    });
    this.add(region);
    var waveSurferRegion = this.wavesurfer.addRegion({
      start: region.get('start'),
      end: region.get('end'),
      color: 'hotpink',
      drag: false,
      resize: false
    });
    region.set('waveSurferRegion', waveSurferRegion);
  },
  togglePlay: function() {
    var self = this;
    var iterateRegions = function() {
      if (self.currentRegionIndex >= self.length - 1) {
        self.currentRegionIndex = 0;
      } else {
        self.currentRegionIndex++;
      }
      var region = self.at(self.currentRegionIndex);
      region.play();
    }
    if (!this.playing) {
      this.wavesurfer.on('region-out', iterateRegions);
      iterateRegions();
      this.playing = true;
      this.trigger('playing');
      return true
    } else {
      this.wavesurfer.un('region-out');
      this.wavesurfer.pause();
      this.playing = false;
      self.currentRegionIndex = 0;
      this.trigger('paused');
      return false
    }
  },
});

var Controls = Backbone.View.extend({
  events: {
    'click #play': 'togglePlay',
    'change #bpm, #snap': 'calculateScaleSize'
  },

  initialize: function() {
    // this.listenTo(this.collection, 'playing paused', this.togglePlay);
  },

  togglePlay: function() {
    var button = this.$el.find('#play')
    if (this.collection.togglePlay()) {
      button.text('Pause')
    } else {
      button.text('Play')
    }
  },

  calculateScaleSize: function() {
    // noop
  },

  render: function() {
    // noop
  }
});

var App = Backbone.Model.extend({
  initialize: function() {
    this.setupApplication();
  },
  setupApplication: function() {
    var wavesurfer = Object.create(WaveSurfer);
    this.set('wavesurfer', wavesurfer);

    wavesurfer.init({
      container: '.bar',
      interact: false,
      progressColor: '#999'
    });
    // TODO: create a couple of random Region's to initialize TimeLine with
    this.set('timeLine', new TimeLine());
    this.set('bpm', 120);
    this.get('timeLine').wavesurfer = wavesurfer;
    this.get('timeLine').ready();
  },
  togglePlay: function() {
    this.get('timeLine').togglePlay();
  },
  loadFile: function (fileName) {
    this.get('timeLine').loadFile();
  }
});

// -- Helpers

function randomIntFromInterval(min, max) { return Math.floor(Math.random()*(max-min+1)+min); }

function calculateScaleSize(bpm, snap) { return 60/bpm/snap; }

// -- All set, let's start!

jQuery(function() {
  window.app = new App()
});
