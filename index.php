<!DOCTYPE html>
<html>
<head>
  <title>Ljudpuss (Greta Garbler)</title>
  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/rangeslider.js/1.2.1/rangeslider.min.css">
  <script type="text/javascript" src="//code.jquery.com/jquery-2.1.3.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/rangeslider.js/1.2.1/rangeslider.min.js"></script>
  <script type="text/javascript" src="http://www.wavesurfer.fm/dist/wavesurfer.min.js"></script>
  <script type="text/javascript">
    //<![CDATA[ 
    $(window).load(function(){

      var scaleSize = 60/$("#bpm").val()/$("#snap").val();
      var inPlayArea = 0;
      var playarea1 = {
        start: 0,
        stop: 0
      };
      var playarea2 = {
        start: 0,
        stop: 0
      };



      $("#bpm, #snap").change(function () {
        scaleSize = 60/$("#bpm").val()/$("#snap").val();
      });
    
      $("#playarea1-position").rangeslider({
        polyfill: false,
        onSlideEnd: function(position, value){
          $("#playarea1").css("left", value + "%");
          playarea1.start = audio.duration * (parseInt($("#playarea1")[0].style.left) / 100);
        }
      });

      $("#playarea1-size").rangeslider({
        polyfill: false,
        onSlideEnd: function(position, value){
          var percent = scaleSize * value;
          $("#playarea1").css("width", percent + "%");
          playarea1.stop = playarea1.start + (audio.duration * percent / 100);
        }
      });

      $("#playarea2-position").rangeslider({
        polyfill: false,
        onSlideEnd: function(position, value){
          $("#playarea2").css("left", value + "%");
          playarea2.start = audio.duration * (parseInt($("#playarea2")[0].style.left) / 100);
        }
      });

      $("#playarea2-size").rangeslider({
        polyfill: false,
        onSlideEnd: function(position, value){
          var percent = scaleSize * value;
          $("#playarea2").css("width", percent + "%");
          playarea2.stop = playarea2.start + (audio.duration * percent / 100);
        }
      });

      $(audio).bind('timeupdate', function(){
        
        if (audio.currentTime > playarea1.start && audio.currentTime < playarea1.stop) {
          inPlayArea = 1;
        }
        else if (audio.currentTime > playarea2.start && audio.currentTime < playarea2.stop) {
          inPlayArea = 2;
        }
        else {
          //go to next play area
          audio.currentTime = (inPlayArea == 1) ? playarea2.start : playarea1.start;
        }

        var percent = audio.currentTime/audio.duration * 100;

        $("#playhead").css("left", percent + "%");
        $("#status").text(audio.currentTime + " / " + audio.duration);
      });

      $("#btn-play").click(function(){
        audio.currentTime = audio.duration * (parseInt($("#playarea1")[0].style.left) / 100);
        audio.play();
      });

      $("#btn-stop").click(function(){
        audio.pause();
      });

      var wavesurfer = Object.create(WaveSurfer);

      wavesurfer.init({
        container: '.bar'
      });

      wavesurfer.load('http://upload.wikimedia.org/wikipedia/commons/7/7a/The_Yellow_Rose_Of_Texas.ogg');

    });
    //]]>
  
  </script>
  <style type="text/css">
    body {
      margin: 0;
    }
    .bar {
      height: 128px;
      background-color: #eee;
      margin-bottom: 1em;
    }
    .bar .playarea {
      position: absolute;
      height: 128px;
      background-color: rgba(0,0,0,.4);
      display: inline-block;
      width: 1em;
      z-index: 2;
    }
    #playhead {
      position: absolute;
      width: 1px;
      height: 128px;
      background-color: #000;
      display: inline-block;
    }
    .controls {
      margin: 1em;
    }
  </style>
</head>

<body>
  <audio id="audio" src="http://upload.wikimedia.org/wikipedia/commons/7/7a/The_Yellow_Rose_Of_Texas.ogg" preload="auto"></audio>
  <div class="bar">
    <div id="playarea1" class="playarea"></div>
    <div id="playarea2" class="playarea"></div>
    <div id="playhead"></div>
  </div>
  <div class="controls">
    <label>Play area 1</label><br>
    <input id="playarea1-position" type="range" min="0" max="100" step="1" value="0">
    <input id="playarea1-size" type="range" min="1" max="100" step="1" value="0">
    <br>
    <label>Play area 2</label><br>
    <input id="playarea2-position" type="range" min="0" max="100" step="1" value="0">
    <input id="playarea2-size" type="range" min="1" max="100" step="1" value="0">
    <br>
    <button id="btn-play">Play</button>
    <button id="btn-stop">Stop</button><br>
    <br>
    <label for="bpm">BPM</label><br>
    <input type="number" id="bpm" value="128"><br>
    <label for="snap">Snap</label><br>
    <select id="snap">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="4">4</option>
      <option value="8">8</option>
      <option value="16">16</option>
      <option value="16">32</option>
      <option value="16">64</option>
      <option value="16">128</option>
      <option value="16">256</option>
    </select>
    <br>
  </div>
  <div id="status"></div>
</body>
</html>