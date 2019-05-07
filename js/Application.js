$(function () {
    function Application() {
        var self = this;
        var savedCharacters = (JSON.parse(window.localStorage.getItem("characters")) || []).map(Character.fromJson);
        savedCharacters.unshift(Character.newCharacter());
        savedCharacters[0].ghost = true;

        self.mode = ko.observable("list");
        self.characterId = ko.observable(0);
        self.characters = ko.observableArray(savedCharacters);
        self.realCharacters = ko.computed(function () {
            return self.characters().filter(function (c) {
                return !c.ghost;
            });
        });
        self.character = ko.computed(function () { return self.characters()[self.characterId()]; });
        self.dice = new Dice();
        self.previousSection = null;
    }

    Application.prototype.goBack = function () {
        var self = this;
        if (self.mode() === "sheet") self.mode("list");
        else {
            self.mode("sheet");

            if (self.previousSection) {
                window.location.hash = self.previousSection;
            }
        }
    };

    Application.prototype.newCharacter = function () {
        var self = this;
        self.characters.push(Character.newCharacter());
        self.characterId(self.characters().length - 1);
        self.mode("sheet");
    };

    Application.prototype.selectCharacter = function (character) {
        var self = this;
        self.characterId(self.characters.indexOf(character));
        self.mode("sheet");
    };

    Application.prototype.deleteCharacter = function () {
        var self = this;
        swal({
            title: "Delete " + self.character().name(),
            text: "Are you sure? (As long as you don't click save, your character won't be gone.)",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
        .then(function (willDelete) {
            if (willDelete) {
                var id = self.characterId();
                self.characterId(id - 1);
                self.characters.remove(self.characters()[id]);
                self.mode("list");
            }
        });
    };

    Application.prototype.saveCharacters = function () {
        var self = this;
        window.localStorage.setItem("characters", JSON.stringify(self.realCharacters().map(function (c) {
            return c.toJson();
        })));
        swal("Characters saved successfully!", {
            button: false,
            timer: 1000,
            icon: "success"
        });
    };

    Application.prototype.downloadCharacter = function () {
        var self = this;
        var json = JSON.stringify(self.character().toJson());

        var dl = document.createElement("a");
        dl.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(json)}`);
        dl.setAttribute("download", `${self.character().name()}.json`);

        dl.style.display = "none";
        document.body.appendChild(dl);

        dl.click();

        document.body.removeChild(dl);
    };

    Application.prototype.uploadCharacter = function () {
        var self = this;
        var ul = document.createElement("input");
        ul.type = "file";
        ul.accept = ".json";
        ul.style.display = "none";

        ul.addEventListener("change", function (e) {
            var file = ul.files[0];
            if (!file) return;

            var reader = new FileReader();
            reader.onload = function (e) {
                var json = e.target.result;
                self.characters.push(Character.fromJson(JSON.parse(json)));
                self.characterId(self.characters().length - 1);
                self.mode("sheet");
            };
            reader.readAsText(file);
        });

        document.body.appendChild(ul);

        ul.click();

        document.body.removeChild(ul);
    };
    
    Application.prototype.switchMode = function (mode) {
        var self = this;
        return function () {
            if (self.mode() !== "list" && document.getElementById(mode)) {
                self.previousSection = mode;
            }
            else self.previousSection = null;
            window.location.hash = "";

            self.mode(mode);
        };
    };

    window.Application = Application;
});