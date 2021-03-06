const { Command } = require('discord-akairo');
const { TextChannel } = require('discord.js');
const sendmessage = require('../util/sendmessage');

class HelpCommand extends Command {
  constructor() {
    super('help', {
      aliases: ['help', 'about', 'commands']
    });
  }

  async exec(message, args) {
    let lines = [
      '**First Come, First Serve**',
      '',
      '__Commands__',
      'default prefix: fcfs!',
      '',
      '`(addadminrole|aar) <roleName>`',
      'Adds a bot admin role.',
      '',
      '`(removeadminrole|rar) <roleName>`',
      'Removes a bot admin role.',
      '',
      '`(listadminroles|lar)`',
      'Lists bot admin roles.',
      '',
      '`setprefix <prefix>`',
      'Changes the bot prefix in this server.',
      '',
      '`(createwaitingroom|cwr) "<monitorChannel>" <firstN> <rejoinWindow> <afkCheckDuration>`',
      'Creates a monitor for the channel specified by `monitorChannel` that displays the first `firstN` users in the queue, allowing them `rejoinWindow` of time being disconnected before they\'re removed from the queue, and giving them `afkCheckDuration` to react to AFK Checks.',
      'Example: `fcfs!cwr "Waiting Room 1" 10 5s 20s`',
      '',
      '`(listwaitingrooms|lwr) [page]`',
      'Displays a list of waiting rooms on the server.',
      '',
      '`(deletewaitingroom|dwr) "<monitorChannel>"`',
      'Deletes the waiting room associated with `monitorChannel`.',
      '',
      '`info "<monitorChannel>"`',
      'Displays information about `monitorChannel`.',
      '',
      '`(checkposition|position|p) [member]`',
      'Displays a member\'s place in queue.',
      '',
      '`(setposition|sp) <member> <position>`',
      'Sets a user\'s position in queue.',
      '',
      '`(pingafk|ping|afkcheck) <mention>`',
      'DMs the mentioned user and disconnects them if they don\'t respond in time.',
      '',
      '`(setrestrictedmode|srm) "<monitorChannel>" [on|off]`',
      'Sets whether only users with mod roles can use the pingafk command for users in `monitorChannel`.',
      '',
      '`(addmodrole|amr) "<monitorChannel>" <roleName>`',
      'Adds a mod role for `monitorChannel`.',
      '',
      '`(removemodrole|rmr) "<monitorChannel>" <roleName>`',
      'Removes a mod role for `monitorChannel`.',
      '',
      '`(listmodroles|lmr) "<monitorChannel>"`',
      'Lists mod roles for `monitorChannel`.',
      '',
      '`(setfirstn|sfn) "<monitorChannel>" <firstN>`,',
      '`(setrejoinwindow|srw) "<monitorChannel>" <rejoinWindow>`,',
      '`(setafkcheckduration|sacd) "<monitorChannel>" <afkCheckDuration>`',
      'Changes settings for `monitorChannel`.',
      '',
      '',
      'BUGS? Create an issue on the GitHub repository:',
      '<https://github.com/perilstar/fcfs-bot>',
      '',
      '`v' + this.client.version + ' by perilstar with help from StKWarrior`'
    ]

    let dmChannel = message.author.dmChannel;

    if (!dmChannel) {
      dmChannel = await message.author.createDM();
    }

    if (message.channel instanceof TextChannel) {
      sendmessage(message.channel, 'Sending you a DM with the help message!');
    }
    return sendmessage(dmChannel, lines.join('\n'));
  }
}

module.exports = HelpCommand;