const axios = require('axios')
const config = require('config')
const Servers = require('../../models/server');

exports.parseServersData = async (req, res) => {
    try {
        await Servers.deleteMany({});
        const response = await axios.get(config.get("link.Enthusiasm.crew"))
        const parsedData = response.data

        const serversData = parsedData.map(serv=>({
            serverTitle: serv.title,
            mods: serv.moders.map(moderator=>({
                modername: moderator.name,
                modergroup: moderator.group
            }))}))

        for (const servers of serversData) {
                const serverRecord = new Servers({
                    serverName: servers.serverTitle,
                    crewList: servers.mods.map(mod => ({
                        name: mod.modername,
                        rank: mod.modergroup
                    }))
                });
                await serverRecord.save();}
        console.log("Server list and crew fetch succesfully")
        res.status(200).json("Server list and crew fetch succesfully")
    } catch (error) {
        console.error('Error fetching enthusiasm crew:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
};

exports.getServersData = async (req, res) => {
    try{
        const data = req.body
    if (data.serverName){
        const {serverName} = data
        const server= await Servers.findOne({serverName:serverName},{'crewList.name':1,'crewList.rank':1,'_id':0})
        res.status(200).json(server)
    }else{
            const servers = await Servers.aggregate([
                {$project: {serverName: 1,crewList: {$map: {input: "$crewList",as: "crew",in: {name: "$$crew.name",rank: "$$crew.rank"}}},_id:0}}]);
            res.status(200).json(servers);           
        }
    } catch (error) {
        console.error('Error fetching servers data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
