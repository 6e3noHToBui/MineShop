const config = require('config')
const Servers = require('../../models/server')
const {parseHitech1710Logs} = require('./logs');

exports.getServerCrew = async (req, res) => {
    const {serverName} = req.body
    try {
        const serverId = await Servers.findOne({serverName:serverName})
        if(serverId){
            const crews = serverId.crewList.map(mod =>({name: mod.name,rank: mod.rank}))
            console.log("Crew list fetched")
            return res.status(200).json(crews)
        }else{
            console.log("Crew list is empty")
            return res.status(200).json("Crew list is empty")
        }
    } catch (error) {
        console.error('Error fetching server crew:', error.message)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
};

exports.getServerCrewStats = async (req,res)=>{
    const {serverName,startDate, endDate} = req.body
    try {
        const server = await Servers.findOne({serverName:serverName})
        const logLink = server.logLink
        if(server){
            const crews = server.crewList.map(mod=>({name:mod.name, rank:mod.rank}))
            const crewStats = [];

            console.log("Start fetching crew stats from:", serverName)

            for (const crew of crews) {
                const { name, totalVanishHours, totalHours, avgTime, globalMsg, localMsg,warn, ban, tempBan, tempMute,kick } = await parseHitech1710Logs(crew.name, logLink, new Date(startDate), new Date(endDate));
                crewStats.push({ name, totalVanishHours, totalHours, avgTime, globalMsg, localMsg,warn, ban, tempBan, tempMute,kick });
            }
            console.log("Fetching stats succesfully! Server:", serverName)
            res.status(200).json({crewStats})
        }
    } catch (error) {
        console.error('Error fetching server crew stats:', error.message)
        res.status(500).json({error:'Internal Server Error'})
    }
}