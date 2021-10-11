const Discord = require('discord.js'); // npm i discord.js
const client = new Discord.Client(); 
const fs = require('fs') // npm i fs
const moment = require('moment') // npm i moment
const disbut = require('discord-buttons'); // npm i discord-buttons

/* ↑ البكجات ↑ */

disbut(client); // لا تعدل عليها ( للأزرار )
const coolDown = new Set(); // تعريف الكول داون
const ticketdata = JSON.parse(fs.readFileSync('./ticketdata.json', 'utf8'));

const prefix = "!"; // البرفكس
let x = ["344966841535561730"] // حط الاي دي حقك


 client.on('ready', () => {
  console.log("i'm ready.")
   });

client.on("message", async message => {
 if (message.content.indexOf(prefix) != 0) return;
 const args = message.content.slice(prefix.length).trim().split(" ");
 const command = args.shift().toLowerCase();
 let ticketdb = JSON.parse(fs.readFileSync('./ticketdb.json', 'utf8'));

  if (command == 'Ticket' || command == 'ticket') {
    if (message.channel.type == "dm") return;
    if (!x.includes(message.author.id)) return;

    const category = message.guild.channels.cache.find(c => c.name == "Ticket System" && c.type == "category"); // تعريف الكاتيجوري   
    const ticketchannel = await message.guild.channels.cache.find(opchan => opchan.name.toLowerCase() === "open-ticket") // تعريف شات التكت
    const logchannel = await message.guild.channels.cache.find(logchannelll => logchannelll.name.toLowerCase() === "ticket-log") // تعريف شات اللوق
    const transcript = await message.guild.channels.cache.find(taschan => taschan.name.toLowerCase() === "ticket-backup") // تعريف الباك اب

    if(!category) {
    await message.guild.channels.create('Ticket System', { type: 'category' }) // انشاء كاتيجوري
    }

    if(!ticketchannel) {
    var tic = await message.guild.channels.create('open-ticket', { type: 'text' })

    tic.setParent(category.id); // نقل شات  فتح التكت للكاتيجوري
     await tic.overwritePermissions([ // تعديل خصائص شات فتح التكت
      {
       id: message.guild.id,
       deny: ['SEND_MESSAGES'],
      },
      {
       id: client.user.id,
       allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'SEND_MESSAGES', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
      }
   ])
}

    if(!logchannel) {
        var logs = await message.guild.channels.create('ticket-log', { type: 'text' })

        logs.setParent(category.id); // نقل شات اللوق للكاتيجوري
     await logs.overwritePermissions([ // تعديل خصائص شات اللوق 
      {
       id: message.guild.id,
       deny: ['VIEW_CHANNEL' ,'SEND_MESSAGES'],
      },
      {
       id: client.user.id,
       allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
      }
   ])
}
    
    if(!transcript) {
        var bkp = await message.guild.channels.create('ticket-backup', { type: 'text' })

        bkp.setParent(category.id); // نقل شات الباك اب للكاتيجوري
     await bkp.overwritePermissions([ // تعديل خصائص شات الباك اب 
      {
       id: message.guild.id,
       deny: ['VIEW_CHANNEL' ,'SEND_MESSAGES'],
      },
      {
       id: client.user.id,
       allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
      },
   ])
}
    if(!ticketdb[message.guild.id]) ticketdb[message.guild.id] = {
     open: "اذا اردت فتح تكت اضغط على الزر",
     close: "اذا اردت اغلاق التكت اضغط على الزر"
    }

    if(!ticketdata[message.guild.id]) ticketdata[message.guild.id] = {
        num: 0
    }

  ticketchannel.bulkDelete(100);
    const kboosh = { // ايمبد فتح التكت
     title: `${message.guild.name} Ticket System`,
     description: `**${ticketdb[message.guild.id].open}**`,
     timestamp: new Date(),
    }

    let button = new disbut.MessageButton() // زر فتح التكت
     .setLabel("Open Ticket !")
     .setStyle("green")
     .setID("open")

    let m = await ticketchannel.send({ // ارسال الايمبد + الزر
     component: button,
     embed: kboosh
    });

    const filter1 = (button) => button.id == "open"; // فلتر زر فتح التكت
    const collector1 = m.createButtonCollector(filter1); // كوليكتر فتح التكت

     collector1.on('collect', async button => { 
      if(button.id == "open") {
      if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`**لا امتلك صلاحية \`Manage Channels\` لصنع شات**`);
      if(coolDown.has(button.clicker.user)) return; // يمنع تكرار فتح تكت للمدة الموجودة تحت 4 اسطر بالملّي سكند
       
      coolDown.add(button.clicker.user) // يضيف كول داون
       setTimeout(() => {
        coolDown.delete(button.clicker.user) // يحذف الكول داون بعد التايم آوت
       }, 300000)

        ticketdata[message.guild.id].num == ticketdata[message.guild.id].num++;
        fs.writeFileSync("./ticketdata.json", JSON.stringify(ticketdata), (err) => {
            if (err) console.error(err)
        });

        let ticketreq = await message.guild.channels.create(`Ticket-${ticketdata[message.guild.id].num}`, { type: 'text'})// رقم التكت يترستر كل مرة الا اذا ربطته بداتا بيس
         ticketreq.setParent(category.id) // ينقل التكت للكاتيجوري
         await ticketreq.overwritePermissions([ // يعدل خصائص التكت 
          {
           id: message.guild.id,
           deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
          },
          {
           id: button.clicker.user.id,
           allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
          },
          {
           id: client.user.id,
           allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'SEND_MESSAGES', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
          },
      /*  {  
           id: message.guild.roles.cache.find(r => r.id === "829415978932371526"),  // لاضافة رول معيّن للتكت
           allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'SEND_MESSAGES', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
          } */
        ])
        .then(async kboo$ => {// التكت
        const logembednew = { // يرسل باللوق رسالة في حال فتح تكت
          author: {
          name: `Ticket System`,
          icon_url: "https://blog.logomyway.com/wp-content/uploads/2020/12/discord-mascot.png",
          },
          description: `**قام <@${button.clicker.user.id}>\n بانشاء تكت : ( ${kboo$.name} )**`,
          timestamp: new Date(),
         }
        logchannel.send({ embed: logembednew });

        const lekboosh = { // الايمبد الي ينرسل عند فتح تكت
          author: {
          name: `Ticket System`,
          icon_url: `https://blog.logomyway.com/wp-content/uploads/2020/12/discord-mascot.png`,
          },
          description: `**${ticketdb[message.guild.id].close}**`,
          timestamp: new Date(),
          }
       
        let button2 = new disbut.MessageButton() // زر اغلاق التكت
         .setLabel("Close The Ticket !")
         .setStyle("red")
         .setID("close")

        let m2 = await kboo$.send(`${button.clicker.user}`,{
          component: button2,
          embed: lekboosh
        });

        const filter2 = (button2) => button2.id == "close"; // فلتر زر اغلاق التكت
        const collector2 = m2.createButtonCollector(filter2); // كوليكتر الاغلاق

        collector2.on('collect', async button2 => {
         kboo$.overwritePermissions([ // يقفل التكت
          {
           id: message.guild.id,
           deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
          },
          {
           id: button.clicker.user.id,
           deny: ['VIEW_CHANNEL'],
          },
          {
           id: client.user.id,
           allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'SEND_MESSAGES', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
          }
        ]);

        const logembedclose = { 
          author: {
          name: `Ticket System`,
          icon_url: `https://blog.logomyway.com/wp-content/uploads/2020/12/discord-mascot.png`,
          },
          description: `**قام <@${button2.clicker.user.id}>\n باغلاق تكت : ( ${kboo$.name} )**`,
          timestamp: new Date(),
          }
        logchannel.send({ embed: logembedclose });

        m2.edit('**تم اغلاق التكت ..**', {component: null,}); // تنرسل بالتكت بعد ما تتقفل
         const delkboosh = { // تنرسل بالتكت بعد ما تتقفل
           author: {
           name: `Ticket System`,
           icon_url: `https://blog.logomyway.com/wp-content/uploads/2020/12/discord-mascot.png`,
           },
           description: '**لحذف التكت اختر الزر الأحمر\n\nلفتح التكت مرة اخرى اختر الزر الاخضر\n\nلأخذ نسخة عن التكت اختر الزر الرمادي**',
           timestamp: new Date(),
           }

            let button3 = new disbut.MessageButton() // زر حذف التكت
             .setLabel("Delete The Ticket !")
             .setStyle("red")
             .setID("delete")
            let button4 = new disbut.MessageButton() // زر اعادة فتح التكت
             .setLabel("Reopen Ticket !")
             .setStyle("green")
             .setID("reopen")
            let button5 = new disbut.MessageButton() // زر انشاء نسخة للتكت
             .setLabel("Save Transcript !")
             .setStyle("gray")
             .setID("transcript")
                
        let buttonRow = new disbut.MessageActionRow() // ↑ يجمع الثلاث ازرار الي فوق ↑
         .addComponent(button3)
         .addComponent(button4)
         .addComponent(button5)

        let m3 = await kboo$.send({
          component: buttonRow,
          embed: delkboosh
        });

            const filter3 = (button3) => button3.id == "delete"; // فلتر زر حذف التكت
            const collector3 = m3.createButtonCollector(filter3);

             collector3.on('collect', async button3 => {
              kboo$.send(`**حسنًا جارِ حذف ${kboo$.name}**`); // تنرسل بالتكت قبل الحذف بثانية ونص

                    setTimeout(() => {
 
                     kboo$.delete(); // يحذف التكت

                     const logembeddelete = { // يرسل باللوق عند حذف التكت
                       author: {
                       name: `Ticket System`,
                       icon_url: `https://blog.logomyway.com/wp-content/uploads/2020/12/discord-mascot.png`,
                       },
                       description: `**قام <@${button3.clicker.user.id}>\n بحذف تكت : ( ${kboo$.name} )**`,
                       timestamp: new Date(),
                       }
                     logchannel.send({ embed: logembeddelete });

                    }, 1500);
                });

                const filter4 = (button4) => button4.id == "reopen"; // فلتر اعادة فتح التكت
                const collector4 = m3.createButtonCollector(filter4);

                 collector4.on('collect', async button4 => {

                    kboo$.overwritePermissions([ // يعدل على الخصائص ويفتح التكت مرة ثانية
                     {
                      id: message.guild.id,
                      deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                     },
                     {
                      id: button.clicker.user.id,
                      allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                     },
                     {
                      id: client.user.id,
                      allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'SEND_MESSAGES', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
                     }
                  ]);
                    kboo$.send(`**قُمت بإعادة فتح التكت**`); // يرسل هذا الكلام بالتكت بعد فتح التكت

                    const logembedtranscript = { // يرسل باللوق بعد فتح التكت
                      author: {
                      name: `Ticket System`,
                      icon_url: `https://blog.logomyway.com/wp-content/uploads/2020/12/discord-mascot.png`,
                      },
                      description: `**قام <@${button4.clicker.user.id}>\n بإعادة فتح التكت : ( ${kboo$.name} )**`,
                      timestamp: new Date(),
                      }
                    logchannel.send({ embed: logembedtranscript });
                });

                const filter5 = (button5) => button5.id == "transcript"; // فلتر نسخة التكت
                const collector5 = m3.createButtonCollector(filter5);

                 collector5.on('collect', async button5 => {
                  const messages = await kboo$.messages.fetch()
                  const content = messages.map(m => `${moment(m.createdAt, "YYYY-MM-DD HH:mm:ss")} - ${m.author.username} - ${m.content} .`)
                
                fs.writeFileSync('transcript.txt', content.join('\n'), (error) => {
                  if (error) throw error
                })
                kboo$.send(`**قُمت بأخذ نسخة عن التكت ${transcript}**`); // ينرسل بعد ما ياخذ نسخة بالتكت

                const logembedtranscript = { // ينرسل باللوق بعد اخذ نسخة
                  author: {
                  name: `Ticket System`,
                  icon_url: `https://blog.logomyway.com/wp-content/uploads/2020/12/discord-mascot.png`,
                  },
                  description: `**قام <@${button5.clicker.user.id}>\n بأخذ نسخة عن تكت : ( ${kboo$.name} )**`,
                  timestamp: new Date(),
                  }
                logchannel.send({ embed: logembedtranscript });

              transcript.send(`**${kboo$.name} Backup.**`, new Discord.MessageAttachment("transcript.txt", "transcript.txt")) // يرسل النسخة بشات الباك اب
          });
         if (coolDown.has(button.clicker.user)) { coolDown.delete(button.clicker.user); } // يحذف الكول داون عن الشخص - للامان - فقط
        });
       });
      }
     });
    fs.writeFileSync("./ticketdata.json", JSON.stringify(ticketdata), (err) => {
   if (err) console.error(err)
  });
 }
});


