const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const os = require('os');
const moment = require('moment');

const startTime = Date.now();

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
  console.log('📱 Scan the QR code to connect.');
});

client.on('ready', () => {
  console.log('✅ Bot is ready!');
});

client.on('message', async msg => {
  const message = msg.body.trim();
  const [cmd, ...args] = message.split(' ');
  const lowerCmd = cmd.toLowerCase();
  const sender = msg.from;

  console.log(`📨 ${msg.body} from ${sender}`);

  // === GENERAL COMMANDS ===
  if (lowerCmd === 'hello') return msg.reply('Hello! This is a message from EliteBot: Navdeep is currently unavailable. He will get back to you as soon as possible. Thank you for your patience!');
  if (lowerCmd === '!ping') return msg.reply('🏓 Pong!');
  if (lowerCmd === '!uptime') {
    const uptime = moment.duration(Date.now() - startTime).humanize();
    return msg.reply(`⏱ Uptime: ${uptime}`);
  }
  if (lowerCmd === '!time') {
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    return msg.reply(`🕒 Server Time: ${now}`);
  }
  if (lowerCmd === '!id') return msg.reply(`🧾 Your ID: ${msg.author || msg.from}`);
  if (lowerCmd === '!echo') {
    if (args.length === 0) return msg.reply('Usage: !echo [your message]');
    return msg.reply(args.join(' '));
  }

  // === INFO ===
  if (lowerCmd === '!dev') {
    return msg.reply(`👨‍💻 Developer: Navdeep`);
  }

  if (lowerCmd === '!help') {
    return msg.reply(
      `📖 *COMMANDS MENU*\n\n` +
      `🛠 *General*\n!ping, !uptime, !time, !id, !echo\n\n` +
      `👥 *Group (in group only)*\n!groupinfo, !members, !admins, !adminonly\n\n` +
      `🧑‍💻 *Info*\nDEV-NAVDEEP`
    );
  }

  // === GROUP COMMANDS ===
  if (sender.endsWith('@g.us')) {
    const chat = await msg.getChat();

    if (lowerCmd === '!groupinfo') {
      return msg.reply(`📌 Group: ${chat.name}\n👥 Members: ${chat.participants.length}`);
    }

    if (lowerCmd === '!members') {
      const members = chat.participants.map(p => p.id.user).join(', ');
      return msg.reply(`👥 Members:\n${members}`);
    }

    if (lowerCmd === '!admins') {
      const admins = chat.participants
        .filter(p => p.isAdmin || p.isSuperAdmin)
        .map(p => p.id.user)
        .join(', ');
      return msg.reply(`🛡 Admins:\n${admins}`);
    }

    if (lowerCmd === '!adminonly') {
      const senderId = msg.author || msg.from;
      const isAdmin = chat.participants.find(
        p => p.id._serialized === senderId && (p.isAdmin || p.isSuperAdmin)
      );
      return isAdmin
        ? msg.reply('✅ You are an admin!')
        : msg.reply('❌ This command is for admins only.');
    }
  }
});

client.initialize();
