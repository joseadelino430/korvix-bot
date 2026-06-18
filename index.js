require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ChannelType,
  SlashCommandBuilder,
  REST,
  Routes,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
}= require('discord.js');

const fs = require('fs');
const apostas = {};


// ================= CONFIG =================

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1500554431979061359';
const GUILD_ID = '1500314113929121882';

const STAFF_ROLE_ID = '1500957130017210398';
const CATEGORIA_APOSTAS = '1508826084572008598';
const EMOJI_GELO = '<:gelo:1511451244663800110>';
const BANNER_PIX = 'https://cdn.discordapp.com/attachments/1510723487168204910/1516439325641015316/CB4BBB66-5896-459E-AA6F-413B79511A8A.png?ex=6a32a5ad&is=6a31542d&hm=4f5dad83ef51ba3012bb8c75954916ba312b971247928077b97c4b0d743c31ce&';

const BANNER =
'https://cdn.discordapp.com/attachments/1510723487168204910/1516439325242425359/798185B4-EAF5-45C9-9440-9A113AE3929F.png?ex=6a32a5ad&is=6a31542d&hm=b9d5b0d32dfc1a15521c56bba024126731914f5e590ae92dcdefb0e93671698a&';

// ================= CLIENT =================

const client = new Client({
  intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
  ]
});

// ================= DATABASE =================

  let db = {
  saldo: {},
  wins: {},
  loses: {},
  streak: {},
  pix: {},
  filas: {},
  confirmacoes: {},
  apostas: {}
};

if (fs.existsSync('database.json')) {
  db = JSON.parse(
    fs.readFileSync('database.json')
  );
}

function saveDB() {
  fs.writeFileSync(
    'database.json',
    JSON.stringify(db, null, 2)
  );
}

function getSaldo(id) {
  if (!db.saldo[id]) {
    db.saldo[id] = 0;
  }

  return db.saldo[id];
}

function addSaldo(id, valor) {

  if (!db.saldo[id]) {
    db.saldo[id] = 0;
  }

  db.saldo[id] += valor;

  saveDB();
}

function removeSaldo(id, valor) {

  if (!db.saldo[id]) {
    db.saldo[id] = 0;
  }

  db.saldo[id] -= valor;

  saveDB();
}

function addWin(id) {

  if (!db.wins[id]) {
    db.wins[id] = 0;
  }

  if (!db.streak[id]) {
    db.streak[id] = 0;
  }

  db.wins[id] += 1;
  db.streak[id] += 1;

  saveDB();
}

function addLose(id) {

  if (!db.loses[id]) {
    db.loses[id] = 0;
  }

  db.loses[id] += 1;

  db.streak[id] = 0;

  saveDB();
}

// ================= SLASH COMMANDS =================

const commands = [

  // ================= PING =================

  new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Ver ping do bot'),

  // ================= SALDO =================

  new SlashCommandBuilder()
  .setName('saldo')
  .setDescription('Ver seu saldo'),

  // ================= ADD SALDO =================

  new SlashCommandBuilder()
  .setName('addsaldo')
  .setDescription('Adicionar saldo')
  .addUserOption(o =>
    o.setName('usuario')
    .setDescription('Usuário')
    .setRequired(true)
  )
  .addNumberOption(o =>
    o.setName('valor')
    .setDescription('Valor')
    .setRequired(true)
  ),

  // ================= SALA =================

  new SlashCommandBuilder()
  .setName('sala')
  .setDescription('Enviar sala FF')
  .addStringOption(o =>
    o.setName('id')
    .setDescription('ID da sala')
    .setRequired(true)
  )
  .addStringOption(o =>
    o.setName('senha')
    .setDescription('Senha da sala')
    .setRequired(true)
  ),

  // ================= FECHAR =================

  new SlashCommandBuilder()
  .setName('fechar')
  .setDescription('Fechar ticket'),

  // ================= PAINEL =================

  new SlashCommandBuilder()
  .setName('painel')
  .setDescription('Enviar painel'),

  // ================= PIX =================

  new SlashCommandBuilder()
  .setName('pix')
  .setDescription('Enviar chave pix')
  .addStringOption(o =>
    o.setName('chave')
    .setDescription('Sua chave pix')
    .setRequired(true)
  ),

  // ================= EMBED =================

  new SlashCommandBuilder()
  .setName('embed')
  .setDescription('Enviar embed personalizada')
  .addStringOption(o =>
    o.setName('titulo')
    .setDescription('Título')
    .setRequired(true)
  )
  .addStringOption(o =>
    o.setName('descricao')
    .setDescription('Descrição')
    .setRequired(true)
  ),

  // ================= APAGAR =================

  new SlashCommandBuilder()
  .setName('apagar')
  .setDescription('Apagar mensagens')
  .addIntegerOption(o =>
    o.setName('quantidade')
    .setDescription('Quantidade de mensagens')
    .setRequired(true)
  ),

  // ================= GANHOU =================

  new SlashCommandBuilder()
  .setName('ganhou')
  .setDescription('Adicionar vitória')
  .addUserOption(o =>
    o.setName('usuario')
    .setDescription('Usuário')
    .setRequired(true)
  )
  .addNumberOption(o =>
    o.setName('valor')
    .setDescription('Valor ganho')
    .setRequired(true)
  ),

  // ================= DERROTA =================

  new SlashCommandBuilder()
  .setName('derrota')
  .setDescription('Adicionar derrota')
  .addUserOption(o =>
    o.setName('usuario')
    .setDescription('Usuário')
    .setRequired(true)
  ),

  // ================= VALORES Misto ================

new SlashCommandBuilder()
  .setName('valoresmisto2')
  .setDescription('Enviar painel Misto 2v2 apostas'),

new SlashCommandBuilder()
  .setName('valoresmisto3')
  .setDescription('Enviar painel Misto 3v3 apostas'),

new SlashCommandBuilder()
  .setName('valoresmisto4')
  .setDescription('Enviar painel Misto 4v4 apostas'),

  // ================= VALORES EMU ================

new SlashCommandBuilder()
  .setName('valoresemu')
  .setDescription('Enviar painel de apostas'),

new SlashCommandBuilder()
  .setName('valoresemu2v2')
  .setDescription('Enviar painel de apostas 2v2'),

new SlashCommandBuilder()
  .setName('valoresemu3v3')
  .setDescription('Enviar painel de apostas 3v3'),

new SlashCommandBuilder()
  .setName('valoresemu4v4')
  .setDescription('Enviar painel de apostas 4v4'),

  // ================= VALORES MOB ================

new SlashCommandBuilder()
  .setName('valores')
  .setDescription('Enviar painel de apostas'),

new SlashCommandBuilder()
  .setName('valores2v2')
  .setDescription('Enviar painéis 2v2'),
new SlashCommandBuilder()
  .setName('valores3v3')
  .setDescription('Enviar painéis 3v3'),
new SlashCommandBuilder()
  .setName('valores4v4')
  .setDescription('Enviar painéis 4v4'),

  // ================= TELA =================

  new SlashCommandBuilder()
  .setName('tela')
  .setDescription('Enviar painel de análises'),

  // ================= BANCO =================

  new SlashCommandBuilder()
  .setName('banco')
  .setDescription('Abrir banco'),

  // ================= PAINEL PIX =================

  new SlashCommandBuilder()
  .setName('painelpix')
  .setDescription('Enviar painel PIX')

].map(c => c.toJSON());

// ================= REGISTRAR =================

const rest = new REST({
  version: '10'
}).setToken(TOKEN);

(async (i) => {

  try {

    console.log('🔄 Registrando slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        CLIENT_ID,
        GUILD_ID
      ),
      { body: commands }
    );

    console.log('✅ Slash commands registradas.');

  } catch (err) {

    console.log(err);

  }

})();

// ================= READY =================

client.once('clientReady', () => {

  console.log(
    `✅ ${client.user.tag} online!`
  );

});

// ================= INTERAÇÕES =================

client.on('interactionCreate', async (i) => {

  console.log("BOTAO:", i.customId);

  // ================= BOTÕES =================

  if (i.isButton()) {

  // ================= VERIFICAR ADMIN =================//

    if (i.customId === 'verificar_admin') {

  const canal = await i.guild.channels.create({

    name: `suporte-${i.user.username}`,

    type: ChannelType.GuildText,

    permissionOverwrites: [

      {
        id: i.guild.roles.everyone,
        deny: [
          PermissionFlagsBits.ViewChannel
        ]
      },

      {
        id: i.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel
        ]
      },

      {
        id: STAFF_ROLE_ID,
        allow: [
          PermissionFlagsBits.ViewChannel
        ]
      }

    ]

  });

  await canal.send({

    embeds: [

      new EmbedBuilder()
      .setColor('#e74c3c')
      .setTitle('👨‍💼 Atendimento Administrativo')
      .setDescription(`
Olá ${i.user},

Explique sua dúvida e aguarde um administrador responder.
`)
      .setImage(BANNER)

    ]

  });

  return i.reply({

    content: `✅ Canal criado: ${canal}`,

    ephemeral: true

  });

}
  // ================= VERIFICAR PX =================// 
    
   if (i.customId === 'verificar_pix') {

  const pix = db.pix?.[i.user.id];

  if (!pix) {
    return i.reply({
      content: '❌ Você não possui PIX cadastrado.',
      ephemeral: true
    });
  }

  return i.reply({
    embeds: [
      new EmbedBuilder()
      .setColor('#9e0000')
      .setTitle('📋 Seu Cadastro PIX')
      .setDescription(`
👤 Nome:
${pix.nome}

💳 Tipo:
${pix.tipo}

🔑 Chave:
\`${pix.chave}\`
`)
    ],
    ephemeral: true
  });

}

  // ================= SALVAR PIX =================//
    
    if (i.customId === 'cadastrar_pix') {

  const modal = new ModalBuilder()
    .setCustomId('modal_pix')
    .setTitle('Cadastrar PIX');

  const nome = new TextInputBuilder()
    .setCustomId('nome')
    .setLabel('Nome')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const chave = new TextInputBuilder()
    .setCustomId('chave')
    .setLabel('Chave PIX')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const tipo = new TextInputBuilder()
    .setCustomId('tipo')
    .setLabel('CPF / EMAIL / TELEFONE')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder().addComponents(nome),
    new ActionRowBuilder().addComponents(chave),
    new ActionRowBuilder().addComponents(tipo)
  );

  return i.showModal(modal);
}

// ================= FILAS 4v4 ============

  if (
  i.customId.startsWith('gelo4_inf_') ||
  i.customId.startsWith('gelo4_normal_')
  ) {

  const valor = Number(
    i.customId
      .replace('gelo4_inf_', '')
      .replace('gelo4_normal_', '')
     );

  const modo = i.customId.startsWith('gelo4_inf_')
    ? '<:gelo:1511451244663800110> Gelo Infinito'
    : '<:gelo:1511451244663800110> Gelo Normal';

  const chaveFila =
`${valor}_${i.customId.startsWith('gelo4_inf_') ? '4v4_inf' : '4v4_normal'}`;

  if (!db.filas) db.filas = {};

  if (!db.filas[chaveFila]) {
    db.filas[chaveFila] = [];
  }

  const jaExiste = db.filas[chaveFila].find(
  j => j.id === i.user.id
);

if (jaExiste) {
  return i.reply({
    content: '❌ Você já está nesta fila.',
    ephemeral: true
  });
}

// remove o jogador de TODAS as filas antes

for (const fila in db.filas) {

  db.filas[fila] = db.filas[fila].filter(
    jogador => jogador.id !== i.user.id
  );

}

db.filas[chaveFila].push({
  id: i.user.id,
  modo
});

saveDB();

console.log(
  'CHAVE:',
  chaveFila
);

console.log(
  JSON.stringify(db.filas, null, 2)
);

saveDB();

  const filaInf = db.filas[`${valor}_4v4_inf`] || [];
const filaNormal = db.filas[`${valor}_4v4_normal`] || [];

const jogadores = [...filaInf, ...filaNormal]
  .map(j => `👤 <@${j.id}>\n${j.modo}`)
  .join('\n\n') || 'Nenhum jogador na fila.';

  const embed = new EmbedBuilder()
  .setColor('#9e0000')
  .setTitle('📱 Filas 4v4 Mobile')
  .setDescription(`
🎮 Modo
4v4 Mobile

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

${jogadores}
`)
  .setImage(BANNER);

  await i.update({
    embeds: [embed],
    components: i.message.components
  });

  if (db.filas[chaveFila].length >= 2) {

    const jogador1 = db.filas[chaveFila][0]?.id;
    const jogador2 = db.filas[chaveFila][1]?.id;

    if (!jogador1 || !jogador2) return;

    db.filas[chaveFila] = [];

    saveDB();

    const embedReset = new EmbedBuilder()
.setColor('#9e0000')
.setTitle('📱 Filas 4v4 Mobile')
.setDescription(`
🎮 Modo
4v4 Mobile

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

Nenhum jogador na fila.
`)
.setImage(BANNER);

        await i.message.edit({
  embeds: [embedReset],
  components: i.message.components
});

    const canal = await i.guild.channels.create({

      name: `👥・4v4-${valor}`,

      parent: '1508826084572008598',

      type: ChannelType.GuildText,

      permissionOverwrites: [

        {
          id: i.guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador1,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador2,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: '1500957130017210398',
          type: 0,
          allow: [PermissionFlagsBits.ViewChannel]
      }

      ]

    });

    if (!db.apostas) db.apostas = {};

    db.apostas[canal.id] = {
      valor
    };

    saveDB();

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('confirmar_aposta')
          .setLabel('✅ Confirmar')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('cancelar_aposta')
          .setLabel('❌ Cancelar')
          .setStyle(ButtonStyle.Danger)

      );

    await canal.send({

      content: `<@${jogador1}> <@${jogador2}>`,

      embeds: [

        new EmbedBuilder()
          .setColor('#9e0000')
          .setTitle('🎮 NOVA APOSTA')
          .setDescription(`
👤 Jogador 1
<@${jogador1}>

👤 Jogador 2
<@${jogador2}>

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Taxa
R$0,10

⏳ Ambos devem confirmar a aposta.
`)
          .setImage(BANNER)

      ],

      components: [row]

    });

  }

  return;
}

