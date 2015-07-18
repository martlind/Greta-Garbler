
$(document).on("click", "#playareas .playarea", function() {
  var element = $(this),
      id = parseInt(element.attr("id").substr(8)),
      colorId = id % colors.length;
  
  console.log("color: " + colors[colorId]);

  prepareSettings(element, id, colorId);
  $("#playarea-settings").show()
    .animate({
    left: "0",
    top: "0",
    marginTop: "128px",
    height: "100%",
    width: "100%"
  }, 250, function() {
    // Animation complete.
  });

});

function prepareSettings(fromElement, id, colorId) {
  var element = $("#playarea-settings"),
      fromOffset = fromElement.offset();

  //Set parameters


  //Prepare for animation
  element.removeClass().
    addClass(colors[colorId])
    .width(fromElement.width())
    .height(fromElement.width())
    .offset({ 
      top: fromOffset.top, 
      left: fromOffset.left
    });

}