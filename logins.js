// ==UserScript==
// @name         IsleWard - Quality of Chat (Logins)
// @namespace    IsleWard.Addon
// @version      1.0.1
// @description  Introduces a chat filter to hide login/logout messages.
// @author       Carnagion
// @match        https://play.isleward.com/
// @grant        none
// ==/UserScript==

defer(addon, 50);

function defer(method, interval)
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
        setTimeout(handler, interval);
    }
}

function addon()
{
    let content =
        {
            init: function(events)
            {
                events.on("onGetPlayer", this.onGetPlayer.bind(this));
            },
            onGetPlayer: function()
            {
                let chat = $(".uiMessages");

                if (chat.find(".filters [filter='logins']").length !== 0)
                {
                    return;
                }

                let list = chat.find(".list");
                list.addClass("logins");

                let toggleMessages = function()
                {
                    let messages = list.find(".list-message.info").filter(function()
                    {
                        let text = $(this).text();
                        return text.match(/.* (has come online|has gone offline)$/g);
                    });
                    if (loginFilter.hasClass("active"))
                    {
                        messages.show();
                    }
                    else
                    {
                        messages.hide();
                    }
                };

                let loginFilter = $('<div class="btn filter active" filter="logins">logins</div>');
                loginFilter.insertAfter(chat.find(".filters [filter='loot']"));
                let loginFilterClick = function()
                {
                    loginFilter.toggleClass("active");
                    list.toggleClass("logins");
                    toggleMessages();
                };
                loginFilter[0].addEventListener("click", loginFilterClick);

                let childAdded = function(mutations)
                {
                    for (let mutation of mutations)
                    {
                        if (mutation.type === "childList")
                        {
                            toggleMessages();
                        }
                    }
                };
                let observer = new MutationObserver(childAdded);
                observer.observe(list[0], {childList: true});
            },
        };
    addons.register(content);
}