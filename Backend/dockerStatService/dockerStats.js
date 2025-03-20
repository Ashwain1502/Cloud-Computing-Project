import Docker from 'dockerode';
import { getContainerIDandPorts } from './dockerContainerIDs.js';

const docker = new Docker();
export let containerPortMap;
export let statsArray = [];
export async function getContainerStats() {
    try {
        getContainerIDandPorts().then(info => {
            containerPortMap = info;

            if (Object.keys(containerPortMap).length === 0) {
                console.log("No containers found to fetch stats for.");
                return;
            }

            setInterval(async () => {
                const tempStatsArray = [];

                for (const containerId of Object.keys(containerPortMap)) {
                    const container = docker.getContainer(containerId);

                    container.stats({ stream: false }, (err, data) => {
                        if (err) {
                            console.error(`Error fetching stats for ${containerId}:`, err.message);
                        } else {
                            const cpuDelta = data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage;
                            const systemDelta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
                            const cpuUsage = systemDelta > 0 ? (cpuDelta / systemDelta) * data.cpu_stats.online_cpus * 100 : 0;

                            const memoryUsage = data.memory_stats.usage;
                            const memoryLimit = data.memory_stats.limit;
                            const memoryPercentage = (memoryUsage / memoryLimit) * 100;

                            tempStatsArray.push({
                                containerId,
                                cpuUsage: cpuUsage.toFixed(2),
                                memoryUsage: (memoryUsage / (1024 * 1024)).toFixed(2), // Convert to MB
                                memoryPercentage: memoryPercentage.toFixed(2)
                            });



                            // Check if all containers' stats are collected
                            if (tempStatsArray.length === Object.keys(containerPortMap).length) {
                                // Sort by CPU usage (ascending order)
                                tempStatsArray.sort((a, b) => parseFloat(a.cpuUsage) - parseFloat(b.cpuUsage));
                                statsArray = tempStatsArray;

                                statsArray.forEach(stat => {
                                    console.log(`Container ${stat.containerId}:`);
                                    console.log(`  CPU Usage: ${stat.cpuUsage}%`);
                                    console.log(`  Memory Usage: ${stat.memoryUsage} MB (${stat.memoryPercentage}%)\n`);
                                });
                            }
                        }
                    });
                }
            }, 1000); 
        });
    } catch (error) {
        console.error("Error fetching container stats:", error.message);
    }
}



