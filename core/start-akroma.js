const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const clientVersions = require('./client-versions');
const client = clientVersions.clients.akroma.platforms[os.platform()][os.arch()];
const clientPath = path.join(process.env.HOME + client.extract_path);
const clientBin = client.bin;

module.exports = {
    constants: {
        RUNNING: 'running',
        STOPPED: 'stopped',
        SYNCING: 'syncing',
        SYNCED: 'synced',
    },
    status: undefined,
    clientProcess: undefined,
    clientRunning: () => module.exports.status === module.exports.constants.RUNNING,
    startClient: () => {
        console.info('[Starting Akroma client...]');
        const process = spawn(clientPath + path.sep + clientBin, [
            '--datadir', clientPath + path.sep + '.akroma', '--syncmode', 'fast',
            '--cache', '1024', '--rpc', '--rpccorsdomain', '*', '--rpcport', '8545', '--rpcapi', 'eth,web3,admin,net,personal',
        ]);
        module.exports.clientProcess = process;
        module.exports.status = module.exports.constants.RUNNING;
        return process;
    },
    stopClient: () => {
        console.info('[Stopping Akroma client...]');
        module.exports.clientProcess.kill();
        return true
    },
};
