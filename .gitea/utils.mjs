import { execSync } from 'child_process';
import fs, { writeFileSync } from 'fs';

// 1.6.9 -> 1.6.10-fix.20210922123456
export function patchVersion(version) {
    // -> 1.6.10
    const versionArr = version.split('.');
    const patch = parseInt(versionArr.pop()) + 1;
    versionArr.push(patch);
    let newVersion = versionArr.join('.');

    // -> 1.6.10-fix
    newVersion += '-fix';

    // -> 1.6.10-fix.20210922123456
    newVersion += `.${new Date()
        .toISOString()
        .replace(/[^0-9]/g, '')
        .slice(0, 12)}`;
    return newVersion;
}

export function isRunningInVSCode() {
    return process.env.TERM_PROGRAM === 'vscode' || typeof process.env.VSCODE_INJECTION !== 'undefined' || typeof process.env.VSCODE_GIT_IPC_HANDLE !== 'undefined';
}

export async function packTgz(cwd, pkgJson) {
    const pkgFile = cwd + '/package.json';
    execSync('rm -rf *.tgz', { stdio: 'inherit', cwd });
    writeFileSync(pkgFile, JSON.stringify(pkgJson, null, 2));
    const tgz = execSync('npm pack', { cwd, encoding: 'utf-8' });
    console.log('tgz :>> ', `${cwd}/${tgz.trim()}`);
    try {
        execSync(`git checkout ${pkgFile}`, { stdio: 'inherit' });
    } catch (e) {}
}

export function uploadTgz(cwd, repository) {
    const myHeaders = new Headers();

    myHeaders.append('Authorization', `Basic ${process.env.NEXUS_AUTH}`);

    const formdata = new FormData();

    const tgzName = fs.readdirSync(cwd).find((f) => f.endsWith('.tgz'));
    formdata.append('npm.asset', new File([fs.readFileSync(`${cwd}/${tgzName}`)], tgzName));

    fetch('https://nexus.oo1.dev/service/rest/v1/components?repository=' + repository, {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    }).then((response) => console.debug(`response :>> `, response));
}
