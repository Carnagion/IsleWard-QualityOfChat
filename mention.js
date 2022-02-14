// ==UserScript==
// @name         IsleWard - Quality of Chat (Mentions)
// @namespace    IsleWard.Addon
// @version      1.1.4
// @description  Makes messages that mention the player's character name appear brighter and plays a sound.
// @author       Carnagion
// @match        https://play.isleward.com/
// @grant        none
// ==/UserScript==

retry(addon, () => window.jQuery, 50);

function retry(method, condition, interval)
{
    if (condition())
    {
        method();
    }
    else
    {
        let handler = function()
        {
            retry(method, condition, interval);
        }
        setTimeout(handler, interval);
    }
}

function addon()
{
    let content =
        {
            charname: null,
            charnameSplit: null,
            mentionMode: "Audiovisual",
            init: function(events)
            {
                events.on("onGetPlayer", this.onGetPlayer.bind(this));
                events.on("onGetMessages", this.onGetMessages.bind(this));
                events.on("onSettingsToggleClick", this.onSettingsToggleClick.bind(this));
            },
            onGetPlayer: function(player)
            {
                if ($(".ui-container .uiOptions .bottom .list").length === 0)
                {
                    retry(() => this.onGetPlayer.bind(this, player), () => $(".ui-container .uiOptions .bottom .list").length !== 0, 100);
                    return;
                }
                window.settings?.toggle("Mentions", ["Audiovisual", "Audio", "Visual", "Off"], "Quality of Chat");

                this.charname = player?.auth?.charname;
                if (this.charname)
                {
                    this.charnameSplit = splitByPascalCase(this.charname).split(" ");
                }
            },
            onSettingsToggleClick: function(name, heading, previous, now)
            {
                if (name === "Mentions" && heading === "Quality of Chat")
                {
                    this.mentionMode = now;
                }
            },
            onGetMessages: function(object)
            {
                if (this.mentionMode === "Off" || !this.charnameSplit || !object.messages)
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
                    if (stringContainsMention(entry.message, part))
                    {
                        this.highlightPlayer(entry);
                        break;
                    }
                }
            },
            highlightPlayer: function(entry)
            {
                let mode = this.mentionMode.toLowerCase();
                if (mode.includes("visual"))
                {
                    if (entry.class.match(/^color-gray[BCD]$/gi))
                    {
                        entry.class = "color-grayA";
                    }
                    else if (entry.class.match(/^color-teal[CD]$/gi))
                    {
                        entry.class = "color-tealB";
                    }
                }

                if (mode.includes("audio"))
                {
                    window.addons.events?.emit("onPlaySound", "receiveMail");
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
        if (match.length <= 1)
        {
            continue;
        }

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