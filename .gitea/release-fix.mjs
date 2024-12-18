import { execSync } from 'child_process';
import fs, { writeFileSync } from 'fs';
import pkg from '../package.json' with { type: 'json' };

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
    writeFileSync(
        'packages/primevue/dist/package.json',
        JSON.stringify(
            {
                name: 'primevue',
                version: `${newVersion}`,
                sideEffects: ['*.vue'],
                main: './index.mjs',
                module: './index.mjs',
                types: './index.d.ts',
                unpkg: 'umd/primevue.min.js',
                jsdelivr: 'umd/primevue.min.js',
                'web-types': './web-types.json',
                vetur: {
                    tags: './vetur-tags.json',
                    attributes: './vetur-attributes.json'
                },
                exports: {
                    '.': {
                        types: './index.d.ts',
                        import: './index.mjs',
                        default: './index.mjs'
                    },
                    './*': {
                        types: './*/index.d.ts',
                        import: './*/index.mjs',
                        default: './*/index.mjs'
                    }
                },
                dependencies: {
                    '@primeuix/styled': '^0.3.2',
                    '@primeuix/utils': '^0.3.2',
                    '@primevue/core': '4.2.5',
                    '@primevue/icons': '4.2.5'
                },
                engines: {
                    node: '>=12.11.0'
                }
            },
            null,
            2
        )
    );
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

// https://nexus.oo1.dev/service/rest/repository/browse/npm-hosted/
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
