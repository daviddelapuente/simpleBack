const{Pool}=require('pg');
const {key,iv, encrypt, decrypt}=require('./crypto.controller')

const pool = new Pool({
    host:'database1.cnoqfukpfm6d.us-east-1.rds.amazonaws.com',
    user:'postgres',
    password:process.env.dbpass,
    database:'myDatabase',
    port:'5432',
})

const getUsers = async (req,res)=>{
    const response = await pool.query('SELECT * FROM simplelinkuser ORDER BY linkcount DESC;');
    console.log(process.env.dbpass)
    res.status(200).json(response.rows);
}

const createUser= async(req,res)=>{
    const {username,email,sex}=req.body;
    try {
        const response = await pool.query('INSERT INTO simplelinkuser (username,email,sex,linkcount) VALUES ($1, $2, $3,$4)',[username,email,sex,0]);
        res.send({"status":1,"msg":"succesful"});
    }catch(err) {
        res.send({"status":0,"msg":"El correo ya existe"});
    }
}

const generateLink = async(req,res)=>{
    const {username,email}=req.body;
    const response = await pool.query('SELECT * FROM simplelinkuser WHERE username=$1 AND email=$2',[username,email]);
    const link={}
    if (response.rowCount==1){
        link["status"]=1;
        link["link"]=encrypt(email).encryptedData;
    }else{
        link["status"]=0;
        link["msg"]="usuario no encontrado"
    }
    res.send(link);
}

const usersRefered = async(req,res)=>{
    const {username,email,sex,link}=req.body;
    let buferEnc=encrypt("");
    buferEnc.encryptedData=link;
    try{
        var referalmail=decrypt(buferEnc);
    }catch{
        res.send({"status":0,"msg":"El link no es valido"});
        return
    }

    const referalExist = await pool.query('SELECT * FROM simplelinkuser WHERE email=$1',[referalmail]);

    if (referalExist.rowCount===0){
        res.send({"status":0,"msg":"El link no es valido"});
        return
    }

    const referedExist = await pool.query('SELECT * FROM simplelinkuser WHERE email=$1',[email]);
    if (referedExist.rowCount!==0){
        res.send({"status":0,"msg":"El email ya existe"});
        return
    }
    


    //TODO: make this query atomics
    //const createNewUser = await pool.query('BEGIN; INSERT INTO simplelinkuser (username,email,sex,linkcount) VALUES ($1, $2, $3,$4); UPDATE simplelinkuser SET linkcount = linkcount + 1 WHERE email = $5; END',[username,email,sex,1,referalmail]);
    
    const createNewUser = await pool.query('INSERT INTO simplelinkuser (username,email,sex,linkcount) VALUES ($1, $2, $3,$4)',[username,email,sex,1]);
    const updateReferal = await pool.query('UPDATE simplelinkuser SET linkcount = linkcount + 1 WHERE email = $1',[referalmail]);
    res.send({"status":1,"msg":"Succesfull"});
}




module.exports = {
    getUsers,
    createUser,
    generateLink,
    usersRefered,
}