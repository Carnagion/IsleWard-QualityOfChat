// ==UserScript==
// @name         IsleWard - Quality of Chat (Proximity)
// @namespace    IsleWard.Addon
// @version      1.1.4
// @description  Makes messages from players in a different zone appear darker.
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
            player: null,
            enableProximityChat: true,
            init: function(events)
            {
                events.on("onGetPlayer", this.onGetPlayer.bind(this));
                events.on("onGetMessages", this.onGetMessages.bind(this));
                events.on("onOpenOptions", this.onOpenOptions.bind(this));
            },
            onGetPlayer: function(player)
            {
                this.player = player?.auth?.charname;
            },
            onOpenOptions: function()
            {
                window.settings?.switch("Proximity Chat", "Quality of Chat");
                window.events?.on("onSettingsToggleClick", this.onSettingsToggleClick.bind(this));
            },
            onSettingsToggleClick: function(name, heading, previous, now)
            {
                if (name !== "Proximity Chat" && heading !== "Quality of Chat")
                {
                    return;
                }
                switch (now)
                {
                    case "On":
                        this.enableProximityChat = true;
                        break;
                    case "Off":
                        this.enableProximityChat = false;
                        break;
                }
            },
            onGetMessages: function(object)
            {
                if (!this.enableProximityChat || !this.player || !object.messages)
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