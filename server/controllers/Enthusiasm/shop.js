const Servers = require('../../models/server');
const Users = require('../../models/user')
const config = require('config');
const { sendBotBuyMessage } = require('../Bot/Dsbot');

exports.addItemToServerShop = async (req, res) => {
    const { serverName, itemData } = req.body;
    try {
            const server = await Servers.findOne({ serverName });
            if (server) {
                for (const { item, cost, category } of itemData) {
                    server.shop.push({ item, cost, category });
                }
                await server.save();
                res.status(200).json({error:'Item added to shop succesfully'})
            } else {
                console.error(`Server ${serverName} not found`);
                res.status(200).json({error:'Server not found'})
            }
    } catch (error) {
        console.log('Error adding items to shop:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getServerShop=async(req,res)=>{
    const {serverName} = req.body
    try {
        const server = await Servers.findOne({ serverName: serverName }, { 'shop.item': 1, 'shop.cost': 1, 'shop.category': 1 });
        const shop = server.shop
        res.status(200).json({shop})
    } catch (error) {
        console.log('Error take server shop:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.buyItems = async (req, res)=>{
    const {cart} = req.body;
    try {
        const userId = req.user.id;
        const user = await Users.findById(userId);
        if(user){
            if(cart == ''){
                return res.status(200).json({error:'Cart is empty'})
            }else{
                const privilegeItems = cart.filter(item => item.category === 'privilege');
                const otherItems = cart.filter(item => item.category !== 'privilege');
                console.log(privilegeItems)
                console.log(otherItems)
                if(privilegeItems.length>0){
                    sendBotBuyMessage(userName=user.login,config.get("role_id.curator"),config.get("channel_id"),buy=privilegeItems)
                }
                if(otherItems.length >0){
                    sendBotBuyMessage(userName=user.login,config.get("role_id.st"),config.get("channel_id"),buy=otherItems)
                }
                res.status(200).json({ error: 'Items processed successfully' });
            }
        } else {
            console.log('User not found');
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.log('Error buy items', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
