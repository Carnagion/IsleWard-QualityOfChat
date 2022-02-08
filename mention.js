// ==UserScript==
// @name         IsleWard - Quality of Chat (Mentions)
// @namespace    IsleWard.Addon
// @version      1.1.1
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
            charname: null,
            charnameSplit: null,
            init: function(events)
            {
                events.on("onGetPlayer", this.onGetPlayer.bind(this));
                events.on("onGetMessages", this.onGetMessages.bind(this));
            },
            onGetPlayer: function(player)
            {
                this.charname = player?.auth?.charname;
                if (this.charname)
                {
                    this.charnameSplit = splitByPascalCase(this.charname).split(" ");
                }
            },
            onGetMessages: function(object)
            {
                if (!this.charnameSplit || !object.messages)
                {
                    return;
                }

                let entry = object.messages[0];
                if (!entry || !entry.message)
                {
                    return;
                }

                let source = entry.source;
                if (!source || source === this.charname)
                {
                    return;
                }

                for (let part of this.charnameSplit)
                {
                    if (!stringContainsMention(entry.message, part))
                    {
                        continue;
                    }

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

// https://stackoverflow.com/questions/26188882/split-pascal-case-in-javascript-certain-case
function splitByPascalCase(string)
{
    return string
        // Look for long acronyms and filter out the last letter
        .replace(/([A-Z]+)([A-Z][a-z])/g, ' $1 $2')
        // Look for lower-case letters followed by upper-case letters
        .replace(/([a-z\d])([A-Z])/g, '$1 $2')
        // Look for lower-case letters followed by numbers
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')
        .replace(/^./, string => string.toUpperCase())
        // Remove any white space left around the word
        .trim();
}