client.on("message", async message => {
    if (message.content.indexOf(prefix) != 0) return;
    const args = message.content.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();
    if (command == 'rename' || command == 'Rename' || command == 'اسم' || command == 'الاسم') {
        if (message.channel.type == "dm") return;
        if (!x.includes(message.author.id)) return;
        if (message.channel.name.toLowerCase().includes(`ticket-`)) {
        let kbooshargs = message.content.split(" ").slice(1);
        if (kbooshargs == 0) return message.channel.send(`**ضع الاسم\n Example: \`${prefix}${command} closed\`**`);
        message.channel.setName(args.join(' '));
    message.channel.send(`**تم تغيير اسم الروم الى \`${kbooshargs.join(' ')}\`**`)
    }
  }
});
    let ticketdb = JSON.parse(fs.readFileSync('./ticketdb.json', 'utf8'));

client.on('message', async message => {
    if (message.content.indexOf(prefix) != 0) return;
    const args = message.content.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();

    if (command == 'open') {
        if (message.channel.type == "dm") return;
        if (!x.includes(message.author.id)) return;

        if(!args.join(' ')) return message.channel.send(`**Example: ${prefix}${command} \`اذا اردت فتح تكت اضغط على الزر\`**`);
            
            ticketdb[message.guild.id] = {
            open: args.join(' '),
            close: ticketdb[message.guild.id].close,
            cooldown: ticketdb[message.guild.id].cooldown
            }

            fs.writeFileSync("./ticketdb.json", JSON.stringify(ticketdb ,'utf8' ,null , 2), (err) => {
            if (err) console.error(err)
            });
    
    } else
    if(command == 'close') {
        if (message.channel.type == "dm") return;
        if (!x.includes(message.author.id)) return;

        if(!args.join(' ')) return message.channel.send(`**Example: ${prefix}${command} \`اذا اردت اغلاق التكت اضغط على الزر\`**`);
            
            ticketdb[message.guild.id] = {
            open: ticketdb[message.guild.id].open,
            close: args.join(' '),
            cooldown: ticketdb[message.guild.id].cooldown
            }

        fs.writeFileSync("./ticketdb.json", JSON.stringify(ticketdb ,'utf8' ,null , 2), (err) => {
        if (err) console.error(err)
   });
  }
});

