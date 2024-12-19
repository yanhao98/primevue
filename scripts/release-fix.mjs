import { execSync } from 'child_process';
import fs, { writeFileSync } from 'fs';
import pkg from '../package.json' with { type: 'json' };
import pkg_primevue from '../packages/primevue/package.json' with { type: 'json' };

let newVersion = execSync('npm version patch --no-git-tag-version', { encoding: 'utf-8' });

console.debug(`newVersion :>> `, newVersion);

newVersion = newVersion.replace(/^v/, '').trim();
newVersion += '-fix';
newVersion += `.${new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .substring(0, 12)}`;
const tgzName = `primevue-${newVersion}.tgz`;

console.debug(`newVersion :>> `, newVersion);
console.debug(`tgzName :>> `, tgzName);

pkg.version = newVersion;
writeFileSync('package.json', JSON.stringify(pkg, null, 2));

function build() {
    let buildCommand = `pnpm --filter primevue build`;

    console.debug(`buildCommand :>> `, buildCommand);
    execSync(buildCommand, { stdio: 'inherit' });
}

function publish() {
    let publishCommand = `pnpm publish --filter primevue --no-git-checks --access public`;

    publishCommand += ' --tag latest';
    publishCommand += ' --dry-run';
    publishCommand += ' --registry https://nexus.oo1.dev/repository/npm-hosted/';
    console.debug(`publishCommand :>> `, publishCommand);
    execSync(publishCommand, { stdio: 'inherit' });
}

function pack() {
    delete pkg_primevue.dependencies;
    writeFileSync('packages/primevue/dist/package.json', JSON.stringify(pkg_primevue, null, 2));

    // https://nexus.oo1.dev/#browse/upload:npm-hosted

    let packCommand = `npm pack`;

    console.debug(`packCommand :>> `, packCommand);
    execSync(packCommand, { stdio: 'inherit', cwd: process.cwd() + '/packages/primevue/dist' });
}

function upload() {
    const myHeaders = new Headers();

    myHeaders.append('Authorization', `Basic ${process.env.NEXUS_AUTH}`);

    const formdata = new FormData();

    formdata.append('npm.asset', new File([fs.readFileSync(`packages/primevue/dist/${tgzName}`)], tgzName));

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    fetch('https://nexus.oo1.dev/service/rest/v1/components?repository=npm-hosted', requestOptions).then((response) => console.debug(`response :>> `, response));
}

function list() {
    fetch('https://nexus.oo1.dev/service/rest/v1/components?repository=npm-hosted', {
        method: 'GET'
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.debug(`data :>> `, data);
        });
}

build();
// publish();
pack();
upload();
