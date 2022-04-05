
function sidebarToggle() {

  $("#menu-toggle").click(function (e) {
    e.preventDefault();
    $(".main-wrapper").toggleClass("toggled");
  });
}