client.on("message", async message => {
    if (message.content.indexOf(prefix) != 0) return;
    const args = message.content.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();

    if (command == 'add' || command == 'Add' || command == 'اضافة') {
        if (message.channel.type == "dm") return;
        if (!x.includes(message.author.id)) return;

        if (message.channel.name.toLowerCase().includes(`ticket-`)) {
        let mention = message.mentions.users.first();
        if (!mention) return message.channel.send('**منشن الشخص اولاً**');
        
        message.channel.overwritePermissions([
        {
        id: message.guild.id,
        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        },
        {
            id: mention.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
        },
        {
            id: client.user.id,
            allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'SEND_MESSAGES', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
        }
        ]);
    message.channel.send(`**قُمت باضافة ${mention} الى التكت**`)
    }
    } else {
    if (command == 'remove' || command == 'Remove' || command == 'ازالة') {
        if (message.channel.type == "dm") return;
        if (!x.includes(message.author.id)) return;

      if (message.channel.name.toLowerCase().includes(`ticket-`)) {
        let mention = message.mentions.users.first();
        if (!mention) return message.channel.send('**منشن الشخص اولاً**');
        
        message.channel.overwritePermissions([
        {
        id: message.guild.id,
        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        },
        {
            id: client.user.id,
            allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'SEND_MESSAGES', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
        }
        ]);
    message.channel.send(`**قُمت بازالة ${mention} من التكت**`)
    }
   }
  } 
});
        
client.login("");
