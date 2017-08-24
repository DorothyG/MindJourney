mj.service("transferValues", function () {
    var value = null;
    this.transfer = function (value) {
        this.value = value;
    };

    this.get = function () {
        return this.value;
    }
});