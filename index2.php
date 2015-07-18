<!DOCTYPE html>
<html>
<head>
  <title>Ljudpuss 2 (Greta Garbler)</title>
  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/rangeslider.js/1.2.1/rangeslider.min.css">
  <link rel="stylesheet" type="text/css" href="css/app.css">
  <script type="text/javascript" src="//code.jquery.com/jquery-2.1.3.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/rangeslider.js/1.2.1/rangeslider.min.js"></script>
  <script type="text/javascript" src="http://www.wavesurfer.fm/dist/wavesurfer.min.js"></script>
  <script type="text/javascript" src="js/app.js"></script>
</head>

<body>
  <audio id="audio" src="http://upload.wikimedia.org/wikipedia/commons/7/7a/The_Yellow_Rose_Of_Texas.ogg" preload="auto"></audio>
  <div class="bar">
    <div id="playhead"></div>
  </div>
  <ul id="playareas">
    <li class="add"><div><span>+</span></div></li>
  </ul>
  <div id="controls">
    <button id="play">Play</button>
    <div>
      <input type="number" id="bpm" value="128"><br>
    </div>
    <select id="snap">
      <option value="1">1/1</option>
      <option value="2">1/2</option>
      <option value="4">1/4</option>
      <option value="8">1/8</option>
      <option value="16">1/16</option>
      <option value="32">1/32</option>
      <option value="64">1/64</option>
      <option value="128">1/128</option>
    </select>
  </div>
  <div id="playarea-settings">
    
  </div>
</body>
</html>