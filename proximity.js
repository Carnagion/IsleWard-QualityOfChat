// ==UserScript==
// @name         IsleWard - Quality of Chat (Proximity)
// @namespace    IsleWard.Addon
// @version      1.0.0
// @description  Highlights messages from players in the same zone.
// @author       Carnagion
// @match        play.isleward.com*
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

                let online = $(".uiOnline").data("ui")?.onlineList;
                if (!online)
                {
                    return;
                }

                let senderZone = online.find(player => player.name === source)?.zone;
                let receiverZone = online.find(player => player.name === this.player)?.zone;
                if (senderZone === receiverZone)
                {
                    return;
                }

                switch (entry.class)
                {
                    case "color-grayB":
                        entry.class = "color-grayC";
                        break;
                    case "color-tealC":
                        entry.class = "color-tealD";
                        break;
                }
            },
        };
    addons.register(content);
}