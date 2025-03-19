import Docker from 'dockerode';
const docker = new Docker();

const TARGET_IMAGE = "code-executor"; // Replace with your image name

async function getContainerStats() {
    try {
        // Get all running containers
        const containers = await docker.listContainers();

        // Filter containers by image
        const filteredContainers = containers.filter(container => container.Image.includes(TARGET_IMAGE));

        if (filteredContainers.length === 0) {
            console.log(`No containers found for image: ${TARGET_IMAGE}`);
            return;
        }

        // Fetch stats for each filtered container
        for (const containerInfo of filteredContainers) {
            const container = docker.getContainer(containerInfo.Id);

            container.stats({ stream: false }, (err, data) => {
                if (err) {
                    console.error(`Error fetching stats for ${containerInfo.Id}:`, err.message);
                } else {
                    const cpuDelta = data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage;
                    const systemDelta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
                    const cpuUsage = systemDelta > 0 ? (cpuDelta / systemDelta) * data.cpu_stats.online_cpus * 100 : 0;

                    const memoryUsage = data.memory_stats.usage;
                    const memoryLimit = data.memory_stats.limit;
                    const memoryPercentage = (memoryUsage / memoryLimit) * 100;

                    const networkUsage = data.networks ? Object.values(data.networks).reduce((acc, net) => ({
                        rx_bytes: acc.rx_bytes + net.rx_bytes,
                        tx_bytes: acc.tx_bytes + net.tx_bytes
                    }), { rx_bytes: 0, tx_bytes: 0 }) : { rx_bytes: 0, tx_bytes: 0 };

                    console.log(`Stats for ${containerInfo.Id} (${containerInfo.Names[0]}):`);
                    console.log(`  CPU Usage: ${cpuUsage.toFixed(2)}%`);
                    console.log(`  Memory Usage: ${(memoryUsage / (1024 * 1024)).toFixed(2)} MB (${memoryPercentage.toFixed(2)}%)`);
                    console.log(`  Network: Received ${networkUsage.rx_bytes} bytes, Sent ${networkUsage.tx_bytes} bytes\n`);
                }
            });
        }
    } catch (error) {
        console.error("Error fetching containers:", error.message);
    }
}

getContainerStats();
