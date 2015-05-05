
Meteor.startup(() => {

    BotService.createBots();


    BotService.observeGameCreation();

    if (process.env.BOTGAME == 1){
        BotService.createBotGame("Random");
    }

});

Accounts.onLogin(attempt => {
    if (!attempt.allowed) {
        return;
    }

    if (attempt.type === 'resume') {
        // TODO: Figure out if/when we need to trigger a new fetch on resume.
    }
    else {
        Server.fetchData(attempt.user._id);
    }
});
