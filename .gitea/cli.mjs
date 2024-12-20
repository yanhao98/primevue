import { execSync } from 'child_process';
import fs from 'fs';
import { packTgz, patchVersion, uploadTgz } from './utils.mjs';

const packageCwd = process.cwd() + '/packages/primevue/dist';

function build() {
    let command = 'pnpm --filter primevue build';
    execSync(command, { stdio: 'inherit' });
}

async function generateNewJson(pkgFile = `${packageCwd}/package.json`) {
    const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));
    return {
        name: pkg.name,
        version: patchVersion(pkg.version),
        sideEffects: ['*.vue'],
        ...{ main: './index.mjs', module: './index.mjs', types: './index.d.ts' },
        'web-types': './web-types.json',
        vetur: { tags: './vetur-tags.json', attributes: './vetur-attributes.json' },
        exports: {
            '.': { types: './index.d.ts', import: './index.mjs', default: './index.mjs' },
            './*': { types: './*/index.d.ts', import: './*/index.mjs', default: './*/index.mjs' }
        },
        dependencies: {
            '@primeuix/styled': '*',
            '@primeuix/utils': '*',
            '@primevue/core': '*',
            '@primevue/icons': '*'
        }
    };
}

const command = process.argv[2];
switch (command) {
    case 'build':
        build();
        break;
    case 'pack':
        packTgz(packageCwd, await generateNewJson());
        break;
    case 'upload':
        uploadTgz(packageCwd, 'npm-hosted');
        break;
    default:
        console.log('Unknown command');
}