// ================= FILAS 3v3 ============

  if (
  i.customId.startsWith('gelo3_inf_') ||
  i.customId.startsWith('gelo3_normal_')
  ) {

  const valor = Number(
    i.customId
      .replace('gelo3_inf_', '')
      .replace('gelo3_normal_', '')
     );

  const modo = i.customId.startsWith('gelo3_inf_')
    ? '<:gelo:1511451244663800110> Gelo Infinito'
    : '<:gelo:1511451244663800110> Gelo Normal';

  const chaveFila =
`${valor}_${i.customId.startsWith('gelo3_inf_') ? '3v3_inf' : '3v3_normal'}`;

  if (!db.filas) db.filas = {};

  if (!db.filas[chaveFila]) {
    db.filas[chaveFila] = [];
  }

// remove o jogador de TODAS as filas antes

for (const fila in db.filas) {
  db.filas[fila] = db.filas[fila].filter(
    jogador => jogador.id !== i.user.id
  );
}

saveDB();

db.filas[chaveFila].push({
  id: i.user.id,
  modo
});

console.log(
  'CHAVE:',
  chaveFila
);

console.log(
  JSON.stringify(db.filas, null, 2)
);

saveDB();

  const filaInf = db.filas[`${valor}_3v3_inf`] || [];
const filaNormal = db.filas[`${valor}_3v3_normal`] || [];

const jogadores = [...filaInf, ...filaNormal]
  .map(j => `👤 <@${j.id}>\n${j.modo}`)
  .join('\n\n') || 'Nenhum jogador na fila.';

  const embed = new EmbedBuilder()
  .setColor('#9e0000')
  .setTitle('📱 Filas 3v3 Mobile')
  .setDescription(`
🎮 Modo
3v3 Mobile

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

${jogadores}
`)
  .setImage(BANNER);

  await i.update({
    embeds: [embed],
    components: i.message.components
  });

  if (db.filas[chaveFila].length >= 2) {

    const jogador1 = db.filas[chaveFila][0]?.id;
    const jogador2 = db.filas[chaveFila][1]?.id;

    if (!jogador1 || !jogador2) return;

    db.filas[chaveFila] = [];

    saveDB();

    const embedReset = new EmbedBuilder()
.setColor('#9e0000')
.setTitle('📱 Filas 3v3 Mobile')
.setDescription(`
🎮 Modo
3v3 Mobile

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

Nenhum jogador na fila.
`)
.setImage(BANNER);

        await i.message.edit({
  embeds: [embedReset],
  components: i.message.components
});

    const canal = await i.guild.channels.create({

      name: `👥・3v3-${valor}`,

      parent: '1508826084572008598',

      type: ChannelType.GuildText,

      permissionOverwrites: [

        {
          id: i.guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador1,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador2,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: '1500957130017210398',
          type: 0,
          allow: [PermissionFlagsBits.ViewChannel]
      }

      ]

    });

    if (!db.apostas) db.apostas = {};

    db.apostas[canal.id] = {
      valor
    };

    saveDB();

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('confirmar_aposta')
          .setLabel('✅ Confirmar')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('cancelar_aposta')
          .setLabel('❌ Cancelar')
          .setStyle(ButtonStyle.Danger)

      );

    await canal.send({

      content: `<@${jogador1}> <@${jogador2}>`,

      embeds: [

        new EmbedBuilder()
          .setColor('#9e0000')
          .setTitle('🎮 NOVA APOSTA')
          .setDescription(`
👤 Jogador 1
<@${jogador1}>

👤 Jogador 2
<@${jogador2}>

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Taxa
R$0,10

⏳ Ambos devem confirmar a aposta.
`)
          .setImage(BANNER)

      ],

      components: [row]

    });

  }

  return;
}

// ================= FILAS 2v2 ============

  if (
  i.customId.startsWith('gelo2_inf_') ||
  i.customId.startsWith('gelo2_normal_')
  ) {

  const valor = Number(
    i.customId
      .replace('gelo2_inf_', '')
      .replace('gelo2_normal_', '')
     );

  const modo = i.customId.startsWith('gelo2_inf_')
    ? '<:gelo:1511451244663800110> Gelo Infinito'
    : '<:gelo:1511451244663800110> Gelo Normal';

  const chaveFila =
`${valor}_${i.customId.startsWith('gelo2_inf_') ? '2v2_inf' : '2v2_normal'}`;

  if (!db.filas) db.filas = {};

  if (!db.filas[chaveFila]) {
    db.filas[chaveFila] = [];
  }

// remove o jogador de TODAS as filas antes

for (const fila in db.filas) {
  db.filas[fila] = db.filas[fila].filter(
    jogador => jogador.id !== i.user.id
  );
}

saveDB();

db.filas[chaveFila].push({
  id: i.user.id,
  modo
});

console.log(
  'CHAVE:',
  chaveFila
);

console.log(
  JSON.stringify(db.filas, null, 2)
);

saveDB();

  const filaInf = db.filas[`${valor}_2v2_inf`] || [];
const filaNormal = db.filas[`${valor}_2v2_normal`] || [];

const jogadores = [...filaInf, ...filaNormal]
  .map(j => `👤 <@${j.id}>\n${j.modo}`)
  .join('\n\n') || 'Nenhum jogador na fila.';

  const embed = new EmbedBuilder()
  .setColor('#9e0000')
  .setTitle('📱 Filas 2v2 Mobile')
  .setDescription(`
🎮 Modo
2v2 Mobile

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

${jogadores}
`)
  .setImage(BANNER);

  await i.update({
    embeds: [embed],
    components: i.message.components
  });

  if (db.filas[chaveFila].length >= 2) {

    const jogador1 = db.filas[chaveFila][0]?.id;
    const jogador2 = db.filas[chaveFila][1]?.id;

    if (!jogador1 || !jogador2) return;

    db.filas[chaveFila] = [];

    saveDB();

    const embedReset = new EmbedBuilder()
.setColor('#9e0000')
.setTitle('📱 Filas 2v2 Mobile')
.setDescription(`
🎮 Modo
2v2 Mobile

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

Nenhum jogador na fila.
`)
.setImage(BANNER);

        await i.message.edit({
  embeds: [embedReset],
  components: i.message.components
});

    const canal = await i.guild.channels.create({

      name: `👥・2v2-${valor}`,

      parent: '1508826084572008598',

      type: ChannelType.GuildText,

      permissionOverwrites: [

        {
          id: i.guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador1,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador2,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: '1500957130017210398',
          type: 0,
          allow: [PermissionFlagsBits.ViewChannel]
      }

      ]

    });

    if (!db.apostas) db.apostas = {};

    db.apostas[canal.id] = {
      valor
    };

    saveDB();

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('confirmar_aposta')
          .setLabel('✅ Confirmar')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('cancelar_aposta')
          .setLabel('❌ Cancelar')
          .setStyle(ButtonStyle.Danger)

      );

    await canal.send({

      content: `<@${jogador1}> <@${jogador2}>`,

      embeds: [

        new EmbedBuilder()
          .setColor('#9e0000')
          .setTitle('🎮 NOVA APOSTA')
          .setDescription(`
👤 Jogador 1
<@${jogador1}>

👤 Jogador 2
<@${jogador2}>

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Taxa
R$0,10

⏳ Ambos devem confirmar a aposta.
`)
          .setImage(BANNER)

      ],

      components: [row]

    });

  }

  return;
}

// ================= FILAS =================

