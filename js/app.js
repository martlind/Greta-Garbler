// Global variables -----------------------------------------------------------

var scaleSize = calculateScaleSize(),
    currentPlayArea = 0,
    editPlayArea = 0,
    playAreasCount = 0,
    playAreas = [],
    colors = [
      "tomato",
      "gold",
      "darkorange",
      "limegreen",
      "mediumorchid",
      "hotpink",
      "lightsteelblue"
    ],
    playInterval;

// Init on audio loaded -------------------------------------------------------

audio.onloadeddata = function () {

  console.log("onloadeddata");
  console.log("audio.duration: " + audio.duration);

  // Create 4 playAreas
  for (var i = 0; i < 4; i++) {
    addNewPlayArea();
  }

}


// PlayArea specific functions ------------------------------------------------

function addNewPlayArea() {
  var start = randomIntFromInterval(0, Math.floor(audio.duration));
  var steps = scaleSize * randomIntFromInterval(1, 1);

  setPlayArea(playAreasCount++, start, start + steps, steps);
}

function setPlayArea(id, start, stop, steps) {
  console.log(id + " - " + start + " - " + stop);
  
  addPlayAreaLater = (!$.isArray(playAreas[id])) ? true : false;

  playAreas[id] = {
    start: start,
    stop: stop,
    steps: steps
  };

  if (addPlayAreaLater) {
    addPlayArea(id);
  }
}

function updateAllPlayAreas() {
  var i = playAreas.length;
  while (i--) {
    playAreas[i].stop = playAreas[i].start + playAreas[i].stop * playAreas[i].steps;
  }
}

function addPlayArea(id) {
  var leftPercent = playAreas[id].start / audio.duration * 100,
      sizePercent = (playAreas[id].stop - playAreas[id].start) / audio.duration * 100,
      colorId = id % colors.length;

  console.log("addPlayArea: " + id + " colorId: " + colorId);
  
  $("#playareas li:last").before('<li id="playarea' + id + '" class="playarea ' + colors[colorId] + '"><div class="button"></div></li>');
  $("#playarea" + id)
    .width("0px")
    .animate({
      width: $("#playareas li:last").width() + "px"
    }, 120, "easeOutExpo", function () {
      $(this).removeAttr("style");
    });
  $("#playhead").before('<div id="barplayarea' + id + '" class="playarea ' + colors[colorId] + '" style="left:' + leftPercent + '%; width:' + sizePercent + '%;"></div>');
}

function removePlayArea(id) {
  var element = $("#playarea" + id),
      barplayarea = $("#barplayarea" + id);

  playAreas.splice(id, 1);

  element.animate({
    width: "0"
  }, 180, "easeOutExpo", function () {
    $(barplayarea).remove();
    $(this).remove();
  });
}


// Helpers --------------------------------------------------------------------

function isPlaying(audio) { return !audio.paused; }

function randomIntFromInterval(min, max) { return Math.floor(Math.random()*(max-min+1)+min); }

function calculateScaleSize() { return 60/$("#bpm").val()/$("#snap").val(); }


// Player

function movePlayHead(currentTime) {
  var percent = currentTime/audio.duration * 100;
  $("#playhead").css("left", percent + "%");
}

function run() {

  console.log(audio.currentTime);

  var currentTime = audio.currentTime,
      stop = playAreas[currentPlayArea].stop,
      currentDiff = Math.abs(stop - currentTime);

  console.log("stop - currentTime: " + Math.abs(stop - currentTime) + " - " + (currentDiff > scaleSize));

  if (currentDiff > scaleSize) {
    movePlayHead(currentTime);
    return;
  }
  else if (currentDiff < Math.abs(stop - (currentTime + scaleSize))) {
    playNextArea();
  }
}

function playNextArea() {
  var nextPlayArea = currentPlayArea + 1;

  if (nextPlayArea == playAreas.length) {
    audio.currentTime = playAreas[0].start;
    currentPlayArea = 0;
  }
  else {
    audio.currentTime = playAreas[nextPlayArea].start;
    currentPlayArea = nextPlayArea;
  }
  movePlayHead(audio.currentTime);
}


// User interactions ----------------------------------------------------------

$("#bpm, #snap").change(function () {
  scaleSize = calculateScaleSize();
});

$("#playareas .add").click(function() {
  addNewPlayArea();
});

$("#play").click(function() {
  if (isPlaying(audio)) {
    audio.pause();
    $("#play i use").attr("xlink:href", "images/icons.svg#play");
    clearInterval(playInterval);
  }
  else {
    audio.currentTime = playAreas[0].start;
    audio.play();
    console.log(audio.currentTime);
    playInterval = setInterval(run, scaleSize*1000);
    $("#play i use").attr("xlink:href", "images/icons.svg#pause");
    // $(this).text("Stop");
  }
});


// Wavesurfer init  -----------------------------------------------------------

var wavesurfer = Object.create(WaveSurfer);

wavesurfer.init({
  container: '.bar',
  height: 64,
  hideScrollbar: true,
  interact: false
});

wavesurfer.load(audio.src);


// Fastclick init  ------------------------------------------------------------

$(function() {
    FastClick.attach(document.body);
});
