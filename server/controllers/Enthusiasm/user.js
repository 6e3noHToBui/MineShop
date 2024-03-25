const Users = require('../../models/user')
const Servers = require('../../models/server')
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const config = require('config');
const user = require('../../models/user');

function generateRandomPassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

exports.createAccount = [
    check('email', "Uncorrect E-mail").isEmail(),
    check('login', "Login must be 5-20 symbols").isLength({ min: 5, max: 20 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const messages = errors.errors.map(error => error.msg);
                return res.status(200).json(messages);
            }
            const { email, login } = req.body
            const candidateMail = await Users.findOne({ email });
            const candidateLogin = await Users.findOne({ login });
  
            if (candidateMail) {
                return res.status(200).json({error:`User with this email is already exist`});
            }
            if (candidateLogin) {
                return res.status(200).json({error:`User with this login is already exist`});
            }
            const randomPassword = generateRandomPassword(12);
            const hashPass = await bcrypt.hash(randomPassword, 10);

            const user = new Users({
                login,
                password: hashPass,
                email
            })
            await user.save()
            return res.json({error:'Account create successfully',user:{login,randomPassword}});
        } catch (error) {
            console.log('Server Error', error)
            return res.status(500).json( `Server Error` )
        }
    }
  ];

  exports.login = async(req,res)=>{
    const {login,password} = req.body
    try {
        const user = await Users.findOne({login})
        if(!user){
            console.log('User not found')
            return res.status(200).json({error:'Account not found'})
        }else{
        if(await bcrypt.compareSync(password,user.password)){
            if(user.verified){
                const token = jwt.sign({id:user.id},config.get("SECRET_JWT_KEY"),{expiresIn: '1h'})
                const accessPanel = user.roles.some(role => role.rank >= 4)
                dataUser={
                    login:login,
                    accessPanel:accessPanel,
                    balance:user.balance
                }
                return res.status(200).json({dataUser,token})
            }else{
                console.log('User not verified')
                return res.status(200).json({error:'Account not verified'})
            }
        }else{
            console.log('Wrong password')
            return res.status(200).json({error:'Wrong password'})
        }
    }
    } catch (e) {
        console.log('Server Error',e)
        return res.status(500).json( `Server Error` )
    }
  }

  exports.changePass = async (req, res) => {
    const { oldpassword, newpassword } = req.body;
    try {
        const userId = req.user.id;
        const user = await Users.findOne({ _id: userId });
        if (user) {
            if (await bcrypt.compareSync(oldpassword, user.password)) {
                const hashPass = await bcrypt.hash(newpassword, 10);
                user.password = hashPass;
                await user.save(); 
                return res.status(200).json({ message: 'Password changed successfully' });
            } else {
                return res.status(400).json({ error: 'Old password is incorrect' });
            }
        } else {
            return res.status(400).json({ error: 'Account does not exist' });
        }
    } catch (error) {
        console.log('Server Error', error);
        return res.status(500).json({ error: 'Server Error' });
    }
};

  exports.authUser = async(req,res)=>{

    try {
        
    } catch (error) {
        console.log('Server Error',e)
        return res.status(500).json(`Server Error`)
    }
  }

  exports.addUserServerRole = async(req,res)=>{
    const {serverName, nickname, rank} = req.body
    try {
        const server = await Servers.findOne({serverName})
        if (server){
            const user = await Users.findOne({login:nickname})
            if(user){
                user.roles.push({serverName:serverName,rank:rank})
                await user.save()
                return res.status(200).json({error:`Role added to user`})
            }
            else{
                return res.status(400).json({error:`User not found`})
            }
        }else{
            return res.status(400).json({error:`Server not found`})
        }
    } catch (error) {
        console.log('Server Error',error)
        res.status(500).json(`Server Error`)
    }
  }

  exports.getUserServers = async(req,res)=>{
    try {
        const userId = req.user.id
        const user = await Users.findById(userId)
        if(user){
            if(user.roles.some(roles => roles.rank == 10)){
                const userServers = await Servers.aggregate([ {$project: {serverName: 1,_id:0}}]);
                return res.status(200).json(userServers)
            }else{
                const userServers = await user.roles.map(serv=>({serverName:serv.serverName}))
                return res.status(200).json(userServers)
            }
        }else{
            console.log('User not found')
            return res.status(200).json('User not exist')
        }
    } catch (error) {
        console.log('Server Error',error)
        res.status(500).json(`Server Error`)
    }
  }