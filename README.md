# Quality of Chat

IsleWard - Quality of Chat adds a few simple quality-of-life features to [IsleWard](https://play.isleward.com)'s chat box.

___

### Features

- #### Proximity chat  
  Messages from players that are in a different zone to the user will appear darker, allowing you to focus your attention on players that are closer.

- #### Spam detection  
  Messages that could potentially be spam will appear much darker, drawing away focus from them.  
  While the spam-detection algorithm is fairly good, it is not perfect, so note that some messages may appear darkened even though they are not spam.

- #### Name mentions  
  Messages that contain the user's character's name (either partially or fully) will appear brighter, allowing one to notice more easily if someone might be saying something directed at them.

Each feature is entirely self-contained in its own `.js` file.  
Technically, this means that each feature is treated as a separate addon, and can be removed without affecting the others. All one needs to do is remove the respective `.js` file.

___

### Installation

The installation procedure is different, depending on whether one is playing using a browser, or on the [IsleWard client](https://gitlab.com/Isleward/desktop-client).

- #### Client  
  Refer to [this link](https://gitlab.com/Isleward/desktop-client#how-do-i-load-addons).
- #### Browser  
  Install [ViolentMonkey](https://violentmonkey.github.io/get-it/). Then, install each `.js` file as *separate scripts* in ViolentMonkey.

---

### FAQs

- #### I don't like some features. How do I remove/disable them?  
  Simply remove the respective `.js` file (from the addons directory if using the client, or from the ViolentMonkey script list if using a browser).

- #### Will this affect other players?  
  No, this is an entirely client-side addon. Only the user will be able to see the changes made.

- #### What about performance and memory usage?  
  Most likely won't be a problem. Each script is fairly lightweight.