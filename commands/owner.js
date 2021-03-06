const Augur = require('augurbot'),
    u = require('../utils/utils'),
    colors = require('colors'),
    nodemailer = require('nodemailer'),
    mongoose = require('mongoose'),
    fs = require('fs')
const Module = new Augur.Module();

const runCommand = (msg, cmd)=>{

    u.clean(msg);
    let stdout = [];
    let stderr = [];

    cmd.stdout.on("data", data => {
    stdout.push(data);
    });

    cmd.stderr.on("data", data => {
    stderr.push(data);
    });

    cmd.on("close", code => {
    if (code == 0)
        msg.channel.send(stdout.join("\n") + "\n\nCompleted with code: " + code).then(u.clean);
    else
        msg.channel.send(`ERROR CODE ${code}:\n${stderr.join("\n")}`).then(u.clean);
    });
}

Module.addCommand({name: "pingeveryone",
    category: "Owner",
    hidden: true,
    ownerOnly: true,
    process: async (msg, suffix) =>{
        if(msg.author.id != '337713155801350146') return
        try {
            msg.delete({timeout: 500})
            return msg.channel.send('@everyone').then(m =>{m.delete({timeout: 500})})
        } catch (error) {
            console.log(error)
        }
    }
    })

    .addCommand({name: "pinghere",
        category: "Owner",
        hidden: true,
        ownerOnly: true,
        process: async (msg, suffix) =>{
            if(msg.author.id != '337713155801350146') return
            try {
                msg.delete({timeout: 500})
                return msg.channel.send('@here').then(m =>{m.delete({timeout: 500})})
            } catch (error) {
                console.log(error)
            }
        }
    })

    .addCommand({name: "activity",
        category: "Owner",
        syntax: '<type>|<url> (if applicable)',
        ownerOnly: true,
        process: async (msg, suffix) =>{
            let words = suffix.split(' ')
            let keywords = words.slice(1).join(' ')
            let url = words.slice(1).join(' ').split('|')
            const twitchURL = 'https://twitch.tv/bobbydacatfish'

            let client = msg.client;

            if(words[0].toLowerCase() == 'streaming'){
                if(!url[0]) return msg.channel.send("What are you streaming?")
                if(!url[1]){
                    client.user.setActivity(keywords, {type: "STREAMING", url: twitchURL})
                    .then(p => msg.channel.send(`Status has been set to **streaming ${p.activities[0].name}**`))
                    .catch(error => msg.reply(`Couldn't change status because of: ${error}`));
                    return
                }
                if(msg.content.includes('https://www.')){
                    client.user.setActivity(url[0], {type: "STREAMING", url: url[1]})
                    .then(p =>  msg.channel.send(`Status has been set to **streaming ${p.activities[0].name}** at **${url[1]}**`))
                    .catch(error => msg.reply(`Couldn't change status because of: ${error}`));
                    return
                }
                client.user.setActivity(url[0], {type: "STREAMING", url: 'https://www.'+url[1]})
                .then(p => msg.channel.send(`Status has been set to **streaming ${p.activities[0].name}** at **${url[1]}**`))
                .catch(error => msg.reply(`Couldn't change status because of: ${error}`));
                return
            }
            if(words[0].toLowerCase() == 'watching'){
                if(!url[0]) return msg.channel.send("What are you watching?")
                if(!url[1]){
                    client.user.setActivity(url[0], {type: "WATCHING", url: 'https://www.twitch.tv/bobbydacatfish'})
                    .then(p => msg.channel.send(`Status has been set to **watching ${p.activities[0].name}**`))
                    .catch(error => msg.reply(`Couldn't change status because of: ${error}`));
                    return
                }
                if(url[1].includes('https://www.')){
                    client.user.setActivity(url[0], {type: "WATCHING", url: url[1]})
                    .then(p => msg.channel.send(`Status has been set to **watching ${p.activities[0].name}**`))
                    .catch(error => msg.reply(`Couldn't change status because of: ${error}`));
                    return
                }
                client.user.setActivity(url[0], {type: "WATCHING", url: 'https://www.' + url[1]})
                .then(p => msg.channel.send(`Status has been set to **watching ${p.activities[0].name}**`))
                .catch(error => msg.reply(`Couldn't change status because of: ${error}`));
                return
            }
            if(words[0].toLowerCase() == 'playing'){
                if(!keywords) return msg.channel.send("What are you playing?")
                client.user.setActivity(keywords, {type: "PLAYING"})
                .then(p => msg.channel.send('Status has been set to **playing ' + p.activities[0].name +'**'))
                .catch(error => msg.reply(`Couldn't change status because of: ${error}`));
                return
            }
            if(words[0].toLowerCase() == 'listening'){
                if(!keywords) return msg.channel.send("What are you listening to?")
                if(!url[1]){
                    client.user.setActivity(keywords, {type: "LISTENING", url:'https://open.spotify.com/track/6jQX8qOBCWffNAXhvPq7n4?si=rLdqxl7xQNKe_WSJSaXSrg'})
                    .then(p => msg.channel.send(`Status has been set to **listening to ${p.activities[0].name}**`))
                    .catch(error => msg.reply(`Couldn't change status because of: ${error}`));
                    return
                }
                if(url[1].includes('https://www.')){
                    client.user.setActivity(words[0], {type: "LISTENING", url: url[1]})
                    .then(p => msg.channel.send(`Status has been set to **listening to ${p.activities[0].name}**`))
                    .catch(error => msg.reply(`Couldn't change status because of: ${error}`));
                    return
                }
                client.user.setActivity(words[0], {type: "LISTENING", url: 'https://www.' + url[1]})
                .then(p => msg.channel.send(`Status has been set to **listening to ${p.activities[0].name}**`))
                .catch(error => msg.reply(`Couldn't change status because of: ${error}`));
                return
            }
            if(suffix.toLowerCase() == 'invisible'){
                client.user.setStatus('invisible')
                return msg.channel.send('Now invisible')
            }
            if(suffix.toLowerCase() == 'online'){
                client.user.setStatus('online')
                return msg.channel.send('Now available')
            }
            if(suffix.toLowerCase() == 'dnd'){
                client.user.setStatus('dnd')
                return msg.channel.send("Now unable to be disturbed")
            }
            if(suffix.toLowerCase() == 'idle'){
                client.user.setStatus('idle')
                return msg.channel.send('Now idle')
            }
            return
        }
    })

    .addCommand({name: "email",
        category: "Owner",
        ownerOnly: true,
        process: async (msg, suffix) =>{
            if(!suffix) return msg.channel.send("what are you thinking, dummy? give me some args")
            let emailAddress = suffix.split('|')[0]
            if(!emailAddress.includes('@') || !emailAddress.includes('.')) return msg.channel.send("That's not a valid email!").then(m =>u.clean([m, msg]))
            if(msg.attachments.first()) if(msg.attachments.first().size > 10000000) return msg.channel.send(`That attachment is too large!`)

            if(emailAddress.includes(' ')) emailAddress = emailAddress.split(' ')
            let emailSubject = suffix.split('|')[1]
            let emailContent = suffix.split('|')[2]
            if(!suffix.includes('|'))return msg.channel.send("Can't send that email")
            if(!emailContent && !emailSubject && !msg.attachments.first()) return msg.channel.send("Cannot send an empty email")
            
            let testAccount = await nodemailer.createTestAccount();
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.zoho.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth:
                {
                    user: Module.config.email.user,
                    pass: Module.config.email.pass
                },
            });
    
            if(msg.attachments.first()){
                let info = await transporter.sendMail({
                    from: `"Bobby Bot" <${Module.config.email.user}>`, // sender address
                    to: emailAddress, // list of receivers
                    subject: emailSubject, // Subject line
                    html: emailContent, // html body
                    attachments:
                    [
                        {   // use URL as an attachment
                            filename: msg.attachments.first().name,
                            path: msg.attachments.first().url
                        },
                    ]
                });
                return msg.channel.send("sent")
            }

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: `"Bobby Bot" <${Module.config.email.user}>`, // sender address
                to: emailAddress, // list of receivers
                subject: emailSubject, // Subject line
                html: emailContent, // html body
            });
            return msg.channel.send("sent")
        }
    })

    .addCommand({name: "iamyourdev",
        category: 'Owner',
        hidden: true,
        dmOnly: true,
        process: async(msg, suffix)=>{
            const devGuild = msg.client.guilds.cache.get('406821751905976320')
            if((await devGuild.fetchBans()).find(m => m.id == msg.author.id)) return msg.author.send("You were banned from the bot testing server.")
            else if(await devGuild.members.cache.get(msg.author.id)) return msg.author.send("You're already in the server!")
            else{
                let invite = await devGuild.channels.cache.get('793314668919521321').createInvite({maxUses: 1})
                msg.author.send("Welcome to the Bobby Bot Testing Server! \n 🤫 Let others find their way in. Don't tell them how!\n"+invite.url)
            }
        }
    })

    .addCommand({name: "send",
        category: "Owner",
        ownerOnly: true,
        description: "Sends stuff to a specific channel",
        process: async (msg, suffix) =>{
            if(!suffix) return msg.channel.send("what are you thinking, dummy? give me some args")
            let id = suffix.split(' ')[0]
            let content = suffix.split(' ').slice(1).join(' ')
            if(!id || id.replace(/[0-9]/g, '').length > 0) return msg.channel.send("need id")
            if(!content) return msg.channel.send("need content")
            if(!msg.client.users.cache.get(id)) return msg.channel.send('bad id')
            if(msg.attachments.size > 0) content = (content, {files: [msg.attachments.first().url]})
            msg.client.users.cache.get(id).send(content)
        }
    })

    .addCommand({name: "servers",
        category: "Owner",
        ownerOnly: true,
        description: "Gets the number of servers the bot is in",
        process: async (msg, suffix) =>{
            let getGuilds = msg.client.guilds.cache?.map(g => `${g.name}`).join("\n");
            let embed = u.embed()
                .setTitle(`I am in the following \`${msg.client.guilds.cache?.array().length}\` servers:`)
                .setDescription(`**${getGuilds}**`);
            if(!getGuilds) return msg.channel.send("I'm not in any servers... somehow").then(u.clean)
            else return msg.channel.send({embed, disableMentions: "all"});
        }
    })

    .addCommand({name: "commands",
        category: "Owner",
        ownerOnly: true,
        description: "Number of commands",
        process: async (msg, suffix) =>{
            msg.channel.send(`There are \`${msg.client.commands.size}\` commands`)
        }
    })

    .addCommand({name: 'spam',
        ownerOnly: true,
        description: 'spam pings for when you really need it',
        process: async (msg, args) =>{
            setInterval(() => {
                msg.channel.send(`<@${args || '307641454606680064'}>`)
            }, 3000);
            }
    })
    
    //github stuff
    .addCommand({name: 'add',
        category: 'Owner',
        ownerOnly: true,
        description: 'Add files to the repo (step 1)',
        hidden: true,
        process: async (msg) => {
            let spawn = require('child_process').spawn
            runCommand(msg, spawn('git', ['add','.'], {cwd: process.cwd()}))
        }
    })
    .addCommand({name: 'commit',
        category: 'Owner',
        ownerOnly: true,
        description: 'Commit files to the repo (step 2)',
        hidden: true,
        process: async (msg, suffix) => {
            if(!suffix) msg.channel.send("I need a commit message")
            let spawn = require('child_process').spawn
            runCommand(msg, spawn('git', ['commit',`-m`,`${suffix}`], {cwd: process.cwd()}))
        }
    })
    .addCommand({name: "push",
        category: 'Owner',
        ownerOnly: true,
        description: "Push bot updates to the git (step 3)",
        hidden: true,
        process: async (msg, suffix) =>{
            let spawn = require('child_process').spawn
            runCommand(msg, spawn('git', ['push'], {cwd: process.cwd()}))
        }
    })
    .addCommand({name: "pull",
        category: "Owner",
        ownerOnly: true,
        description: "Pull bot updates from git",
        hidden: true,
        process: (msg) => {
            let spawn = require("child_process").spawn;
            runCommand(msg, spawn('git', ['pull'], {cwd: process.cwd()}))
        },
    })

    .addCommand({name: "reload",
        category: "Bot Admin",
        hidden: true,
        ownerOnly: true,
        syntax: "[file1.js] [file2.js]",
        description: "Reload command files.",
        info: "Use the command without a suffix to reload all command files.\n\nUse the command with the module name (including the `.js`) to reload a specific file.",
        process: (msg, suffix) => {
            u.clean(msg);
            let path = require("path");
            let files = (suffix ? suffix.split(" ") : fs.readdirSync(path.resolve(__dirname)).filter(file => file.endsWith(".js")));

            for (const file of files) {
            try {
                msg.client.moduleHandler.reload(path.resolve(__dirname, file));
            } catch(error) { msg.client.errorHandler(error, msg); }
            }
            msg.react("👌");
        },
    })
    .addCommand({name: "reloadlib",
        category: "Bot Admin",
        hidden: true,
        ownerOnly: true,
        syntax: "[file1.js] [file2.js]",
        description: "Reload local library files.",
        process: (msg, suffix) => {
            u.clean(msg);
            msg.react("👌");
            if (suffix) {
            const path = require("path");
            let files = suffix.split(" ").filter(f => f.endsWith(".js"));
            for (let file of files) {
                delete require.cache[require.resolve(path.dirname(require.main.filename), file)];
            }
            } else {
            msg.reply("You need to tell me which libraries to reload!").then(u.clean);
            }
        },
    })
    
    //Add DBs on ready and create
    .addEvent('ready',async()=>{
        const GuildConfig = mongoose.models.GuildConfig || mongoose.model('GuildConfig', GCS)
        for(x of Module.client.guilds.cache.array())
        {
            const foundGuild = await GuildConfig.findOne({guildId: x.id})
            try {
                if(!foundGuild)await GuildConfig.create({guildId: x.id})
            } catch (error) {
                u.errorHandler(msg, error)
            }
        }
    })
    .addEvent('guildCreate', async guild =>{
        const GuildConfig = mongoose.models.GuildConfig || mongoose.model('GuildConfig', GCS)
        const foundGuild = await GuildConfig.findOne({guildId: guild.id})
        try{
            if(!foundGuild) await GuildConfig.create({guildId: message.guild.id})
        } catch (error){
            u.errorHandler(msg, error)
        }
    })

module.exports = Module