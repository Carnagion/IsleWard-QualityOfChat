// ==UserScript==
// @name         IsleWard - Quality of Chat (Spam)
// @namespace    IsleWard.Addon
// @version      1.1.1
// @description  Makes messages that are likely to be spam appear darker.
// @author       Carnagion
// @match        https://play.isleward.com/
// @grant        none
// ==/UserScript==

defer(addon);

function defer(method)
{
    if (window.jQuery)
    {
        method();
    }
    else
    {
        let handler = function()
        {
            defer(method);
        }
        setTimeout(handler, 50);
    }
}

function addon()
{
    let content =
        {
            enableSpamDetection: true,
            init: function(events)
            {
                events.on("onGetPlayer", this.onGetPlayer.bind(this));
                events.on("onGetMessages", this.onGetMessages.bind(this));
            },
            onGetPlayer: function()
            {
                window.settings?.switch("Spam Detection", "Quality of Chat");
                window.events?.on("onSettingsToggleClick", this.onSettingsToggleClick.bind(this));
            },
            onSettingsToggleClick: function(name, heading, previous, now)
            {
                if (name !== "Spam Detection" && heading !== "Quality of Chat")
                {
                    return;
                }
                switch (now)
                {
                    case "On":
                        this.enableSpamDetection = true;
                        break;
                    case "Off":
                        this.enableSpamDetection = false;
                        break;
                }
            },
            onGetMessages: function(object)
            {
                if (!this.enableSpamDetection || !object.messages)
                {
                    return;
                }

                let entry = object.messages[0];
                if (!entry || !entry.class.match(/^color-gray[BCD]$/gi))
                {
                    return;
                }

                let message = entry.message;
                if (!message)
                {
                    return;
                }

                let difference = getCharDifference(message);
                let variety = getCharVariety(message);
                if (difference < 10 || (difference < 15 && variety < 10))
                {
                    entry.class = "color-grayD";
                }
            },
        };
    addons.register(content);
}

function getCharDifference(message)
{
    let spam = 0;
    for (let index = 1; index < message.length; index += 1)
    {
        let difference = message.charCodeAt(index) - message.charCodeAt(index - 1)
        spam += Math.abs(difference);
    }
    return spam / message.length;
}

function getCharVariety(message)
{
    let chars = new Set();
    for (let char of message)
    {
        if (!chars.has(char))
        {
            chars.add(char);
        }
    }
    return chars.size;
}