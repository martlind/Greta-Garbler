
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
      paddingTop: "128px",
      height: "100%",
      width: "100%",
      opacity: 1
    }, 100, function() {
      // Animation complete.
      $('input[type="range"]').rangeslider('update', true); //Is this needed?
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

  console.log("top: " + fromOffset.top);
  console.log("left: " + fromOffset.left);
  console.log("width: " + fromElement.width());
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

$("#edit-controls .close").click(function() {
  var element = $("#playarea" + editPlayArea ),
      offset = element.offset();

  $("#playarea-settings")
    .animate({
      left: offset.left,
      top: offset.top,
      paddingTop: "0px",
      height: element.width(),
      width: element.width(),
      opacity: 0
    }, 100, function () {
      $(this).hide();
    });
    
});

