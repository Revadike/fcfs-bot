const { Command } = require('discord-akairo');
const parseDuration = require('parse-duration');
const mps = require('../util/missingpermissionsupplier');
const sendmessage = require('../util/sendmessage');

class CreateWaitingRoomCommand extends Command {
  constructor() {
    super('createwaitingroom', {
      aliases: ['createwaitingroom', 'cwr'],
      split: 'quoted',
      channel: 'guild',
      userPermissions: (message) => mps(this.client, message),
      args: [
        {
          id: 'monitorChannel',
          type: 'voiceChannel',
        },
        {
          id: 'firstN',
          type: 'integer'
        },
        {
          id: 'rejoinWindow',
          type: 'string'
        },
        {
          id: 'afkCheckDuration',
          type: 'string'
        }
      ]
    });
  }

  async exec(message, args) {
    let ds = this.client.datasource;
    let server = ds.servers[message.guild.id];

    if (!args.monitorChannel) {
      return sendmessage(message.channel, `Error: Missing or incorrect argument: \`monitorChannel\`. Use fcfs!help for commands.`);
    }
    if (!args.firstN) {
      return sendmessage(message.channel, `Error: Missing or incorrect argument: \`firstN\`. Use fcfs!help for commands.`);
    }
    if (!args.rejoinWindow) {
      return sendmessage(message.channel, `Error: Missing or incorrect argument: \`rejoinWindow\`. Use fcfs!help for commands.`);
    }
    if (!args.afkCheckDuration) {
      return sendmessage(message.channel, `Error: Missing or incorrect argument: \`afkCheckDuration\`. Use fcfs!help for commands.`);
    }

    if (server.channelMonitors[args.monitorChannel.id]) {
      return sendmessage(message.channel, `Error: channel ${args.monitorChannel} is already being monitored!`);
    }

    let rejoinWindow = parseDuration(args.rejoinWindow);
    let afkCheckDuration = parseDuration(args.afkCheckDuration);

    if (args.firstN < 1 || args.firstN > 25) {
      return sendmessage(message.channel, 'Error: `firstN` must be between 1 and 25');
    }

    if (rejoinWindow < 0 || rejoinWindow > 600000) {
      return sendmessage(message.channel, 'Error: `rejoinWindow` must be between 0 sec and 10 min');
    }

    if (afkCheckDuration < 15000 || rejoinWindow > 900000) {
      return sendmessage(message.channel, 'Error: `afkCheckDuration` must be between 15 sec and 15 min');
    }

    let displayChannel = message.channel;

    let displayMessage = await message.channel.send('<Pending Update>').catch(() => {});

    let data = {
      guildID: message.guild.id,
      id: args.monitorChannel.id,
      displayChannel: displayChannel.id,
      displayMessage: displayMessage.id,
      firstN: args.firstN,
      rejoinWindow: rejoinWindow,
      afkCheckDuration: afkCheckDuration,
      restrictedMode: true,
      modRoles: [],
      snowflakeQueue: []
    }

    message.delete();

    let channelMonitor = server.addChannelMonitor(data);
    await channelMonitor.init();
    
    this.client.datasource.saveMonitor(args.monitorChannel.id);
  }
}

module.exports = CreateWaitingRoomCommand;