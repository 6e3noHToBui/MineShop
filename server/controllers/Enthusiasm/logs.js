const Server = require('../../models/server');
const axios = require('axios');
const cheerio = require('cheerio');
const config = require('config');
const fs = require('fs');
const readline = require('readline');
const moment = require('moment');
const { time } = require('console');


exports.parseServerLogs = async (req, res) => {
    try {
        const response = await axios.get(config.get("link.Enthusiasm.logs"));
        const html = response.data;
        const $ = cheerio.load(html);

        const serverInfo = [];
        const serverLinks = $('body a');

        for (let i = 0; i < serverLinks.length; i++) {
            const element = $(serverLinks[i]);
            const server = element.text();
            const serverLink = element.attr('href').replace(' ', '%20');
            const serverData = {
                server: server,
                links: url + serverLink
            };

            const serverResponse = await axios.get(serverData.links);
            const serverHtml = serverResponse.data;
            const server$ = cheerio.load(serverHtml);

            const additionalLinks = server$('body a');
            const additionalLinksArray = [];

            additionalLinks.each((index, additionalLink) => {
                const linkText = server$(additionalLink).text();
                const linkHref = server$(additionalLink).attr('href').replace(' ', '%20');
                additionalLinksArray.push({
                    text: linkText,
                    href: url + linkHref
                });
            });

            serverData.additionalLinks = additionalLinksArray;
            serverInfo.push(serverData);
        }

        res.json(serverInfo);
    } catch (error) {
        console.error('Error fetching logs:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function parseHitech1710Logs(name, logLink, startDate, endDate) {

    let currentDate = startDate;
    let totalMinutes = 0;
    let totalVanishMinutes = 0;
    let isInVanish = false;
    let globalMsg = 0;
    let localMsg = 0
    let totalDays = 0
    let ban = 0, tempBan = 0, tempMute = 0, kick = 0, warn = 0, mute = 0
    let isEnter = null
    let enterTime = null;
    let vanishEnterTime = null;

    while (currentDate <= endDate) {
        const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
        totalDays += 1;

        if (isEnter == true){
            isEnter = false
            const endday = moment(enterTime).endOf('day')
            const duration = moment.duration(endday.diff(enterTime))
            totalMinutes += duration.asHours()
        }

        try {
            const response = await axios.get(`${logLink}/${formattedDate}.txt`, { timeout: 2000, maxContentLength: 10000000 });
            const log = response.data;
            const lines = log.split('\n');

            for (const line of lines) {
                const timestampMatch = /\[(\d{2}\.\d{2}.\d{4} \d{2}:\d{2}:\d{2})\]/.exec(line);

                if (timestampMatch) {
                    const timestamp = moment(timestampMatch[1], 'DD.MM.YYYY HH:mm:ss');

                    if (line.includes(`${name} зашёл`)) {
                        enterTime = timestamp;
                        isInVanish = false;
                        isEnter = true;
                    }

                    if (line.includes(`${name} вышел`) && isEnter === true) {
                        const exitTime = timestamp;
                        const duration = moment.duration(exitTime.diff(enterTime));
                        totalMinutes += duration.asHours();
                        isEnter = false;
                    } else if (line.includes(`${name} вышел`) && isEnter === false) {
                        const exitTime = timestamp;
                        const midnight = moment(exitTime).startOf('day');
                        const duration = moment.duration(exitTime.diff(midnight));
                        totalMinutes += duration.asHours();
                        isEnter = false;
                    }

                    if (line.includes(`${name} issued server command: /vanish`)) {
                        if (!isInVanish) {
                            vanishEnterTime = timestamp;
                            isInVanish = true;
                        } else if (isInVanish) {
                            const vanishExitTime = timestamp;
                            const duration = moment.duration(vanishExitTime.diff(vanishEnterTime));
                            totalVanishMinutes += duration.asHours();
                            isInVanish = false;
                        }
                    }
                }

                if (line.includes(`[G] ${name}`)) {
                    globalMsg += 1;
                }
                if (line.includes(`[L] ${name}`)) {
                    localMsg += 1;
                }
                if (line.includes(`${name} issued server command: /ban `)) {
                    ban += 1;
                }

                if (line.includes(`${name} issued server command: /mute `)) {
                    mute += 1;
                }

                if (line.includes(`${name} issued server command: /tempban `)) {
                    tempBan += 1;
                }
                if (line.includes(`${name} issued server command: /tempmute `)) {
                    tempMute += 1;
                }
                if (line.includes(`${name} issued server command: /kick `)) {
                    kick += 1;
                }
                if (line.includes(`${name} issued server command: /warn `)) {
                    warn += 1;
                }
            }
        } catch (error) {
            console.error(`Error fetching log for date ${formattedDate}:`, error.message);
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }
    const totalVanishHours = totalVanishMinutes
    const totalHours = totalMinutes-totalVanishHours
    const avgTime = (totalHours / totalDays)
    console.log(`${name},${totalVanishHours}, ${totalHours}`)
    return {
        name,
        totalVanishHours: totalVanishHours.toFixed(2),
        totalHours: totalHours.toFixed(2),
        avgTime: avgTime.toFixed(2),
        globalMsg,
        localMsg,
        warn,
        ban,
        tempBan,
        tempMute,
        mute,
        kick
    }
}

module.exports = { parseHitech1710Logs }