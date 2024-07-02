const { spawn } = require('child_process');
const fs = require('fs');
const { join } = require('path');
const { Signale } = require('signale');

const args = process.argv.slice(2).toString();

const SERVERS = fs.readdirSync(join(__dirname, './src/servers'));

const [server, env = 'dev'] = args.split(':');

const ENVIRONMENTS = [
  {
    name: 'Development',
    alias: ['dev', 'development'],
  },
  {
    name: 'Testing',
    alias: ['test', 'testing'],
  },
  {
    name: 'Staging',
    alias: ['staging'],
  },
  {
    name: 'Production',
    alias: ['prod', 'production'],
  },
];

const isValidServer = SERVERS.includes(server);

if (!isValidServer) {
  console.info('Invalid Server', SERVERS);
  process.exit();
}

const environment = ENVIRONMENTS.find((e) => {
  return e.alias.includes(env);
});

const logger = new Signale({
  scope: `${env.toUpperCase()} ${server}`,
  disabled: ['test', 'testing'].includes(env),
  config: {
    displayTimestamp: true,
    displayBadge: true,
  },
});

if (!environment) {
  logger.info('Invalid environment. Valid options are: ', ENVIRONMENTS);
  process.exit();
}

if (environment.name.toLowerCase() === 'development') {
  logger.info('Development environment found, preparing');
  prepare(() => main());
} else {
  main();
}

async function prepare(cb) {
  const prepare = spawn('rimraf dist && tsc', { shell: true });

  prepare.stdout.on('data', (data) => {
    console.log(`${data}`);
  });

  prepare.stderr.on('data', (data) => {
    console.error(`${data}`);
  });

  prepare.on('close', (code) => {
    if (code === 0) {
      cb();
    } else {
      console.error('Yarn install failed');
    }
  });
}

async function main() {
  let child;

  const envArgs = {
    env: {
      ...process.env,
      NODE_ENV: environment.name.toUpperCase(),
    },
  };

  const script = `node -r tsconfig-paths/register -r source-map-support/register ./dist/servers/${server}/${server}.server.js`;

  if (['development', 'dev'].includes(env)) {
    logger.log(`Running ${server} in development mode. \n ${script}`);
    child = spawn(
      `tsc-watch --noClear --onSuccess "sh -c 'yarn tsc-alias -p tsconfig.json && ${script}'"`,
      {
        shell: true,
        stdio: 'inherit',
      },
      envArgs
    );
  } else {
    const [_, ...rest] = script.split(' ')
    child = spawn(
      'node',
      rest,
      {
        stdio: 'inherit',
      },
      envArgs
    );
  }

  child.on('close', (code) => {
    logger.fatal(`${server} process exited with code ${code}`);
  });
}
