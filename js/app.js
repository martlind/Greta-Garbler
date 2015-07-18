
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
    });

    this.wavesurfer.on('ready', function(){ self.addRegion(); });

    this.wavesurfer.load('http://upload.wikimedia.org/wikipedia/commons/7/7a/The_Yellow_Rose_Of_Texas.ogg');
  },
  addRegion: function() {
    var start = randomIntFromInterval(0, this.wavesurfer.getDuration());
    var region = new Region({
      start: start,
      end: start + 20, // FIXME
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
  play: function () {
    // this.wavesurfer.play();
  },
  pause: function () {
    this.wavesurfer.pause();
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
  play: function() {
    this.get('timeLine').play();
  },
  pause: function() {
    this.get('timeLine').pause();
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
