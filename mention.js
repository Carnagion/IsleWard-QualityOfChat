// ==UserScript==
// @name         IsleWard - Quality of Chat (Mentions)
// @namespace    IsleWard.Addon
// @version      1.1.0
// @description  Highlights messages that mention the player's character name.
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
            player: null,
            init: function(events)
            {
                events.on("onGetPlayer", this.onGetPlayer.bind(this));
                events.on("onGetMessages", this.onGetMessages.bind(this));
            },
            onGetPlayer: function(player)
            {
                this.player = player?.auth?.charname;
            },
            onGetMessages: function(object)
            {
                if (!this.player || !object.messages)
                {
                    return;
                }

                let entry = object.messages[0];
                if (!entry || !entry.message)
                {
                    return;
                }

                let source = entry.source;
                if (!source || source === this.player)
                {
                    return;
                }

                if (stringContainsMention(entry.message, this.player))
                {
                    if (entry.class.match(/\bcolor-gray([BCD])\b/gi))
                    {
                        entry.class = "color-grayA";
                    }
                    else if (entry.class.match(/\bcolor-teal([BCD])\b/gi))
                    {
                        entry.class = "color-tealB";
                    }
                }
            },
        };
    addons.register(content);
}

function stringContainsMention(message, target)
{
    for (let index = Math.round((1 / 3) * target.length); index <= target.length; index += 1)
    {
        let match = target.substring(0, index);
        let regex = new RegExp(`\\b${match}\\b`, "gi"); // eg. /\bCarnagion\b/gi
        if (message.match(regex))
        {
            return true;
        }
    }
    return false;
}