if (
  i.customId.startsWith('gelo_inf_') ||
  i.customId.startsWith('gelo_normal_')
) {

  const valor = Number(
    i.customId
      .replace('gelo_inf_', '')
      .replace('gelo_normal_', '')
  );

  const modo = i.customId.startsWith('gelo_inf_')
    ? '<:gelo:1511451244663800110> Gelo Infinito'
    : '<:gelo:1511451244663800110> Gelo Normal';

  const chaveFila =
    `${valor}_${i.customId.startsWith('gelo_inf_') ? 'inf' : 'normal'}`;

  if (!db.filas) db.filas = {};

  if (!db.filas[chaveFila]) {
    db.filas[chaveFila] = [];
  }

  const jaExiste = db.filas[chaveFila].find(
  j => j.id === i.user.id
);

if (jaExiste) {
  return i.reply({
    content: '❌ Você já está nesta fila.',
    ephemeral: true
  });
}

// remove o jogador de TODAS as filas antes

for (const fila in db.filas) {

  db.filas[fila] = db.filas[fila].filter(
    jogador => jogador.id !== i.user.id
  );

}

db.filas[chaveFila].push({
  id: i.user.id,
  modo
});

console.log(
  'CHAVE:',
  chaveFila
);

console.log(
  JSON.stringify(db.filas, null, 2)
);

saveDB();

  const filaInf = db.filas[`${valor}_inf`] || [];
const filaNormal = db.filas[`${valor}_normal`] || [];

const jogadores = [...filaInf, ...filaNormal]
  .map(j => `👤 <@${j.id}>\n${j.modo}`)
  .join('\n\n') || 'Nenhum jogador na fila.';

  const embed = new EmbedBuilder()
  .setColor('#9e0000')
  .setTitle('📱 Filas Mobiles')
  .setDescription(`
🎮 Modo
1v1 Mobile

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

${jogadores}
`)
  .setImage(BANNER);

  await i.update({
    embeds: [embed],
    components: i.message.components
  });

  if (db.filas[chaveFila].length >= 2) {

    const jogador1 = db.filas[chaveFila][0]?.id;
    const jogador2 = db.filas[chaveFila][1]?.id;

    if (!jogador1 || !jogador2) return;

    db.filas[chaveFila] = [];

    saveDB();

    const embedReset = new EmbedBuilder()
.setColor('#9e0000')
.setTitle('📱 Filas Mobiles')
.setDescription(`
🎮 Modo
1v1 Mobile

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

Nenhum jogador na fila.
`)
.setImage(BANNER);

        await i.message.edit({
  embeds: [embedReset],
  components: i.message.components
});

    const canal = await i.guild.channels.create({

      name: `🎮・${valor}-${i.customId.startsWith('gelo_inf_') ? 'inf' : 'normal'}`,

      parent: '1508826084572008598',

      type: ChannelType.GuildText,

      permissionOverwrites: [

        {
          id: i.guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador1,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador2,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: '1500957130017210398',
          type: 0,
          allow: [PermissionFlagsBits.ViewChannel]
      }

      ]

    });

    if (!db.apostas) db.apostas = {};

    db.apostas[canal.id] = {
      valor
    };

    saveDB();

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('confirmar_aposta')
          .setLabel('✅ Confirmar')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('cancelar_aposta')
          .setLabel('❌ Cancelar')
          .setStyle(ButtonStyle.Danger)

      );

    await canal.send({

      content: `<@${jogador1}> <@${jogador2}>`,

      embeds: [

        new EmbedBuilder()
          .setColor('#9e0000')
          .setTitle('🎮 NOVA APOSTA')
          .setDescription(`
👤 Jogador 1
<@${jogador1}>

👤 Jogador 2
<@${jogador2}>

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Taxa
R$0,10

⏳ Ambos devem confirmar a aposta.
`)
          .setImage(BANNER)

      ],

      components: [row]

    });

  }

  return;

}

// ================= FILAS emu =================

if (
  i.customId.startsWith('emu_inf_') ||
  i.customId.startsWith('emu_normal_')
) {

  const valor = Number(
    i.customId
      .replace('emu_inf_', '')
      .replace('emu_normal_', '')
  );

  const modo = i.customId.startsWith('emu_inf_')
    ? '<:gelo:1511451244663800110> Gelo Infinito'
    : '<:gelo:1511451244663800110> Gelo Normal';

  const chaveFila =
    `${valor}_${i.customId.startsWith('emu_inf_') ? 'emu_inf' : 'emu_normal'}`;

  if (!db.filas) db.filas = {};

  if (!db.filas[chaveFila]) {
    db.filas[chaveFila] = [];
  }

  const jaExiste = db.filas[chaveFila].find(
  j => j.id === i.user.id
);

if (jaExiste) {
  return i.reply({
    content: '❌ Você já está nesta fila.',
    ephemeral: true
  });
}

// remove o jogador de TODAS as filas antes

for (const fila in db.filas) {

  db.filas[fila] = db.filas[fila].filter(
    jogador => jogador.id !== i.user.id
  );

}

db.filas[chaveFila].push({
  id: i.user.id,
  modo
});

console.log("SALVOU EM:", chaveFila);
console.log(db.filas[chaveFila]);

console.log(
  'CHAVE:',
  chaveFila
);

console.log(
  JSON.stringify(db.filas, null, 2)
);

saveDB();

  const filaInf = db.filas[`${valor}_emu_inf`] || [];
const filaNormal = db.filas[`${valor}_emu_normal`] || [];

const jogadores = [...filaInf, ...filaNormal]
  .map(j => `👤 <@${j.id}>\n${j.modo}`)
  .join('\n\n') || 'Nenhum jogador na fila.';

  const embed = new EmbedBuilder()
  .setColor('#9e0000')
  .setTitle('🖥️ Filas Emuladores')
  .setDescription(`
🎮 Modo
1v1 Emulador

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

${jogadores}
`)
  .setImage(BANNER);

  await i.update({
    embeds: [embed],
    components: i.message.components
  });

  if (db.filas[chaveFila].length >= 2) {

    const jogador1 = db.filas[chaveFila][0]?.id;
    const jogador2 = db.filas[chaveFila][1]?.id;

    if (!jogador1 || !jogador2) return;

    db.filas[chaveFila] = [];

    saveDB();

    const embedReset = new EmbedBuilder()
.setColor('#9e0000')
.setTitle('🖥️ Filas Emuladores')
.setDescription(`
🎮 Modo
1v1 Emulador

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

Nenhum jogador na fila.
`)
.setImage(BANNER);

        await i.message.edit({
  embeds: [embedReset],
  components: i.message.components
});

    const canal = await i.guild.channels.create({

  name: `🖥️・emu-${valor}-${i.customId.startsWith('emu_inf_') ? 'inf' : 'normal'}`,

  parent: '1508826084572008598',

  type: ChannelType.GuildText,

  permissionOverwrites: [

        {
          id: i.guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador1,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador2,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: '1500957130017210398',
          type: 0,
          allow: [PermissionFlagsBits.ViewChannel]
      }

      ]

    });

    if (!db.apostas) db.apostas = {};

    db.apostas[canal.id] = {
      valor
    };

    saveDB();

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('confirmar_aposta')
          .setLabel('✅ Confirmar')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('cancelar_aposta')
          .setLabel('❌ Cancelar')
          .setStyle(ButtonStyle.Danger)

      );

    await canal.send({

      content: `<@${jogador1}> <@${jogador2}>`,

      embeds: [

        new EmbedBuilder()
          .setColor('#9e0000')
          .setTitle('🖥️ NOVA APOSTA')
          .setDescription(`
👤 Jogador 1
<@${jogador1}>

👤 Jogador 2
<@${jogador2}>

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Taxa
R$0,10

⏳ Ambos devem confirmar a aposta.
`)
          .setImage(BANNER)

      ],

      components: [row]

    });

  }

  return;

}

// ================= FILAS emu 2v2 =================

if (
  i.customId.startsWith('emu2v2_inf_') ||
  i.customId.startsWith('emu2v2_normal_')
) {

  const valor = Number(
    i.customId
      .replace('emu2v2_inf_', '')
      .replace('emu2v2_normal_', '')
  );

  const modo = i.customId.startsWith('emu2v2_inf_')
    ? '<:gelo:1511451244663800110> Gelo Infinito'
    : '<:gelo:1511451244663800110> Gelo Normal';

  const chaveFila =
    `${valor}_${i.customId.startsWith('emu2v2_inf_') ? 'emu2v2_inf' : 'emu2v2_normal'}`;

  if (!db.filas) db.filas = {};

  if (!db.filas[chaveFila]) {
    db.filas[chaveFila] = [];
  }

  const jaExiste = db.filas[chaveFila].find(
  j => j.id === i.user.id
);

if (jaExiste) {
  return i.reply({
    content: '❌ Você já está nesta fila.',
    ephemeral: true
  });
}

// remove o jogador de TODAS as filas antes

for (const fila in db.filas) {

  db.filas[fila] = db.filas[fila].filter(
    jogador => jogador.id !== i.user.id
  );

}

db.filas[chaveFila].push({
  id: i.user.id,
  modo
});

console.log("SALVOU EM:", chaveFila);
console.log(db.filas[chaveFila]);

console.log(
  'CHAVE:',
  chaveFila
);

console.log(
  JSON.stringify(db.filas, null, 2)
);

saveDB();

  const filaInf = db.filas[`${valor}_emu2v2_inf`] || [];
const filaNormal = db.filas[`${valor}_emu2v2_normal`] || [];

const jogadores = [...filaInf, ...filaNormal]
  .map(j => `👤 <@${j.id}>\n${j.modo}`)
  .join('\n\n') || 'Nenhum jogador na fila.';

  const embed = new EmbedBuilder()
  .setColor('#9e0000')
  .setTitle('🖥️ Filas Emulador 2v2')
  .setDescription(`
🎮 Modo
2v2 Emulador

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

${jogadores}
`)
  .setImage(BANNER);

  await i.update({
    embeds: [embed],
    components: i.message.components
  });

  if (db.filas[chaveFila].length >= 2) {

    const jogador1 = db.filas[chaveFila][0]?.id;
    const jogador2 = db.filas[chaveFila][1]?.id;

    if (!jogador1 || !jogador2) return;

    db.filas[chaveFila] = [];

    saveDB();

    const embedReset = new EmbedBuilder()
.setColor('#9e0000')
.setTitle('🖥️ Filas Emulador 2v2')
.setDescription(`
🎮 Modo
2v2 Emulador

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

Nenhum jogador na fila.
`)
.setImage(BANNER);

        await i.message.edit({
  embeds: [embedReset],
  components: i.message.components
});

    const canal = await i.guild.channels.create({

  name: `🖥️・emu-${valor}-${i.customId.startsWith('emu2v2_inf_') ? 'inf' : 'normal'}`,

  parent: '1508826084572008598',

  type: ChannelType.GuildText,

  permissionOverwrites: [

        {
          id: i.guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador1,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador2,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: '1500957130017210398',
          type: 0,
          allow: [PermissionFlagsBits.ViewChannel]
      }

      ]

    });

    if (!db.apostas) db.apostas = {};

    db.apostas[canal.id] = {
      valor
    };

    saveDB();

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('confirmar_aposta')
          .setLabel('✅ Confirmar')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('cancelar_aposta')
          .setLabel('❌ Cancelar')
          .setStyle(ButtonStyle.Danger)

      );

    await canal.send({

      content: `<@${jogador1}> <@${jogador2}>`,

      embeds: [

        new EmbedBuilder()
          .setColor('#9e0000')
          .setTitle('🖥️ NOVA APOSTA 2v2')
          .setDescription(`
👤 Jogador 1
<@${jogador1}>

👤 Jogador 2
<@${jogador2}>

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Taxa
R$0,10

⏳ Ambos devem confirmar a aposta.
`)
          .setImage(BANNER)

      ],

      components: [row]

    });

  }

  return;

}

// ================= FILAS emu 3v3 =================

