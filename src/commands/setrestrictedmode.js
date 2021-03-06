const { Command } = require('discord-akairo');
const parseDuration = require('parse-duration');
const mps = require('../util/missingpermissionsupplier');
const sendmessage = require('../util/sendmessage');

class SetRestrictedModeCommand extends Command {
  constructor() {
    super('setrestrictedmode', {
      aliases: ['setrestrictedmode', 'set-restrictedmode', 'set-restricted-mode', 'srm'],
      split: 'quoted',
      channel: 'guild',
      userPermissions: (message) => mps(this.client, message),
      args: [
        {
          id: 'monitorChannel',
          type: 'voiceChannel'
        },
        {
          id: 'restrictedMode',
          type: 'string'
        }
      ]
    });
  }

  async exec(message, args) {
    if (!args.monitorChannel) {
      return sendmessage(message.channel, `Error: Missing or incorrect argument: \`monitorChannel\`. Use fcfs!help for commands.`);
    }
    if (!args.restrictedMode) {
      return sendmessage(message.channel, `Error: Missing or incorrect argument: \`restrictedMode\`. Use fcfs!help for commands.`);
    }

    let restrictedMode = args.restrictedMode.toLowerCase();

    if (!(restrictedMode === 'on' || restrictedMode === 'off')) {
      return sendmessage(message.channel, 'Error: `restrictedMode` must be either `on` or `off`');
    }

    let ds = this.client.datasource;
    let server = ds.servers[message.guild.id];

    if (!server.channelMonitors[args.monitorChannel.id]) {
      return sendmessage(message.channel, `Error: couldn't find a channel called ${args.monitorChannel} that's being monitored!`);
    }

    let channelMonitor = server.channelMonitors[args.monitorChannel.id]

    if (!channelMonitor.initialised) {
      await channelMonitor.init();
    }

    channelMonitor.restrictedMode = restrictedMode;
    ds.saveMonitor(channelMonitor.id);

    return sendmessage(message.channel, `Successfully changed restricted mode for ${channelMonitor.name} to ${restrictedMode}!`);
  }
}

module.exports = SetRestrictedModeCommand;