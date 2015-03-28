var settings = function() {
    var self = this;
    var db = undefined;

    self.initialize = function() {
        alert("init settings22");
        db = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);
        $("#settings").find("#savesettings").on('click', function(){
            saveSettings();
        });
    };

    saveSettings = function() {
        alert("save settings");
        db.transaction(function (tx) {
            tx.executeSql('UPDATE settings SET max_distance=' + $("#max_distance").val() + ' WHERE id=1');
        });
        $("#settings").find("#message").text("Max distance saved.");
    };
    return self;
};