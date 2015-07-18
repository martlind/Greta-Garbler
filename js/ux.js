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
  else {
    
    // BPM
    if (plus) {
      $("#bpm").val(parseInt($("#bpm").val())+1);
    }
    else {
      $("#bpm").val(parseInt($("#bpm").val())-1);
    }

    $(".bpm-text").text(parseInt($("#bpm").val()));

  }
});


