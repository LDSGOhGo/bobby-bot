const Augur = require('augurbot'),
    u = require('../utils/utils'),
    colors = require('colors'),
    Jimp = require('jimp'),
    request = require('request'),
    dwebp = require('cwebp').DWebp

async function getTarget(message, suffix, keywords=false){
    let target,
        urlexp = /\<?(https?:\/\/\S+)\>?(?:\s)?(\d*)/,
        match
        if(!keywords){
            if(message.attachments.size > 0) target = message.attachments.first().url
            else if (match = urlexp.exec(suffix)) target = match[1]
            else{
                let mention = await u.getMention(message, false, false)
                target = mention.displayAvatarURL({format: 'png', size: 256})
            }
            return target
        }
        else{
            if(message.attachments.size > 0) target = message.attachments.first().url
            else if(match = urlexp.exec(suffix)) target = match[1]
            else{
                let mention = await u.getMention(message, keywords, false); 
                target = mention.displayAvatarURL({format: 'png', size: 256})
            }
            return target
        }
        
}

const Module = new Augur.Module();
Module.addCommand({name: "amongus",
    category: "Images",
    process: async (message, args) =>{

        let colorSelected
        let words = args.toLowerCase().split(' ')[0]
        let keywords = args.split(' ').slice(1).join(' ')
        let colors = ['black','blue','brown','cyan','green','lime','orange','pink','purple','red','white','yellow']
        let target
        if(colors.includes(words)) target = await getTarget(message, keywords, keywords);
        else target = await getTarget(message, args, false)        
        try
        {
        
            if(colors.includes(words)) colorSelected = `media/amongians/${words}.png`
            else
            {
                let colorSelect = Math.floor(Math.random() * 12)
                     if(colorSelect == 0) colorSelected = 'media/amongians/black.png'
                else if(colorSelect == 1) colorSelected = 'media/amongians/blue.png'
                else if(colorSelect == 2) colorSelected = 'media/amongians/brown.png'
                else if(colorSelect == 3) colorSelected = 'media/amongians/cyan.png'
                else if(colorSelect == 4) colorSelected = 'media/amongians/green.png'
                else if(colorSelect == 5) colorSelected = 'media/amongians/lime.png'
                else if(colorSelect == 6) colorSelected = 'media/amongians/orange.png'
                else if(colorSelect == 7) colorSelected = 'media/amongians/pink.png'
                else if(colorSelect == 8) colorSelected = 'media/amongians/purple.png'
                else if(colorSelect == 9) colorSelected = 'media/amongians/red.png'
                else if(colorSelect == 10) colorSelected = 'media/amongians/white.png'
                else if(colorSelect == 11) colorSelected = 'media/amongians/yellow.png'
            }

            const canvas = new Jimp(353, 458, 0x00000000);
            const avatar = await Jimp.read(colorSelected);
            try{await Jimp.read(target)}catch(e){return message.channel.send("I couldn't read that file.")}
            const mask = await Jimp.read("./media/amongians/mask.png");
            const topLayer = await Jimp.read('media/amongians/helmetmask.png')
            const image =  await Jimp.read(target)
            image.resize(170, 170);
            canvas.blit(image, 166, 52)
            canvas.mask(mask,0,0)
            avatar.blit(canvas, 0,0)
            avatar.blit(topLayer, 0, 0)
            await message.channel.send({files: [await avatar.getBufferAsync(Jimp.MIME_PNG)]});
        }catch (error) {console.log(error)}
    }
})
.addCommand({name: "andywarhol",
    category: "Images",
    process: async (message, args) =>{
        try
        {
            let target = await getTarget(message, args);
            try{await Jimp.read(target)} catch(e){return message.channel.send("I couldn't read that file.")}
            const img = await Jimp.read(target);
            const canvas = new Jimp(536, 536, 0xffffffff);
        
            img.resize(256, 256);
            img.color([{apply: "spin", params: [60]}]);
            canvas.blit(img, 8, 272);
            img.color([{apply: "spin", params: [60]}]);
            canvas.blit(img, 272, 8);
            img.color([{apply: "spin", params: [60]}]);
            canvas.blit(img, 272, 272);
            img.color([{apply: "spin", params: [120]}]);
            canvas.blit(img, 8, 8);

            await message.channel.send({files: [await canvas.getBufferAsync(Jimp.MIME_PNG)]})
        } catch (error) {console.log(error);message.channel.send('I ran into an error. I\'ve let my developer know')}
    }
})
.addCommand({name: "avatar",
    category: "Images",
    process: async (message, args) =>{
        let target = await u.getMention(message, false, true)
        if(message.guild) target = target.user
        return message.channel.send(`\`${target.username}\`:`,{files: [target.displayAvatarURL({format: 'png', dynamic: true, size: 1024})]})
    }
})
.addCommand({name: "blur",
    category: "Images",
    process: async (message, args) =>{
        try{
            let deg = parseInt(args, 10) || 5
            if(deg < 0) return message.channel.send("You can't sharpen the image with this command!")
            if(deg > 50) return message.channel.send("That value is too high!")
            let processed = false;
            let messages = await message.channel.messages.fetch({ limit: 100 });
            for (const [messageId, message] of messages)
            {
                if (message.attachments.size > 0)
                {
                    let target = message.attachments.first().url
                    processed = true;
                    try{await Jimp.read(target)}catch(e){continue}
                    const image = await Jimp.read(target)
                    image.blur(deg)
                    await message.channel.send({files: [await image.getBufferAsync(Jimp.MIME_PNG)]});
                    break
                }
            }
            if (!processed) message.channel.send("I couldn't find any recent images to blur!")
        } catch(error){console.log(error)}
    }
})
.addCommand({name: "blurple",
    category: "Images",
    process: async (message, args) =>{
        let target = await getTarget(message, args, false)
        try{await Jimp.read(target)}catch(e){return message.channel.send("I couldn't read that file.")}
        let image = await Jimp.read(target)
        image.color([
          { apply: "desaturate", params: [100] },
          { apply: "saturate", params: [47.7] },
          { apply: "hue", params: [227] }
        ])
        return message.channel.send({files: [await image.getBufferAsync(Jimp.MIME_PNG)]});
    }
})
.addCommand({name: "color",
    category: "Images",
    process: async (message, args) =>{
        let color = args;
        if (args){
            if (args.startsWith('0x')) color = "#" + args.substr(2);
            if (!["#000000", "black", "#000000FF"].includes(color)) color = Jimp.cssColorToHex(color);
        }
        else color = Math.floor(Math.random()*16777215).toString(16);
        try{
            if (color != 255){
                let img = new Jimp(256, 256, color);
                return message.channel.send({files: [await img.getBufferAsync(Jimp.MIME_PNG)]});
            }
            return message.reply(`sorry, I couldn't understand the color "${args}"`).then(u.clean);
        } catch (error) {console.log(error)}
    }
})
.addCommand({name: "colorme",
    category: "Images",
    process: async (message, args) =>{
        let keywords = args
        let color = parseInt(args.split(' ')[0], 10);
        
        if(color) keywords = args.replace(color+' ', '')
        let target,
            urlexp = /\<?(https?:\/\/\S+)\>?(?:\s+)?(\d*)/,
            match;
        if (message.attachments.size > 0) target = message.attachments.first().url;
        else if (match = urlexp.exec(args)){
          target = match[1];
          color = parseInt(match[2], 10);
        }
        else target = (keywords? await u.getMention(message, keywords, false) : await u.getMention(message, false, false)).displayAvatarURL({format: 'png', size: 256})
        
        color = Math.floor(color) || (10 * (Math.floor(Math.random() * (34 + 34) -34)));
  
        if(color > 360 || color < -360) return message.channel.send("That's out of range! Try using a number between -360 and 360.")
        
        let image = await Jimp.read(target)
        image.color([{ apply: "hue", params: [color] }]);
        
        await message.channel.send(`Hue: ${color}`,{files: [await image.getBufferAsync(Jimp.MIME_PNG)]});
    }
})
.addCommand({name: "crop",
    category: "Images",
    process: async (message, args) =>{
        let processed = false;
        let messages = await message.channel.messages.fetch({ limit: 100 });
        for (const [messageId, message] of messages)
        {
            if (message.author.bot) continue;
            if (message.attachments.size > 0)
            {
                let target = message.attachments.first().url
                processed = true;
                try{await Jimp.read(target)}catch(e){return message.channel.send("I couldn't read that file.")}
                const cropped = await Jimp.read(target)
                cropped.autocrop({ cropOnlyFrames: false, cropSymmetric: false, tolerance: .01 })
                await message.channel.send({files: [await cropped.getBufferAsync(Jimp.MIME_PNG)]});
                break
            }
        }
        if (!processed) message.channel.send("I couldn't find any recent images to crop!")
    }
})
.addCommand({name: "flex",
    category: "Images",
    process: async (message, args) =>{
        const arm = "https://cdn.discordapp.com/attachments/488887953939103775/545672817354735636/509442648080121857.png";
        const staticURL = (await u.getMention(message, false, false)).displayAvatarURL({format: 'png', size: 128})
        const right = await Jimp.read(arm);
        const mask = await Jimp.read("./media/flexmask.png");
        const avatar = await Jimp.read(staticURL);
        const canvas = new Jimp(368, 128, 0x00000000);
  
        if (Math.random() > 0.5) right.flip(false, true);
        const left = right.clone().flip(true, (Math.random() > 0.5));
  
        avatar.resize(128, 128);
        avatar.mask(mask, 0, 0);
        
        canvas.blit(left, 0, 4);
        canvas.blit(right, 248, 4);
        canvas.blit(avatar, 120, 0);
  
        await message.channel.send({files: [await canvas.getBufferAsync(Jimp.MIME_PNG)]});
    }
})
.addCommand({name: "invert",
    category: "Images",
    process: async (message, args) =>{
        let target = await getTarget(message, null, false)
        try{await Jimp.read(target)}catch(e){return message.channel.send("I couldn't read that file.")}
        let image = await Jimp.read(target)
        image.invert()
        await message.channel.send({files: [await image.getBufferAsync(Jimp.MIME_PNG)]});
    }
})
.addCommand({name: "mirror",
    category: "Images",
    process: async (message, direction) =>{
        let processed = false;
        let messages = await message.channel.messages.fetch({ limit: 100 });
        for (const [messageId, message] of messages)
        {
            if (message.attachments.size > 0)
            {
                let target = message.attachments.first().url
                processed = true;
                try{await Jimp.read(target)}catch(e){continue}
                const image = await Jimp.read(target)
                if(!direction) return message.channel.send("Which way do you want me to flip it?")
                else if(['horizontal','h','hori','hor','left','right','l','r','x'].includes(direction.toLowerCase())) image.flip(true, false)
                else if(['vertical','v','verti','vert','up','down','u','d','y'].includes(direction.toLowerCase())) image.flip(false, true)
                else if(['both','xy','x y','all'].includes(direction.toLowerCase())) image.flip(true, true)
                await message.channel.send({files: [await image.getBufferAsync(Jimp.MIME_PNG)]});
                break
            }
            
        }
        if (!processed) message.channel.send("I couldn't find any recent images to mirror!")
    }
})
.addCommand({name: "popart",
    category: "Images",
    process: async (message, args) =>{
        let target = await getTarget(message, null, false)
        try{await Jimp.read(target)}catch(e){return message.channel.send("I couldn't read that file.")}
        const img = await Jimp.read(target);
        const canvas = new Jimp(536, 536, 0xffffffff);
    
        img.resize(256, 256);
    
        img.color([{ apply: "desaturate", params: [100] }, { apply: "saturate", params: [50] }]);
        canvas.blit(img, 8, 272);
    
        img.color([{apply: "spin", params: [60]}]);
        canvas.blit(img, 272, 8);
    
        img.color([{apply: "spin", params: [60]}]);
        canvas.blit(img, 272, 272);
    
        img.color([{apply: "spin", params: [120]}]);
        canvas.blit(img, 8, 8);
        message.channel.send({files: [await canvas.getBufferAsync(Jimp.MIME_PNG)]});
    }
})
.addCommand({name: "removebg",
    process: async (message, args)=>{
        let processed = false;
        let messages = await message.channel.messages.fetch({ limit: 100 });
        for (const [messageId, message] of messages)
        {
            if (message.author.bot) continue;
            if (message.attachments.size > 0)
            {
                let target = message.attachments.first().url
                processed = true;
                try{await Jimp.read(target)}catch(e){return message.channel.send("I couldn't read that file.")}
                const image = await Jimp.read(target)
                const targetColor = {r: 255, g: 255, b: 255, a: 255};  // Color you want to replace
                const replaceColor = {r: 0, g: 0, b: 0, a: 0};  // Color you want to replace with
                const colorDistance = (c1, c2) => Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2) + Math.pow(c1.a - c2.a, 2));  // Distance between two colors
                const threshold = 32;  // Replace colors under this threshold. The smaller the number, the more specific it is.
                image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
                    const thisColor = {
                        r: image.bitmap.data[idx + 0],
                        g: image.bitmap.data[idx + 1],
                        b: image.bitmap.data[idx + 2],
                        a: image.bitmap.data[idx + 3]
                    };
                    if(colorDistance(targetColor, thisColor) <= threshold) {
                        image.bitmap.data[idx + 0] = replaceColor.r;
                        image.bitmap.data[idx + 1] = replaceColor.g;
                        image.bitmap.data[idx + 2] = replaceColor.b;
                        image.bitmap.data[idx + 3] = replaceColor.a;
                    }
                });
                await message.channel.send({files: [await image.getBufferAsync(Jimp.MIME_PNG)]});
                break
            }
        }
        if (!processed) message.channel.send("I couldn't find any recent images to crop!")
            

    }
})
.addCommand({name: "rotate",
    category: "Images",
    process: async (message, args) =>{
        let deg = parseInt(args, 10) || (10 * (Math.floor(Math.random() * (34 + 34) -34)));
        if(args.startsWith('-' && parseInt(args, 10))) deg = 0 - deg
        let processed = false;
        let messages = await message.channel.messages.fetch({ limit: 100 });
        for (const [messageId, message] of messages)
        {
            if (message.attachments.size > 0)
            {
                let target = message.attachments.first().url
                processed = true;
                try{await Jimp.read(target)}catch(e){continue}
                const image = await Jimp.read(target)
                image.rotate(deg)
                image.autocrop({cropOnlyFrames: false, tolerance: 0, leaveBorder: 3})
                await message.channel.send(`\`Rotated ${deg}°\``,{files: [await image.getBufferAsync(Jimp.MIME_PNG)]});
                break
            }
        }
        if (!processed) message.channel.send("I couldn't find any recent images to rotate!")
    }
})

module.exports = Module