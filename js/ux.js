$.extend($.easing, {
  easeOutExpo: function (x, t, b, c, d) {
    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
  }
});


$(document).on("click", "#playareas .playarea", function() {
  var element = $(this),
      id = parseInt(element.attr("id").substr(8)), // 8 = number of chars in playarea
      colorId = id % colors.length;
  
  console.log("color: " + colors[colorId]);

  prepareSettings(element, id, colorId);
  
  $("#playarea-settings")
    .show()
    .animate({
      left: "0",
      top: "0",
      paddingTop: "64px",
      height: "100%",
      width: "100%"
    }, 120, "easeOutExpo", function() {
      // Animation complete.
      $('input[type="range"]').rangeslider('update', true);
    });
    $("#playarea-settings > *")
    .animate({
      opacity: 1
    }, 100);

});

function prepareSettings(fromElement, id, colorId) {
  var element = $("#playarea-settings"),
      fromOffset = fromElement.offset();

  //Set parameters
  editPlayArea = id;
  //set ranges!

  //Prepare for animation
  element
    .removeClass()
    .addClass(colors[colorId])
    .width(fromElement.width())
    .height(fromElement.width())
    .offset({ 
      top: fromOffset.top,
      left: fromOffset.left
    })
    .css("padding-top", "0px");
}

$('input[type="range"]').rangeslider({

  polyfill: false,

  // Callback function
  onInit: function() {
    console.log(this);
  },

  // Callback function
  onSlide: function(position, value) {},

  // Callback function
  onSlideEnd: function(position, value) {}
});

$("#edit-controls .close, #edit-controls .remove").click(function() {
  var element = $("#playarea" + editPlayArea ),
      offset = element.offset(),
      remove = ($(this).hasClass("remove")) ? true : false;

  $("#playarea-settings")
    .animate({
      left: offset.left,
      top: offset.top - $(window).scrollTop(),
      paddingTop: "0px",
      height: element.width(),
      width: element.width()
    }, 120, "easeOutExpo", function () {
      $(this)
        .removeAttr("style")
        .hide();
      if (remove) {
        removePlayArea(editPlayArea);
      }
    });
  $("#playarea-settings > *")
    .animate({
      opacity: 0
    }, 100);
    
});

$("#controls .bpm").click(function() {
  var adjustBpm = $("#adjust-bpm"),
      controls = $("#controls");

  if (controls.css("bottom") == "64px") {
    // hide
    controls
      .animate({
        bottom: "0px"
      }, 120, "easeOutExpo");
  }
  else {
    controls
      .animate({
        bottom: "64px",
        queue: false
      }, 120, "easeOutExpo");
    adjustBpm
      .animate({
        scrollLeft: parseInt($("#bpm").val())*10,
        queue: false
      }, 1000, "easeOutExpo");
  }
});

$("#adjust-bpm").on("scroll", function() {
  var bpm = Math.round($(this).scrollLeft()/10);

  if (bpm !== $("#bpm").val()) {
    $(".bpm-text").text(bpm);
    $("#bpm").val(bpm);
  }
});

$("#controls .plus, #controls .minus").click(function() {
  var plus = $(this).hasClass("plus");

  if($(this).parent().hasClass("snap")) {
    
    // Snap
    if (plus) {
      var selected = $("#snap option:selected");

      if (selected.text() !== $("#snap option:last").text()) { //dont continue if last option
        selected
          .prop("selected", false)
          .next()
          .prop("selected", true);
      }
    }
    else {
      $("#snap option:selected")
        .prop("selected", false)
        .prev()
        .prop("selected", true);
    }

    $(".snap-text").text($("#snap option:selected").text());

  }
});


// Init adjust bpm ------------------------------------------------------------

var units = 300,
    unitsHtml = "",
    markersHtml = "";

while(units--) {
  unitsHtml += '<div class="unit"></div>';
  if (!(units % 10))
    markersHtml += '<div class="marker">' + units + '</div>';
}

$("#adjust-bpm .ruler .units").append(unitsHtml);
$("#adjust-bpm .ruler .markers").append($(markersHtml).get().reverse());


