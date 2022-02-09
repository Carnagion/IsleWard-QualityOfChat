// ==UserScript==
// @name         IsleWard - Quality of Chat (Highlight)
// @namespace    IsleWard.Addon
// @version      1.1.1
// @description  Introduces a command for highlighting messages from specified players.
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
            lastUsedCommand: null,
            trackedPlayers: new Set(),
            init: function(events)
            {
                events.on("onBeforeChat", this.onBeforeChat.bind(this));
                events.on("onGetMessages", this.onGetMessages.bind(this));
            },
            onBeforeChat: function(chat)
            {
                if (chat?.message?.startsWith("/"))
                {
                    this.lastUsedCommand = chat.message;
                }
            },
            onGetMessages: function(object)
            {
                if (!object.messages)
                {
                    return;
                }

                let entry = object.messages[0];
                if (!entry || !entry.message)
                {
                    return;
                }

                if (anyElementsSatisfy(this.trackedPlayers, element => element === entry.source))
                {
                    this.highlightPlayer(entry);
                }

                if (!this.lastUsedCommand)
                {
                    return;
                }
                this.handleCommand(entry);
                this.lastUsedCommand = null;
            },
            highlightPlayer: function(entry)
            {
                entry.class = "color-yellowA";
            },
            handleCommand: function(entry)
            {
                if (this.lastUsedCommand.match(/^\/c$/gi))
                {
                    switch (this.trackedPlayers.size)
                    {
                        case 0:
                            entry.message = "Not highlighting messages from any player";
                            break;
                        default:
                            let players = "Highlighting messages from: ";
                            this.trackedPlayers.forEach(player => players += players === "Highlighting messages from: " ? player : `, ${player}`);
                            entry.message = players;
                    }
                    entry.class = "color-blueB";
                }
                else if (this.lastUsedCommand.match(/\/c .+/gi))
                {
                    let name = this.lastUsedCommand.substring(3);
                    let online = $(".uiOnline").data("ui")?.onlineList;
                    if (online?.find(player => player.name === name))
                    {
                        if (this.trackedPlayers.has(name))
                        {
                            this.trackedPlayers.delete(name);
                            entry.message = `Stopped highlighting messages from ${name}`;
                        }
                        else
                        {
                            this.trackedPlayers.add(name);
                            entry.message = `Started highlighting messages from ${name}`;
                        }
                        entry.class = "color-blueB";
                    }
                    else
                    {
                        entry.message = `${name} is not online.`;
                    }
                }
            },
        };
    addons.register(content);
}

function anyElementsSatisfy(set, condition)
{
    for (let element of set)
    {
        if (condition(element))
        {
            return true;
        }
    }
    return false;
}