if (
  i.customId.startsWith('emu3v3_inf_') ||
  i.customId.startsWith('emu3v3_normal_')
) {

  const valor = Number(
    i.customId
      .replace('emu3v3_inf_', '')
      .replace('emu3v3_normal_', '')
  );

  const modo = i.customId.startsWith('emu3v3_inf_')
    ? '<:gelo:1511451244663800110> Gelo Infinito'
    : '<:gelo:1511451244663800110> Gelo Normal';

  const chaveFila =
    `${valor}_${i.customId.startsWith('emu3v3_inf_') ? 'emu3v3_inf' : 'emu3v3_normal'}`;

  if (!db.filas) db.filas = {};

  if (!db.filas[chaveFila]) {
    db.filas[chaveFila] = [];
  }

  const jaExiste = db.filas[chaveFila].find(
  j => j.id === i.user.id
);

if (jaExiste) {
  return i.reply({
    content: '❌ Você já está nesta fila.',
    ephemeral: true
  });
}

// remove o jogador de TODAS as filas antes

for (const fila in db.filas) {

  db.filas[fila] = db.filas[fila].filter(
    jogador => jogador.id !== i.user.id
  );

}

db.filas[chaveFila].push({
  id: i.user.id,
  modo
});

console.log("SALVOU EM:", chaveFila);
console.log(db.filas[chaveFila]);

console.log(
  'CHAVE:',
  chaveFila
);

console.log(
  JSON.stringify(db.filas, null, 2)
);

saveDB();

  const filaInf = db.filas[`${valor}_emu3v3_inf`] || [];
const filaNormal = db.filas[`${valor}_emu3v3_normal`] || [];

const jogadores = [...filaInf, ...filaNormal]
  .map(j => `👤 <@${j.id}>\n${j.modo}`)
  .join('\n\n') || 'Nenhum jogador na fila.';

  const embed = new EmbedBuilder()
  .setColor('#9e0000')
  .setTitle('🖥️ Filas Emulador 3v3')
  .setDescription(`
🎮 Modo
3v3 Emulador

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

${jogadores}
`)
  .setImage(BANNER);

  await i.update({
    embeds: [embed],
    components: i.message.components
  });

  if (db.filas[chaveFila].length >= 2) {

    const jogador1 = db.filas[chaveFila][0]?.id;
    const jogador2 = db.filas[chaveFila][1]?.id;

    if (!jogador1 || !jogador2) return;

    db.filas[chaveFila] = [];

    saveDB();

    const embedReset = new EmbedBuilder()
.setColor('#9e0000')
.setTitle('🖥️ Filas Emulador 3v3')
.setDescription(`
🎮 Modo
3v3 Emulador

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

Nenhum jogador na fila.
`)
.setImage(BANNER);

        await i.message.edit({
  embeds: [embedReset],
  components: i.message.components
});

    const canal = await i.guild.channels.create({

  name: `🖥️・emu-${valor}-${i.customId.startsWith('emu3v3_inf_') ? 'inf' : 'normal'}`,

  parent: '1508826084572008598',

  type: ChannelType.GuildText,

  permissionOverwrites: [

        {
          id: i.guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador1,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador2,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: '1500957130017210398',
          type: 0,
          allow: [PermissionFlagsBits.ViewChannel]
      }

      ]

    });

    if (!db.apostas) db.apostas = {};

    db.apostas[canal.id] = {
      valor
    };

    saveDB();

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('confirmar_aposta')
          .setLabel('✅ Confirmar')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('cancelar_aposta')
          .setLabel('❌ Cancelar')
          .setStyle(ButtonStyle.Danger)

      );

    await canal.send({

      content: `<@${jogador1}> <@${jogador2}>`,

      embeds: [

        new EmbedBuilder()
          .setColor('#9e0000')
          .setTitle('🖥️ NOVA APOSTA 3v3')
          .setDescription(`
👤 Jogador 1
<@${jogador1}>

👤 Jogador 2
<@${jogador2}>

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Taxa
R$0,10

⏳ Ambos devem confirmar a aposta.
`)
          .setImage(BANNER)

      ],

      components: [row]

    });

  }

  return;

}

// ================= FILAS emu 4v4 =================

if (
  i.customId.startsWith('emu4v4_inf_') ||
  i.customId.startsWith('emu4v4_normal_')
) {

  const valor = Number(
    i.customId
      .replace('emu4v4_inf_', '')
      .replace('emu4v4_normal_', '')
  );

  const modo = i.customId.startsWith('emu4v4_inf_')
    ? '<:gelo:1511451244663800110> Gelo Infinito'
    : '<:gelo:1511451244663800110> Gelo Normal';

  const chaveFila =
    `${valor}_${i.customId.startsWith('emu4v4_inf_') ? 'emu4v4_inf' : 'emu4v4_normal'}`;

  if (!db.filas) db.filas = {};

  if (!db.filas[chaveFila]) {
    db.filas[chaveFila] = [];
  }

  const jaExiste = db.filas[chaveFila].find(
  j => j.id === i.user.id
);

if (jaExiste) {
  return i.reply({
    content: '❌ Você já está nesta fila.',
    ephemeral: true
  });
}

// remove o jogador de TODAS as filas antes

for (const fila in db.filas) {

  db.filas[fila] = db.filas[fila].filter(
    jogador => jogador.id !== i.user.id
  );

}

db.filas[chaveFila].push({
  id: i.user.id,
  modo
});

console.log("SALVOU EM:", chaveFila);
console.log(db.filas[chaveFila]);

console.log(
  'CHAVE:',
  chaveFila
);

console.log(
  JSON.stringify(db.filas, null, 2)
);

saveDB();

  const filaInf = db.filas[`${valor}_emu4v4_inf`] || [];
const filaNormal = db.filas[`${valor}_emu4v4_normal`] || [];

const jogadores = [...filaInf, ...filaNormal]
  .map(j => `👤 <@${j.id}>\n${j.modo}`)
  .join('\n\n') || 'Nenhum jogador na fila.';

  const embed = new EmbedBuilder()
  .setColor('#9e0000')
  .setTitle('🖥️ Filas Emulador 4v4')
  .setDescription(`
🎮 Modo
4v4 Emulador

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

${jogadores}
`)
  .setImage(BANNER);

  await i.update({
    embeds: [embed],
    components: i.message.components
  });

  if (db.filas[chaveFila].length >= 2) {

    const jogador1 = db.filas[chaveFila][0]?.id;
    const jogador2 = db.filas[chaveFila][1]?.id;

    if (!jogador1 || !jogador2) return;

    db.filas[chaveFila] = [];

    saveDB();

    const embedReset = new EmbedBuilder()
.setColor('#9e0000')
.setTitle('🖥️ Filas Emulador 4v4')
.setDescription(`
🎮 Modo
4v4 Emulador

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

Nenhum jogador na fila.
`)
.setImage(BANNER);

        await i.message.edit({
  embeds: [embedReset],
  components: i.message.components
});

    const canal = await i.guild.channels.create({

  name: `🖥️・emu-${valor}-${i.customId.startsWith('emu4v4_inf_') ? 'inf' : 'normal'}`,

  parent: '1508826084572008598',

  type: ChannelType.GuildText,

  permissionOverwrites: [

        {
          id: i.guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador1,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador2,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: '1500957130017210398',
          type: 0,
          allow: [PermissionFlagsBits.ViewChannel]
      }

      ]

    });

    if (!db.apostas) db.apostas = {};

    db.apostas[canal.id] = {
      valor
    };

    saveDB();

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('confirmar_aposta')
          .setLabel('✅ Confirmar')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('cancelar_aposta')
          .setLabel('❌ Cancelar')
          .setStyle(ButtonStyle.Danger)

      );

    await canal.send({

      content: `<@${jogador1}> <@${jogador2}>`,

      embeds: [

        new EmbedBuilder()
          .setColor('#9e0000')
          .setTitle('🖥️ NOVA APOSTA 4v4')
          .setDescription(`
👤 Jogador 1
<@${jogador1}>

👤 Jogador 2
<@${jogador2}>

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Taxa
R$0,10

⏳ Ambos devem confirmar a aposta.
`)
          .setImage(BANNER)

      ],

      components: [row]

    });

  }

  return;

}

// ================= FILAS MISTO 4v4 =================

if (
  i.customId.startsWith('misto4_inf_') ||
  i.customId.startsWith('misto4_normal_')
) {

  console.log("MISTO CLICADO");
  console.log(i.customId);

  const valor = Number(
    i.customId
      .replace('misto4_inf_', '')
      .replace('misto4_normal_', '')
  );

  const modo = i.customId.startsWith('misto4_inf_')
    ? '<:gelo:1511451244663800110> Gelo Infinito'
    : '<:gelo:1511451244663800110> Gelo Normal';

  const chaveFila =
    `${valor}_${i.customId.startsWith('misto4_inf_') ? 'misto4_inf' : 'misto4_normal'}`;

  if (!db.filas) db.filas = {};

  if (!db.filas[chaveFila]) {
    db.filas[chaveFila] = [];
  }

  const jaExiste = db.filas[chaveFila].find(
  j => j.id === i.user.id
);

if (jaExiste) {
  return i.reply({
    content: '❌ Você já está nesta fila.',
    ephemeral: true
  });
}

// remove o jogador de TODAS as filas antes

for (const fila in db.filas) {

  db.filas[fila] = db.filas[fila].filter(
    jogador => jogador.id !== i.user.id
  );

}

db.filas[chaveFila].push({
  id: i.user.id,
  modo
});

console.log("SALVOU EM:", chaveFila);
console.log(db.filas[chaveFila]);

console.log(
  'CHAVE:',
  chaveFila
);

console.log(
  JSON.stringify(db.filas, null, 2)
);

saveDB();

  const filaInf = db.filas[`${valor}_misto4_inf`] || [];
const filaNormal = db.filas[`${valor}_misto4_normal`] || [];

const jogadores = [...filaInf, ...filaNormal]
  .map(j => `👤 <@${j.id}>\n${j.modo}`)
  .join('\n\n') || 'Nenhum jogador na fila.';

  const embed = new EmbedBuilder()
  .setColor('#9e0000')
  .setTitle('📱 | 🖥️ Filas Misto 4v4')
  .setDescription(`
🎮 Modo
4v4 Misto

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

${jogadores}
`)
  .setImage(BANNER);

  await i.update({
    embeds: [embed],
    components: i.message.components
  });

  if (db.filas[chaveFila].length >= 2) {

    const jogador1 = db.filas[chaveFila][0]?.id;
    const jogador2 = db.filas[chaveFila][1]?.id;

    if (!jogador1 || !jogador2) return;

    db.filas[chaveFila] = [];

    saveDB();

    const embedReset = new EmbedBuilder()
.setColor('#9e0000')
.setTitle('📱 | 🖥️ Filas Misto 4v4')
.setDescription(`
🎮 Modo
4v4 Misto

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

Nenhum jogador na fila.
`)
.setImage(BANNER);

        await i.message.edit({
  embeds: [embedReset],
  components: i.message.components
});

    const canal = await i.guild.channels.create({

  name: `📱 | 🖥️・misto-${valor}-${i.customId.startsWith('misto4_inf_') ? 'inf' : 'normal'}`,

  parent: '1508826084572008598',

  type: ChannelType.GuildText,

  permissionOverwrites: [

        {
          id: i.guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador1,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador2,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: '1500957130017210398',
          type: 0,
          allow: [PermissionFlagsBits.ViewChannel]
      }

      ]

    });

    if (!db.apostas) db.apostas = {};

    db.apostas[canal.id] = {
      valor
    };

    saveDB();

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('confirmar_aposta')
          .setLabel('✅ Confirmar')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('cancelar_aposta')
          .setLabel('❌ Cancelar')
          .setStyle(ButtonStyle.Danger)

      );

    await canal.send({

      content: `<@${jogador1}> <@${jogador2}>`,

      embeds: [

        new EmbedBuilder()
          .setColor('#9e0000')
          .setTitle('📱 | 🖥️ NOVA APOSTA MISTO 4v4')
          .setDescription(`
👤 Jogador 1
<@${jogador1}>

👤 Jogador 2
<@${jogador2}>

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Taxa
R$0,10

⏳ Ambos devem confirmar a aposta.
`)
          .setImage(BANNER)

      ],

      components: [row]

    });

  }

  return;

}

