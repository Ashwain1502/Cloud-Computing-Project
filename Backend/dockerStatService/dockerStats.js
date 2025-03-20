import Docker from 'dockerode';
import { getContainerIDandPorts } from './dockerContainerIDs.js';

const docker = new Docker();
export let containerPortMap;
async function getContainerStats() {
    try {

        getContainerIDandPorts().then(info => {
            containerPortMap = info;
            console.log("Container Port Map:", containerPortMap);

            if (Object.keys(containerPortMap).length === 0) {
                console.log("No containers found to fetch stats for.");
                return;
            }

            // Start the stats update timer
            setInterval(async () => {
                // Fetch stats for each container ID in containerPortMap
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

                            console.log(`Stats for ${containerId}:`);
                            console.log(`  CPU Usage: ${cpuUsage.toFixed(2)}%`);
                            console.log(`  Memory Usage: ${(memoryUsage / (1024 * 1024)).toFixed(2)} MB (${memoryPercentage.toFixed(2)}%)`);
                        }
                    });
                }
            }, 1000); // Fetch stats every second
        });
    } catch (error) {
        console.error("Error fetching container stats:", error.message);
    }
}


getContainerStats();
