const crypto = require('crypto');

const easySeed = (buf) =>{
    for(let i=0;i<buf.length;i++){
        buf[i]=i;
    }
}
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const algorithm = 'aes-256-cbc';

function encrypt(text) {
 let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
 let iv = Buffer.from(text.iv, 'hex');
 let encryptedText = Buffer.from(text.encryptedData, 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}

easySeed(key);
easySeed(iv);

module.exports={
    key,
    iv,
    encrypt,
    decrypt,
}