// ================= FILAS MISTO 3v3 =================

if (
  i.customId.startsWith('misto3_inf_') ||
  i.customId.startsWith('misto3_normal_')
) {

  console.log("MISTO CLICADO");
  console.log(i.customId);

  const valor = Number(
    i.customId
      .replace('misto3_inf_', '')
      .replace('misto3_normal_', '')
  );

  const modo = i.customId.startsWith('misto3_inf_')
    ? '<:gelo:1511451244663800110> Gelo Infinito'
    : '<:gelo:1511451244663800110> Gelo Normal';

  const chaveFila =
    `${valor}_${i.customId.startsWith('misto3_inf_') ? 'misto3_inf' : 'misto3_normal'}`;

  if (!db.filas) db.filas = {};

  if (!db.filas[chaveFila]) {
    db.filas[chaveFila] = [];
  }

  const jaExiste = db.filas[chaveFila].find(
  j => j.id === i.user.id
);

if (jaExiste) {
  return i.reply({
    content: '❌ Você já está nesta fila.',
    ephemeral: true
  });
}

// remove o jogador de TODAS as filas antes

for (const fila in db.filas) {

  db.filas[fila] = db.filas[fila].filter(
    jogador => jogador.id !== i.user.id
  );

}

db.filas[chaveFila].push({
  id: i.user.id,
  modo
});

console.log("SALVOU EM:", chaveFila);
console.log(db.filas[chaveFila]);

console.log(
  'CHAVE:',
  chaveFila
);

console.log(
  JSON.stringify(db.filas, null, 2)
);

saveDB();

  const filaInf = db.filas[`${valor}_misto3_inf`] || [];
const filaNormal = db.filas[`${valor}_misto3_normal`] || [];

const jogadores = [...filaInf, ...filaNormal]
  .map(j => `👤 <@${j.id}>\n${j.modo}`)
  .join('\n\n') || 'Nenhum jogador na fila.';

  const embed = new EmbedBuilder()
  .setColor('#9e0000')
  .setTitle('📱 | 🖥️ Filas Misto 3v3')
  .setDescription(`
🎮 Modo
3v3 Misto

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

${jogadores}
`)
  .setImage(BANNER);

  await i.update({
    embeds: [embed],
    components: i.message.components
  });

  if (db.filas[chaveFila].length >= 2) {

    const jogador1 = db.filas[chaveFila][0]?.id;
    const jogador2 = db.filas[chaveFila][1]?.id;

    if (!jogador1 || !jogador2) return;

    db.filas[chaveFila] = [];

    saveDB();

    const embedReset = new EmbedBuilder()
.setColor('#9e0000')
.setTitle('📱 | 🖥️ Filas Misto 3v3')
.setDescription(`
🎮 Modo
3v3 Misto

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

Nenhum jogador na fila.
`)
.setImage(BANNER);

        await i.message.edit({
  embeds: [embedReset],
  components: i.message.components
});

    const canal = await i.guild.channels.create({

  name: `📱 | 🖥️・misto-${valor}-${i.customId.startsWith('misto3_inf_') ? 'inf' : 'normal'}`,

  parent: '1508826084572008598',

  type: ChannelType.GuildText,

  permissionOverwrites: [

        {
          id: i.guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador1,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador2,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: '1500957130017210398',
          type: 0,
          allow: [PermissionFlagsBits.ViewChannel]
      }

      ]

    });

    if (!db.apostas) db.apostas = {};

    db.apostas[canal.id] = {
      valor
    };

    saveDB();

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('confirmar_aposta')
          .setLabel('✅ Confirmar')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('cancelar_aposta')
          .setLabel('❌ Cancelar')
          .setStyle(ButtonStyle.Danger)

      );

    await canal.send({

      content: `<@${jogador1}> <@${jogador2}>`,

      embeds: [

        new EmbedBuilder()
          .setColor('#9e0000')
          .setTitle('📱 | 🖥️ NOVA APOSTA MISTO 3v3')
          .setDescription(`
👤 Jogador 1
<@${jogador1}>

👤 Jogador 2
<@${jogador2}>

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Taxa
R$0,10

⏳ Ambos devem confirmar a aposta.
`)
          .setImage(BANNER)

      ],

      components: [row]

    });

  }

  return;

}

// ================= FILAS MISTO 2v2 =================

if (
  i.customId.startsWith('misto2_inf_') ||
  i.customId.startsWith('misto2_normal_')
) {

  console.log("MISTO CLICADO");
  console.log(i.customId);

  const valor = Number(
    i.customId
      .replace('misto2_inf_', '')
      .replace('misto2_normal_', '')
  );

  const modo = i.customId.startsWith('misto2_inf_')
    ? '<:gelo:1511451244663800110> Gelo Infinito'
    : '<:gelo:1511451244663800110> Gelo Normal';

  const chaveFila =
    `${valor}_${i.customId.startsWith('misto2_inf_') ? 'misto2_inf' : 'misto2_normal'}`;

  if (!db.filas) db.filas = {};

  if (!db.filas[chaveFila]) {
    db.filas[chaveFila] = [];
  }

  const jaExiste = db.filas[chaveFila].find(
  j => j.id === i.user.id
);

if (jaExiste) {
  return i.reply({
    content: '❌ Você já está nesta fila.',
    ephemeral: true
  });
}

// remove o jogador de TODAS as filas antes

for (const fila in db.filas) {

  db.filas[fila] = db.filas[fila].filter(
    jogador => jogador.id !== i.user.id
  );

}

db.filas[chaveFila].push({
  id: i.user.id,
  modo
});

console.log("SALVOU EM:", chaveFila);
console.log(db.filas[chaveFila]);

console.log(
  'CHAVE:',
  chaveFila
);

console.log(
  JSON.stringify(db.filas, null, 2)
);

saveDB();

  const filaInf = db.filas[`${valor}_misto2_inf`] || [];
const filaNormal = db.filas[`${valor}_misto2_normal`] || [];

const jogadores = [...filaInf, ...filaNormal]
  .map(j => `👤 <@${j.id}>\n${j.modo}`)
  .join('\n\n') || 'Nenhum jogador na fila.';

  const embed = new EmbedBuilder()
  .setColor('#9e0000')
  .setTitle('📱 | 🖥️ Filas Misto')
  .setDescription(`
🎮 Modo
2v2 Misto

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

${jogadores}
`)
  .setImage(BANNER);

  await i.update({
    embeds: [embed],
    components: i.message.components
  });

  if (db.filas[chaveFila].length >= 2) {

    const jogador1 = db.filas[chaveFila][0]?.id;
    const jogador2 = db.filas[chaveFila][1]?.id;

    if (!jogador1 || !jogador2) return;

    db.filas[chaveFila] = [];

    saveDB();

    const embedReset = new EmbedBuilder()
.setColor('#9e0000')
.setTitle('📱 | 🖥️ Filas Misto 2v2')
.setDescription(`
🎮 Modo
2v2 Misto

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

Nenhum jogador na fila.
`)
.setImage(BANNER);

        await i.message.edit({
  embeds: [embedReset],
  components: i.message.components
});

    const canal = await i.guild.channels.create({

  name: `📱 | 🖥️・misto-${valor}-${i.customId.startsWith('misto2_inf_') ? 'inf' : 'normal'}`,

  parent: '1508826084572008598',

  type: ChannelType.GuildText,

  permissionOverwrites: [

        {
          id: i.guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador1,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: jogador2,
          allow: [PermissionFlagsBits.ViewChannel]
        },

        {
          id: '1500957130017210398',
          type: 0,
          allow: [PermissionFlagsBits.ViewChannel]
      }

      ]

    });

    if (!db.apostas) db.apostas = {};

    db.apostas[canal.id] = {
      valor
    };

    saveDB();

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('confirmar_aposta')
          .setLabel('✅ Confirmar')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('cancelar_aposta')
          .setLabel('❌ Cancelar')
          .setStyle(ButtonStyle.Danger)

      );

    await canal.send({

      content: `<@${jogador1}> <@${jogador2}>`,

      embeds: [

        new EmbedBuilder()
          .setColor('#9e6700')
          .setTitle('📱 | 🖥️ NOVA APOSTA MISTO')
          .setDescription(`
👤 Jogador 1
<@${jogador1}>

👤 Jogador 2
<@${jogador2}>

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Taxa
R$0,10

⏳ Ambos devem confirmar a aposta.
`)
          .setImage(BANNER)

      ],

      components: [row]

    });

  }

  return;

}

// ================= SAIR DA FILA =================

