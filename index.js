import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

function main() {
  const repoPath = process.env.repo_path;
  const gitServer = process.env.git_server || 'github.com';
  const useSsh = process.env.use_ssh === 'true';
  const pat = process.env.personal_access_token;
  const repoName = process.env.repo_name;
  const refName = process.env.ref_name;
  const cleanArg = process.env.deep_clean === 'true' ? '-ffdx' : '-ffd';
  const useLfs = process.env.use_lfs === 'true';

  try {
    repoPath && process.chdir(repoPath);

    const gitUrl = getGitUrl(gitServer, repoName, useSsh, pat);
    if (!existsSync(join(process.cwd(), '.git'))) {
      console.log("Cloning repository.");
      execCmd(`git clone --no-tags --single-branch "${gitUrl}" .`);
    }

    console.log(`Fetching latest changes from remote. RefName: ${refName}`);
    const isTagRef = execCmdAndCapture(`git ls-remote --tags "${gitUrl}" "${refName}"`).trim() !== '';
    execCmd(`git fetch -f --prune --prune-tags "${gitUrl}" "${getFetchRefSpec(isTagRef, refName)}"`);

    console.log("Cleaning working directory.");
    execCmd(`git clean ${cleanArg}`);

    console.log("Checking out the branch.");
    execCmd(`git switch -f ${isTagRef ? '--detach ' : ''}"${refName}"`);

    console.log("Syncing with remote branch.");
    execCmd(`git reset --hard "${getResetPathSpec(isTagRef, refName)}"`);

    console.log("Cleaning submodules.");
    execCmd(`git submodule foreach --recursive git clean ${cleanArg}`);
    execCmd("git submodule foreach --recursive git reset --hard");

    console.log("Updating submodules.");
    execCmd("git submodule sync");
    execCmd("git submodule update --init --recursive");

    if (useLfs) {
      console.log("Ensuring LFS is installed.");
      execCmd("git lfs install");

      console.log("Syncing LFS files.");
      execCmd("git lfs pull");
      execCmd("git submodule foreach --recursive git lfs pull");
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

function getGitUrl(gitServer, repository, useSsh, pat) {
  if (useSsh) {
    return `git@${gitServer}:${repository}.git`;
  } else if (pat) {
    return `https://${pat}@${gitServer}/${repository}.git`;
  } else {
    return `https://${gitServer}/${repository}.git`;
  }
}

function getFetchRefSpec(isTag, refName) {
  return isTag ? `refs/tags/${refName}:refs/tags/${refName}` : `refs/heads/${refName}:refs/remotes/origin/${refName}`;
}

function getResetPathSpec(isTag, refName) {
  return isTag ? refName : `origin/${refName}`;
}

function execCmd(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

function execCmdAndCapture(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
}

main();