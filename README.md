# Quality of Chat

IsleWard - Quality of Chat adds a few simple quality-of-life features to [IsleWard](https://play.isleward.com)'s chat.

Current version: `1.1.3`

## Features

- #### Proximity chat  
  Messages from players that are in a different zone to the user appear darker than others. This allows the user to focus their attention on players that are closer.

- #### Spam detection  
  Messages that could potentially be spam appear much darker than others, drawing focus away from them.  
  - *Note that while the spam-detection algorithm is fairly good, it is not perfect, so some messages may appear darkened even though they are not spam.*

- #### Name mentions  
  Messages that contain the user's character's name (either partially or fully) appear brighter, and a sound is played. This makes it easier to notice when someone is calling to or starting a conversation with the user.  
  - *Note that this feature may not always be perfect, as it is simply impossible to account for every possible shortened form of a username.*

- #### Message highlighting  
  Introduces the `/c` command. This command allows the user to "flag" specified players.  
  Messages from flagged players will appear brighter in the chat box, making it easier to follow conversations without getting lost in a wall of text.  
  - `/c` lists the currently flagged players.
  - `/c playername` flags the player named `playername` (or un-flags them if they were already flagged).

Each feature is entirely self-contained in its own `.js` file.  
Technically, this means that each feature is treated as a separate addon, and can be removed without affecting the others. All one needs to do is remove the relevant `.js` file.

## Installation

The installation procedure is different, depending on whether one is playing using a browser, or on the [IsleWard client](https://gitlab.com/Isleward/desktop-client).

- #### Client  
  Refer to [this link](https://gitlab.com/Isleward/desktop-client#how-do-i-load-addons).
- #### Browser  
  Install [ViolentMonkey](https://violentmonkey.github.io/get-it/). Then, install each `.js` file as *separate scripts* in ViolentMonkey.

## FAQs

- #### I don't like some features. How do I remove/disable them?  
  Simply remove the relevant `.js` file (from the addons directory if using the client, or from the ViolentMonkey script list if using a browser).

- #### Will this affect other players?  
  No, this is an entirely client-side addon. Only the user will be able to see the changes made.

- #### What about performance and memory usage?  
  Most likely won't be a problem. Each script is fairly lightweight.