if (
  i.customId.startsWith('sair_fila_misto4_')||
  i.customId.startsWith('sair_fila_misto3_')||
  i.customId.startsWith('sair_fila_misto2_')||
  i.customId.startsWith('sair_fila_emu4v4_')||
  i.customId.startsWith('sair_fila_emu3v3_')||
  i.customId.startsWith('sair_fila_emu2v2_')||
  i.customId.startsWith('sair_fila_emu_') ||
  i.customId.startsWith('sair_fila_') ||
  i.customId.startsWith('sair_fila2_') ||
  i.customId.startsWith('sair_fila3_') ||
  i.customId.startsWith('sair_fila4_')
) {

  const valor = Number(
  i.customId
    .replace('sair_fila_misto4_', '')
    .replace('sair_fila_misto3_', '')
    .replace('sair_fila_misto2_', '')
    .replace('sair_fila_emu3v3_', '')
    .replace('sair_fila_emu3v3_', '')
    .replace('sair_fila_emu2v2_', '')
    .replace('sair_fila_emu_', '')
    .replace('sair_fila_', '')
    .replace('sair_fila2_', '')
    .replace('sair_fila3_', '')
    .replace('sair_fila4_', '')
);

  const eh2v2 = i.customId.startsWith('sair_fila2_');
  const eh3v3 = i.customId.startsWith('sair_fila3_');
  const eh4v4 = i.customId.startsWith('sair_fila4_');
  const ehEmu = i.customId.startsWith('sair_fila_emu_');
  const ehEmu2v2 = i.customId.startsWith('sair_fila_emu2v2_');
  const ehEmu3v3 = i.customId.startsWith('sair_fila_emu3v3_');
  const ehEmu4v4 = i.customId.startsWith('sair_fila_emu4v4_');
  const ehMisto2 = i.customId.startsWith('sair_fila_misto2_');
  const ehMisto3 = i.customId.startsWith('sair_fila_misto3_');
  const ehMisto4 = i.customId.startsWith('sair_fila_misto4_');
  
  let saiu = false;

  if (!db.filas) db.filas = {};

  const filasPossiveis = ehMisto4
? [
    `${valor}_misto4_inf`,
    `${valor}_misto4_normal`
  ]

  : ehMisto3
  
? [
    `${valor}_misto3_inf`,
    `${valor}_misto3_normal`
  ]

  : ehMisto2

? [
    `${valor}_misto2_inf`,
    `${valor}_misto2_normal`
  ]
  : ehEmu4v4

  ? [
    `${valor}_emu4v4_inf`,
    `${valor}_emu4v4_normal`
  ]
  : ehEmu3v3

  ? [
    `${valor}_emu3v3_inf`,
    `${valor}_emu3v3_normal`
  ]
  : ehEmu2v2

  ? [
    `${valor}_emu2v2_inf`,
    `${valor}_emu2v2_normal`
  ]
  : ehEmu
  
  ? [
      `${valor}_emu_inf`,
      `${valor}_emu_normal`
    ]
  : eh4v4
  ? [
      `${valor}_4v4_inf`,
      `${valor}_4v4_normal`
    ]
  : eh3v3
  ? [
      `${valor}_3v3_inf`,
      `${valor}_3v3_normal`
    ]
  : eh2v2
  ? [
      `${valor}_2v2_inf`,
      `${valor}_2v2_normal`
    ]
  : [
      `${valor}_inf`,
      `${valor}_normal`
    ];

  for (const fila of filasPossiveis) {

    if (!db.filas[fila]) continue;

    const antes = db.filas[fila].length;

    db.filas[fila] = db.filas[fila].filter(
      jogador => jogador.id !== i.user.id
    );

    if (db.filas[fila].length < antes) {
      saiu = true;
    }

  }

  saveDB();

  if (!saiu) {
    return i.reply({
      content: '❌ Você não está nesta fila.',
      ephemeral: true
    });
  }

  let filaInf;
  let filaNormal;
  let titulo;
  let modo;

  if (ehMisto4) {

  filaInf = db.filas[`${valor}_misto4_inf`] || [];
  filaNormal = db.filas[`${valor}_misto4_normal`] || [];

  titulo = '🖥️ Filas Misto 4v4';
  modo = '4v4 Misto';
  
  }

  else if (ehMisto2) {

  filaInf = db.filas[`${valor}_misto3_inf`] || [];
  filaNormal = db.filas[`${valor}_misto3_normal`] || [];

  titulo = '🖥️ Filas Misto 3v3';
  modo = '3v3 Misto';
  
  }

else if (ehMisto2) {

  filaInf = db.filas[`${valor}_misto2_inf`] || [];
  filaNormal = db.filas[`${valor}_misto2_normal`] || [];

  titulo = '🖥️ Filas Misto 2v2';
  modo = '2v2 Misto';
  
  }

else if (ehEmu4v4) {

  filaInf = db.filas[`${valor}_emu4v4_inf`] || [];
  filaNormal = db.filas[`${valor}_emu4v4_normal`] || [];

  titulo = '🖥️ Filas Emulador 4v4';
  modo = '4v4 Emulador';

}

else if (ehEmu3v3) {

  filaInf = db.filas[`${valor}_emu3v3_inf`] || [];
  filaNormal = db.filas[`${valor}_emu3v3_normal`] || [];

  titulo = '🖥️ Filas Emulador 3v3';
  modo = '3v3 Emulador';

}
else if (ehEmu2v2) {

    filaInf = db.filas[`${valor}_emu2v2_inf`] || [];
  filaNormal = db.filas[`${valor}_emu2v2_normal`] || [];

  titulo = '🖥️ Filas Emulador 2v2';
  modo = '2v2 Emulador';

}
else if (ehEmu) {

  filaInf = db.filas[`${valor}_emu_inf`] || [];
  filaNormal = db.filas[`${valor}_emu_normal`] || [];

  titulo = '🖥️ Filas Emuladores';
  modo = '1v1 Emulador';

}
else

  if (eh4v4) {

  filaInf = db.filas[`${valor}_4v4_inf`] || [];
  filaNormal = db.filas[`${valor}_4v4_normal`] || [];

  titulo = '📱 Filas 4v4 Mobile';
  modo = '4v4 Mobile';

} else
  
if (eh3v3) {

    filaInf = db.filas[`${valor}_3v3_inf`] || [];
    filaNormal = db.filas[`${valor}_3v3_normal`] || [];

    titulo = '📱 Filas 3v3 Mobile';
    modo = '3v3 Mobile';

  } else if (eh2v2) {

    filaInf = db.filas[`${valor}_2v2_inf`] || [];
    filaNormal = db.filas[`${valor}_2v2_normal`] || [];

    titulo = '📱 Filas 2v2 Mobile';
    modo = '2v2 Mobile';

  } else {

    filaInf = db.filas[`${valor}_inf`] || [];
    filaNormal = db.filas[`${valor}_normal`] || [];

    titulo = '📱 Filas Mobiles';
    modo = '1v1 Mobile';

  }

  const jogadores = [...filaInf, ...filaNormal]
    .map(j => `👤 <@${j.id}>\n${j.modo}`)
    .join('\n\n') || 'Nenhum jogador na fila.';

  const embed = new EmbedBuilder()
    .setColor('#9e6700')
    .setTitle(titulo)
    .setDescription(`
🎮 Modo
${modo}

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores

${jogadores}
`)
    .setImage(BANNER);

  await i.message.edit({
    embeds: [embed],
    components: i.message.components
  });

  return i.reply({
    content: '✅ Você saiu da fila com sucesso.',
    ephemeral: true
  });

}

  // ================= CRIAR DEPÓSITO =================

    if (
      i.customId === 'deposito'
    ) {

      const canal =
        await i.guild.channels.create({

        name:
        `deposito-${i.user.username}`,

        type:
        ChannelType.GuildText,

        permissionOverwrites: [

          {
            id:
            i.guild.roles.everyone,

            deny: [
              PermissionFlagsBits.ViewChannel
            ]
          },

          {
            id: i.user.id,

            allow: [
              PermissionFlagsBits.ViewChannel
            ]
          },

          {
            id: STAFF_ROLE_ID,

            allow: [
              PermissionFlagsBits.ViewChannel
            ]
          }
        ]
      });

      await canal.send({
        embeds: [

          new EmbedBuilder()
          .setColor('#00ff88')
          .setTitle('💰 DEPÓSITO')
          .setDescription(`
Envie o comprovante aqui.

👤 Usuário:
${i.user}
`)
          .setImage(BANNER)

        ]
      });

      return i.reply({
        content:
        `✅ Ticket criado: ${canal}`,
        ephemeral: true
      });
    }

  // ================= CRIAR SAQUE =================

if (i.customId === 'saque') {

  const canal = await i.guild.channels.create({
    name: `saque-${i.user.username}`,
    type: ChannelType.GuildText,

    permissionOverwrites: [
      {
        id: i.guild.roles.everyone,
        deny: [
          PermissionFlagsBits.ViewChannel
        ]
      },

      {
        id: i.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel
        ]
      },

      {
        id: STAFF_ROLE_ID,
        allow: [
          PermissionFlagsBits.ViewChannel
        ]
      }
    ]
  });

  await canal.send({
    embeds: [
      new EmbedBuilder()
      .setColor('#9e6700')
      .setTitle('💸 SAQUE')
      .setDescription(`
Envie sua chave pix.

💰 Saldo:
R$${getSaldo(i.user.id).toFixed(2)}
`)
      .setImage(BANNER)
    ]
  });

  return i.reply({
    content: `✅ Ticket criado: ${canal}`,
    ephemeral: true
  });
}

// ================= CONFIRMAR APOSTA ================= //

if (i.customId === 'confirmar_aposta') {

  const channelId = i.channel.id;

  if (!db.confirmacoes) {
    db.confirmacoes = {};
  }

  if (!db.confirmacoes[channelId]) {
    db.confirmacoes[channelId] = [];
  }

  if (db.confirmacoes[channelId].includes(i.user.id)) {

    return i.reply({
      content: '❌ Você já confirmou esta aposta.',
      ephemeral: true
    });

  }

  db.confirmacoes[channelId].push(i.user.id);

  saveDB();

  await i.reply({
    content: `✅ ${i.user} confirmou a aposta.`,
    ephemeral: false
  });

  const totalConfirmados =
    db.confirmacoes[channelId].length;

  if (totalConfirmados >= 2) {

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('assumir_aposta')
          .setLabel('🎯 Assumir Aposta')
          .setStyle(ButtonStyle.Primary)

      );

    const embed = new EmbedBuilder()
      .setColor('#2ecc71')
      .setTitle('✅ APOSTA CONFIRMADA')
      .setDescription(`
Os dois jogadores confirmaram a aposta.

👨‍💼 Um Mediador deve assumir a partida para continuar.
`)
      .setImage(BANNER);

    await i.channel.send({
      embeds: [embed],
      components: [row]
    });

  }

}

// =============== CANCELAR APOSTA =============

if (i.customId === 'cancelar_aposta') {

  await i.reply({
    content: '❌ Aposta cancelada. Canal será fechado.',
    ephemeral: false
  });

  setTimeout(async () => {
    try {
      await i.channel.delete();
    } catch {}
  }, 3000);

}

// ================= ASSUMIR APOSTA =================

if (i.customId === 'assumir_aposta') {

  if (!i.member.roles.cache.has('1500957130017210398')) {
    return i.reply({
      content: '❌ Sem permissão.',
      ephemeral: true
    });
  }

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('liberar_pix')
        .setLabel('🔑 Liberar PIX')
        .setStyle(ButtonStyle.Success)
    );

  await i.reply({
    content: `🎯 ${i.user} assumiu a aposta.`,
    ephemeral: false
  });

  const embedMediador = new EmbedBuilder()
.setColor('#00ff88')
.setTitle('🏦 PAINEL DE MEDIAÇÃO')
.setDescription(`
👨‍💼 Mediador
${i.user}

✅ A aposta foi assumida com sucesso.

📋 Próximo passo:
Clique em **Liberar PIX** para enviar os dados de pagamento aos jogadores.

⚠️ Verifique todas as informações antes de continuar.
`)
.setImage(BANNER)
.setFooter({
  text: 'Sand E-SPORTS Apostas'
});

await i.channel.send({
  embeds: [embedMediador],
  components: [row]
});

}

// ================= LIBERAR PIX =================

