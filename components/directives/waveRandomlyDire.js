mj.directive("waveRandomly", function () {
    return{
        restrict: "E",
        template: "<div class='loader valign-wrapper'>" +
            "<div class='loader-inner ball-scale-random halign valign'>" +
            "<div></div>" +
            "<div></div>" +
            "<div></div>" +
            "</div></div>"
    }
});