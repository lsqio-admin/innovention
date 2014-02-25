var opts = {
  lines: 13, // The number of lines to draw
  length: 0, // The length of each line
  width: 4, // The line thickness
  radius: 57, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 90, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 0.5, // Rounds per second
  trail: 27, // Afterglow percentage
  shadow: true, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};
window.onload = function(){
  var target = document.getElementById('___spin');
  var spinner = new Spinner(opts).spin(target);
}