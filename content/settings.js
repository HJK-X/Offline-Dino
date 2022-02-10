// 5 hours of javascript experience be like:

var config = {};
var resources = {};
var options;
var stat;

// Saves options to chrome.storage
async function saveOptions() {
    await chrome.storage.local.set({
        runnerConfig: config,
        offlineResources: resources,
    });

    stat.textContent = "Saved";
}

// restores current options
async function restoreOptions() {
    var storage = await chrome.storage.local.get([
        "runnerConfig",
        "offlineResources",
    ]);
    config = storage.runnerConfig;
    resources = storage.offlineResources;
    options = document.getElementById("options");
    options.innerHTML = "";

    // config numbers
    for (var [key, value] of Object.entries(config)) {
        var item = document.createElement("div");
        var label = document.createElement("label");
        label.htmlFor = key;
        label.textContent = key;
        var input = document.createElement("input");
        input.id = key;
        input.type = "number";
        input.step = "any";
        input.value = parseFloat(value);

        input.addEventListener("change", (e) => {
            config[e.target.id] = e.target.value;
        });

        item.appendChild(label);
        item.appendChild(input);

        options.appendChild(item);
        options.appendChild(document.createElement("br"));
    }

    options.appendChild(document.createElement("br"));

    //config images
    {
        var item = document.createElement("div");
        var label = document.createElement("label");
        label.htmlFor = "SpriteSheet";
        label.textContent = "Sprite Sheet";
        var input = document.createElement("input");
        input.id = "SpriteSheet";
        input.type = "file";
        input.accept = "image/*";
        var image = document.createElement("img");
        image.id = "SpriteSheetr";
        image.src = resources.SPRITES;

        input.addEventListener("change", (e) => {
            convertFile(e.target.files[0], (val) => {
                var a = document.getElementById("SpriteSheetr");
                a.src = val;

                resources.SPRITES = val;
            });
        });

        item.appendChild(label);
        item.appendChild(input);
        item.appendChild(image);

        options.appendChild(item);
        options.appendChild(document.createElement("br"));
    }

    options.appendChild(document.createElement("br"));

    //config audio
    for (var [key, value] of Object.entries(resources)) {
        if (!(key == "SPRITES")) {
            var item = document.createElement("div");
            var label = document.createElement("label");
            label.htmlFor = key;
            label.textContent = key + " AUDIO";
            var input = document.createElement("input");
            input.id = key;
            input.type = "file";
            input.accept = "audio/*";
            var audio = document.createElement("audio");
            audio.controls = "controls";
            audio.id = key + "r";
            audio.src = value;

            input.addEventListener("change", (e) => {
                convertFile(e.target.files[0], (val) => {
                    var a = document.getElementById(e.target.id + "r");
                    a.src = val;

                    resources[e.target.id] = val;
                });
            });

            item.appendChild(label);
            item.appendChild(input);
            item.appendChild(audio);

            options.appendChild(item);

            options.appendChild(document.createElement("br"));
        }
    }
}

function convertFile(file, callback) {
    var reader = new FileReader();
    reader.onload = function (event) {
        callback(event.target.result);
    };
    reader.readAsDataURL(file);
}

// resets options to base game
async function restoreDefaults() {
    await chrome.runtime.sendMessage({ id: "reset" }, () => {
        restoreOptions();
    });
    stat.textContent = "Defaults Restored";
}
function game() {
    var old_url = window.location.search.substring(1);
    window.location = "/content/dino.html?" + old_url;
}

document.addEventListener("DOMContentLoaded", async function () {
    stat = document.getElementById("status");
    await restoreOptions();
    document.getElementById("save").addEventListener("click", saveOptions);
    document
        .getElementById("restore")
        .addEventListener("click", restoreDefaults);
    document.getElementById("game").addEventListener("click", game);
});