if (i.customId === 'liberar_pix') {

  console.log('BOTAO PIX CLICADO');
  console.log('Usuario:', i.user.id);

  const pix = db.pix?.[i.user.id];

  if (!pix) {
    return i.reply({
      content: '❌ Você não possui PIX cadastrado.',
      ephemeral: true
    });
  }

  if (!db.apostas) db.apostas = {};

  if (!db.apostas[i.channel.id]) {
    db.apostas[i.channel.id] = {};
  }

  // salva quem liberou o PIX
  db.apostas[i.channel.id].mediador = i.user.id;

  saveDB();

  const valorAposta =
    db.apostas?.[i.channel.id]?.valor || 0;

  const taxa = 0.10;

  const totalPagar =
    (valorAposta + taxa).toFixed(2);

  const mensagens =
    await i.channel.messages.fetch({
      limit: 100
    });

  await i.channel.bulkDelete(
    mensagens.filter(m => !m.pinned),
    true
  ).catch(() => {});

  await i.channel.setName(
    `💰・pagamento-${valorAposta}`
  ).catch(() => {});

  const embed = new EmbedBuilder()
    .setColor('#00ff88')
    .setTitle('💳 PAGAMENTO LIBERADO')
    .setThumbnail(i.user.displayAvatarURL())
    .setDescription(`
╔════════════════════╗
      💰 PAGAMENTO
╚════════════════════╝

👨‍💼 **Mediador**
${i.user}

━━━━━━━━━━━━━━━━━━

💵 **Valor da Aposta**
\`R$${valorAposta.toFixed(2).replace('.', ',')}\`

🏦 **Taxa**
\`R$${taxa.toFixed(2).replace('.', ',')}\`

✅ **Total a Pagar**
#️⃣ \`R$${totalPagar.replace('.', ',')}\`

━━━━━━━━━━━━━━━━━━

🔑 **Chave PIX**
\`${pix.chave}\`

📋 **Tipo**
${pix.tipo}

👤 **Nome**
${pix.nome}

━━━━━━━━━━━━━━━━━━

📤 **Após efetuar o pagamento**
Envie o comprovante neste canal.

⚠️ Não apague mensagens.
⚠️ Aguarde a confirmação do analista.
`)
    .setImage(BANNER_PIX)
    .setFooter({
      text: 'Sand E-SPORTS • Sistema de Pagamentos'
    })
    .setTimestamp();

  const rowPix = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('copiar_pix')
        .setLabel('📋 Copiar PIX')
        .setStyle(ButtonStyle.Primary)
    );

  await i.channel.send({
    embeds: [embed],
    components: [rowPix]
  });

}

  // ================= COPIAR PIX =================

if (i.customId === 'copiar_pix') {

  const aposta = db.apostas?.[i.channel.id];

  if (!aposta?.mediador) {
    return i.reply({
      content: '❌ PIX não foi liberado.',
      ephemeral: true
    });
  }

  const pix = db.pix?.[aposta.mediador];

  if (!pix) {
    return i.reply({
      content: '❌ PIX do mediador não encontrado.',
      ephemeral: true
    });
  }

  return i.reply({
    content: `📋 Chave PIX:\n\`${pix.chave}\``,
    ephemeral: true
  });

}

  // ================= MODAL PIX =================

if (
  i.isModalSubmit() &&
  i.customId === 'modal_pix'
) {

  const nome = i.fields.getTextInputValue('nome');
  const chave = i.fields.getTextInputValue('chave');
  const tipo = i.fields.getTextInputValue('tipo');

  if (!db.pix) db.pix = {};

  db.pix[i.user.id] = {
    nome,
    chave,
    tipo
  };

  saveDB();

  return i.reply({
    embeds: [
      new EmbedBuilder()
      .setColor('#2ecc71')
      .setTitle('✅ PIX CADASTRADO')
      .setDescription(`
👤 Nome: ${nome}

💳 Tipo: ${tipo}

🔑 Chave:
\`${chave}\`
`)
    ],
    ephemeral: true
  });
}

  }

  // ================= SLASH =================

  if (!i.isChatInputCommand()) return;

  // ================= PING =================

  if (i.commandName === 'ping') {

    return i.reply(
      `🏓 Pong: ${client.ws.ping}ms`
    );
  }
  
  // ================= VALORES EMULADOR 4v4 =================

if (i.commandName === 'valoresemu4v4') {

  await i.deferReply({ ephemeral: true });

  const valores = [
    100, 90, 80, 70, 60, 55, 50, 45,
    40, 30, 25, 20, 15, 10, 5,
    3, 2, 1, 0.5
  ];

  for (const valor of valores) {

    const embed = new EmbedBuilder()
      .setColor('#9e0000')
      .setTitle('🖥️ Filas Emulador 4v4')
      .setDescription(
`🎮 Modo
4v4 Emulador

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores
Nenhum jogador na fila.`
      )
      .setImage(BANNER);

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('emu4v4_inf_' + valor)
          .setLabel('Gelo Infinito')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId('emu4v4_normal_' + valor)
          .setLabel('Gelo Normal')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('sair_fila_emu4v4_' + valor)
          .setLabel('Sair da Fila')
          .setEmoji('🚪')
          .setStyle(ButtonStyle.Danger)
      );

    console.log('Enviando painel:', valor);

      await i.channel.send({
      embeds: [embed],
      components: [row]
    });
  }

  return i.editReply({
    content: '✅ Painéis Emulador 4v4 enviados com sucesso.'
  });
}
  
  // ================= VALORES EMULADOR 3V3 =================

if (i.commandName === 'valoresemu3v3') {

  await i.deferReply({ ephemeral: true });

  const valores = [
    100, 90, 80, 70, 60, 55, 50, 45,
    40, 30, 25, 20, 15, 10, 5,
    3, 2, 1, 0.5
  ];

  for (const valor of valores) {

    const embed = new EmbedBuilder()
      .setColor('#9e0000')
      .setTitle('🖥️ Filas Emulador 3v3')
      .setDescription(
`🎮 Modo
3v3 Emulador

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores
Nenhum jogador na fila.`
      )
      .setImage(BANNER);

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('emu3v3_inf_' + valor)
          .setLabel('Gelo Infinito')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId('emu3v3_normal_' + valor)
          .setLabel('Gelo Normal')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('sair_fila_emu3v3_' + valor)
          .setLabel('Sair da Fila')
          .setEmoji('🚪')
          .setStyle(ButtonStyle.Danger)
      );

    console.log('Enviando painel:', valor);

      await i.channel.send({
      embeds: [embed],
      components: [row]
    });
  }

  return i.editReply({
    content: '✅ Painéis Emulador 3v3 enviados com sucesso.'
  });
}
  
  // ================= VALORES EMULADOR 2V2 =================

if (i.commandName === 'valoresemu2v2') {

  await i.deferReply({ ephemeral: true });

  const valores = [
    100, 90, 80, 70, 60, 55, 50, 45,
    40, 30, 25, 20, 15, 10, 5,
    3, 2, 1, 0.5
  ];

  for (const valor of valores) {

    const embed = new EmbedBuilder()
      .setColor('#9e0000')
      .setTitle('🖥️ Filas Emulador 2v2')
      .setDescription(
`🎮 Modo
2v2 Emulador

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores
Nenhum jogador na fila.`
      )
      .setImage(BANNER);

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('emu2v2_inf_' + valor)
          .setLabel('Gelo Infinito')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId('emu2v2_normal_' + valor)
          .setLabel('Gelo Normal')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('sair_fila_emu2v2_' + valor)
          .setLabel('Sair da Fila')
          .setEmoji('🚪')
          .setStyle(ButtonStyle.Danger)
      );

    console.log('Enviando painel:', valor);

      await i.channel.send({
      embeds: [embed],
      components: [row]
    });
  }

  return i.editReply({
    content: '✅ Painéis Emulador 2v2 enviados com sucesso.'
  });
}
  
  // ================= VALORES EMULADOR =================

if (i.commandName === 'valoresemu') {

  await i.deferReply({ ephemeral: true });

  const valores = [
    100, 90, 80, 70, 60, 55, 50, 45,
    40, 30, 25, 20, 15, 10, 5,
    3, 2, 1, 0.5
  ];

  for (const valor of valores) {

    const embed = new EmbedBuilder()
      .setColor('#9e0000')
      .setTitle('🖥️ Filas Emulador')
      .setDescription(`
🎮 Modo
1v1 Emulador

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores
Nenhum jogador na fila.
`)
      .setImage(BANNER);

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId(`emu_inf_${valor}`)
          .setLabel('Gelo Infinito')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId(`emu_normal_${valor}`)
          .setLabel('Gelo Normal')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId(`sair_fila_emu_${valor}`)
          .setLabel('Sair da Fila')
          .setEmoji('🚪')
          .setStyle(ButtonStyle.Danger)

      );

    await i.channel.send({
      embeds: [embed],
      components: [row]
    });

  }

  return i.editReply({
    content: '✅ Painéis Emulador enviados com sucesso.'
  });

}

// ================= VALORES MISTO 2v2 =================

if (i.commandName === 'valoresmisto2') {

  await i.deferReply({ ephemeral: true });

  const valores = [
    100, 90, 80, 70, 60, 55, 50, 45,
    40, 30, 25, 20, 15, 10, 5,
    3, 2, 1, 0.5
  ];

  for (const valor of valores) {

    const embed = new EmbedBuilder()
      .setColor('#9e0000')
      .setTitle('📱 | 🖥️ Filas Misto 2v2')
      .setDescription(`
🎮 Modo
2v2 Misto

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores
Nenhum jogador na fila.
`)
      .setImage(BANNER);

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId(`misto2_inf_${valor}`)
          .setLabel('Gelo Infinito')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId(`misto2_normal_${valor}`)
          .setLabel('Gelo Normal')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId(`sair_fila_misto2_${valor}`)
          .setLabel('Sair da Fila')
          .setEmoji('🚪')
          .setStyle(ButtonStyle.Danger)

      );

    await i.channel.send({
      embeds: [embed],
      components: [row]
    });

  }

  return i.editReply({
    content: '✅ Painéis 2v2 Misto enviados com sucesso.'
  });

}

// ================= VALORES MISTO 3v3 =================

if (i.commandName === 'valoresmisto3') {

  await i.deferReply({ ephemeral: true });

  const valores = [
    100, 90, 80, 70, 60, 55, 50, 45,
    40, 30, 25, 20, 15, 10, 5,
    3, 2, 1, 0.5
  ];

  for (const valor of valores) {

    const embed = new EmbedBuilder()
      .setColor('#9e0000')
      .setTitle('📱 | 🖥️ Filas Misto 3v3')
      .setDescription(`
🎮 Modo
3v3 Misto

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores
Nenhum jogador na fila.
`)
      .setImage(BANNER);

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId(`misto3_inf_${valor}`)
          .setLabel('Gelo Infinito')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId(`misto3_normal_${valor}`)
          .setLabel('Gelo Normal')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId(`sair_fila_misto3_${valor}`)
          .setLabel('Sair da Fila')
          .setEmoji('🚪')
          .setStyle(ButtonStyle.Danger)

      );

    await i.channel.send({
      embeds: [embed],
      components: [row]
    });

  }

  return i.editReply({
    content: '✅ Painéis 3v3 Misto enviados com sucesso.'
  });

}

// ================= VALORES MISTO 4v4 =================

if (i.commandName === 'valoresmisto4') {

  await i.deferReply({ ephemeral: true });

  const valores = [
    100, 90, 80, 70, 60, 55, 50, 45,
    40, 30, 25, 20, 15, 10, 5,
    3, 2, 1, 0.5
  ];

  for (const valor of valores) {

    const embed = new EmbedBuilder()
      .setColor('#9e0000')
      .setTitle('📱 | 🖥️ Filas Misto 4v4')
      .setDescription(`
🎮 Modo
4v4 Misto

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores
Nenhum jogador na fila.
`)
      .setImage(BANNER);

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId(`misto4_inf_${valor}`)
          .setLabel('Gelo Infinito')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId(`misto4_normal_${valor}`)
          .setLabel('Gelo Normal')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId(`sair_fila_misto4_${valor}`)
          .setLabel('Sair da Fila')
          .setEmoji('🚪')
          .setStyle(ButtonStyle.Danger)

      );

    await i.channel.send({
      embeds: [embed],
      components: [row]
    });

  }

  return i.editReply({
    content: '✅ Painéis 4v4 Misto enviados com sucesso.'
  });

}
  
  // ================= VALORES =================

if (i.commandName === 'valores') {

  await i.deferReply({ ephemeral: true });

  const valores = [
    100, 90, 80, 70, 60, 55, 50, 45,
    40, 30, 25, 20, 15, 10, 5,
    3, 2, 1, 0.5
  ];

  for (const valor of valores) {

    const embed = new EmbedBuilder()
      .setColor('#9e0000')
      .setTitle('📱 Filas Mobiles')
      .setDescription(`
🎮 Modo
1v1 Mobile

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores
Nenhum jogador na fila.
`)
      .setImage(BANNER);

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId(`gelo_inf_${valor}`)
          .setLabel('Gelo Infinito')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId(`gelo_normal_${valor}`)
          .setLabel('Gelo Normal')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId(`sair_fila_${valor}`)
          .setLabel('Sair da Fila')
          .setEmoji('🚪')
          .setStyle(ButtonStyle.Danger)

      );

    await i.channel.send({
      embeds: [embed],
      components: [row]
    });

  }

  return i.editReply({
    content: '✅ Painéis enviados com sucesso.'
  });

}

  // ================= VALORES 2v2 =================

if (i.commandName === 'valores2v2') {

  await i.deferReply({ ephemeral: true });

  const valores = [
    100, 90, 80, 70, 60, 55, 50, 45,
    40, 30, 25, 20, 15, 10, 5,
    3, 2, 1, 0.5
  ];

  for (const valor of valores) {

    const embed = new EmbedBuilder()
      .setColor('#9e0000')
      .setTitle('📱 Filas 2v2 Mobile')
      .setDescription(`
🎮 Modo
2v2 Mobile

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores
Nenhum jogador na fila.
`)
      .setImage(BANNER);

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId(`gelo2_inf_${valor}`)
          .setLabel('Gelo Infinito')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId(`gelo2_normal_${valor}`)
          .setLabel('Gelo Normal')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId(`sair_fila2_${valor}`)
          .setLabel('Sair da Fila')
          .setEmoji('🚪')
          .setStyle(ButtonStyle.Danger)

      );

    await i.channel.send({
      embeds: [embed],
      components: [row]
    });

  }

  return i.editReply({
    content: '✅ Painéis enviados com sucesso.'
  });

}
  
  // ================= VALORES 3v3 =================

if (i.commandName === 'valores3v3') {

  await i.deferReply({ ephemeral: true });

  const valores = [
    100, 90, 80, 70, 60, 55, 50, 45,
    40, 30, 25, 20, 15, 10, 5,
    3, 2, 1, 0.5
  ];

  for (const valor of valores) {

    const embed = new EmbedBuilder()
      .setColor('#9e0000')
      .setTitle('📱 Filas 3v3 Mobile')
      .setDescription(`
🎮 Modo
3v3 Mobile

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores
Nenhum jogador na fila.
`)
      .setImage(BANNER);

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId(`gelo3_inf_${valor}`)
          .setLabel('Gelo Infinito')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId(`gelo3_normal_${valor}`)
          .setLabel('Gelo Normal')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId(`sair_fila3_${valor}`)
          .setLabel('Sair da Fila')
          .setEmoji('🚪')
          .setStyle(ButtonStyle.Danger)

      );

    await i.channel.send({
      embeds: [embed],
      components: [row]
    });

  }

  return i.editReply({
    content: '✅ Painéis 3v3 enviados com sucesso.'
  });

}

// ================= VALORES 4v4 =================

if (i.commandName === 'valores4v4') {

  await i.deferReply({ ephemeral: true });

  const valores = [
    100, 90, 80, 70, 60, 55, 50, 45,
    40, 30, 25, 20, 15, 10, 5,
    3, 2, 1, 0.5
  ];

  for (const valor of valores) {

    const embed = new EmbedBuilder()
      .setColor('#9e0000')
      .setTitle('📱 Filas 4v4 Mobile')
      .setDescription(`
🎮 Modo
4v4 Mobile

💰 Valor
R$${valor.toFixed(2).replace('.', ',')}

🏦 Valor da Taxa
R$0,10

👥 Jogadores
Nenhum jogador na fila.
`)
      .setImage(BANNER);

    const row = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId(`gelo4_inf_${valor}`)
          .setLabel('Gelo Infinito')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId(`gelo4_normal_${valor}`)
          .setLabel('Gelo Normal')
          .setEmoji('1511451244663800110')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId(`sair_fila4_${valor}`)
          .setLabel('Sair da Fila')
          .setEmoji('🚪')
          .setStyle(ButtonStyle.Danger)

      );

    await i.channel.send({
      embeds: [embed],
      components: [row]
    });

  }

  return i.editReply({
    content: '✅ Painéis 4v4 enviados com sucesso.'
  });

}

  // ================= PAINEL PIX =================//
    
    if (i.commandName === 'painelpix') {

  const embed = new EmbedBuilder()
    .setColor('#f1c40f')
    .setTitle('💠 Painel de Cadastros de Pix')
    .setDescription(
      'Cadastre sua chave pix ou verifique cadastros nos botões abaixo.'
    );

  const row = new ActionRowBuilder()
    .addComponents(

      new ButtonBuilder()
        .setCustomId('cadastrar_pix')
        .setLabel('Cadastrar Chave')
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId('verificar_pix')
        .setLabel('Verificar Cadastro')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId('verificar_admin')
        .setLabel('Verificar de Adm')
        .setStyle(ButtonStyle.Danger)

    );

  return i.reply({
    embeds: [embed],
    components: [row]
  });
}
  
  // ================= APAGAR =================

if (i.commandName === 'apagar') {

  if (
    !i.member.permissions.has(
      PermissionFlagsBits.Administrator
    )
  ) {
    return i.reply({
      content: '❌ Sem permissão.',
      ephemeral: true
    });
  }

  const quantidade =
    i.options.getInteger(
      'quantidade'
    );

  if (quantidade < 1 || quantidade > 100) {
    return i.reply({
      content: '❌ Escolha entre 1 e 100 mensagens.',
      ephemeral: true
    });
  }

  await i.channel.bulkDelete(
    quantidade,
    true
  );

  return i.reply({
    content: `🗑️ ${quantidade} mensagens apagadas.`,
    ephemeral: true
  });
}
  
  // =============== SALDO =================

  if (i.commandName === 'saldo') {

    return i.reply({
      embeds: [

        new EmbedBuilder()
        .setColor('#9e0000')
        .setTitle('💰 SALDO')
        .setDescription(`
Seu saldo:

R$${getSaldo(i.user.id).toFixed(2)}
`)
        .setImage(BANNER)

      ]
    });
  }

  // ================= ADDSALDO =================

  if (
    i.commandName === 'addsaldo'
  ) {

    if (
      !i.member.roles.cache.has(
        STAFF_ROLE_ID
      )
    ) {

      return i.reply({
        content:
        '❌ Sem permissão.',
        ephemeral: true
      });
    }

    const user =
      i.options.getUser(
        'usuario'
      );

    const valor =
      i.options.getNumber(
        'valor'
      );

    addSaldo(
      user.id,
      valor
    );

    return i.reply({
      embeds: [

        new EmbedBuilder()
        .setColor('#00ff88')
        .setTitle('✅ SALDO ADICIONADO')
        .setDescription(`
👤 Usuário:
${user}

💰 Valor:
R$${valor.toFixed(2)}
`)
        .setImage(BANNER)

      ]
    });
  }

  // ================= SALA =================

  if (
    i.commandName === 'sala'
  ) {

    const id =
      i.options.getString('id');

    const senha =
      i.options.getString('senha');

    return i.reply({
      embeds: [

        new EmbedBuilder()
        .setColor('#9e0000')
        .setTitle(
          '🎮 SALA FREE FIRE'
        )
        .setDescription(`
📋 Clique para copiar:

🆔 ID:
\`${id}\`

🔐 SENHA:
\`${senha}\`
`)
        .setImage(BANNER)

      ]
    });
  }

  // ================= FECHAR =================

  if (
    i.commandName === 'fechar'
  ) {

    await i.reply(
      '🔒 Fechando ticket...'
    );

    setTimeout(async () => {

      try {

        await i.channel.delete();

      } catch {}

    }, 3000);
  }

  // ================= PIX =================

  if (
    i.commandName === 'pix'
  ) {

    const chave =
      i.options.getString(
        'chave'
      );

    return i.reply({
      embeds: [

        new EmbedBuilder()
        .setColor('#00ff88')
        .setTitle('💎 CHAVE PIX')
        .setDescription(`
📋 Clique para copiar:

\`${chave}\`
`)
        .setImage(BANNER)

      ]
    });
  }

  // ================= EMBED =================

  if (
    i.commandName === 'embed'
  ) {

    const titulo =
      i.options.getString(
        'titulo'
      );

    const descricao =
      i.options.getString(
        'descricao'
      );

    return i.reply({
      embeds: [

        new EmbedBuilder()
        .setColor('#9e0000')
        .setTitle(titulo)
        .setDescription(descricao)
        .setImage(BANNER)

      ]
    });
  }

  // ================= PAINEL =================

  if (
    i.commandName === 'painel'
  ) {

    const embed =
      new EmbedBuilder()
      .setColor('#9e0000')
      .setTitle('🎰 PAINEL')
      .setDescription(`
Escolha uma opção abaixo.
`)
      .setImage(BANNER);

    const row =
      new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
        .setCustomId(
          'deposito'
        )
        .setLabel(
          '💰 Depositar'
        )
        .setStyle(
          ButtonStyle.Success
        ),

        new ButtonBuilder()
        .setCustomId(
          'saque'
        )
        .setLabel(
          '💸 Sacar'
        )
        .setStyle(
          ButtonStyle.Danger
        ),

        new ButtonBuilder()
        .setCustomId(
          'confirmar'
        )
      );

    return i.reply({
      embeds: [embed],
      components: [row]
    });
  }

});

client.on('guildMemberAdd', async (member) => {

  const cargo = member.guild.roles.cache.get('1507197898784243712');

  if (!cargo) return;

  try {
    await member.roles.add(cargo);
  } catch (err) {
    console.error(err);
  }

});

// ================= PERFIL (+p) =================

client.on('messageCreate', async (message) => {

  if (message.author.bot) return;

  if (!message.content.startsWith('+p')) return;

  console.log("COMANDO +P EXECUTADO");

  const user =
    message.mentions.users.first() ||
    message.author;

  const wins = db.wins?.[user.id] || 0;
  const loses = db.loses?.[user.id] || 0;
  const streak = db.streak?.[user.id] || 0;

  const embed = new EmbedBuilder()
    .setColor('#9e0000')
    .setTitle(`👤 Perfil de ${user.username}`)
    .setDescription(`
🏆 Vitórias
${wins}

❌ Derrotas
${loses}

🔥 Win Streak
${streak}
`)
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .setImage(BANNER);

  await message.reply({
    embeds: [embed]

  });
});

console.log("MessageCreate listeners:", client.listenerCount("messageCreate"));

// ================= LOGIN =================

client.login(process.env.TOKEN)