import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

try {
  syncGitRepo();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

function syncGitRepo() {
  const gitServer = process.env.git_server || 'github.com';
  const repository = process.env.repository;
  const branch = process.env.branch;
  const useLfs = process.env.use_lfs === 'true';  
  
  const gitUrl = getGitUrl(gitServer, repository);
  console.log(`Sync Git repository. Server: ${gitServer}, Repository: ${repository}, Branch: ${branch}`);
  if (!existsSync(join(process.cwd(), '.git'))) {
    console.log("Cloning repository.");
    execCmd(`git clone --branch "${branch}" --single-branch "${gitUrl}" .`);
  } else {
    console.log("Cleaning working directory.");
    execCmd("git clean -fd");
    execCmd("git reset --hard");

    console.log("Fetching latest changes from remote.");
    execCmd(`git fetch --prune "${gitUrl}" "refs/heads/${branch}:refs/remotes/origin/${branch}" -f`);

    try {
      console.log("Checking out the branch.");
      execCmd(`git checkout "${branch}"`);
    } catch {
      console.log("Creating new tracking branch.");
      execCmd(`git checkout --track "origin/${branch}"`);
    }

    console.log("Syncing with remote branch.");
    execCmd(`git reset --hard "origin/${branch}"`);
  }

  console.log("Cleaning submodules.");
  execCmd("git submodule foreach --recursive git clean -fd");
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
}

function getGitUrl(gitServer, repository) {
  const useSsh = process.env.use_ssh === 'true';
  const pat = process.env.personal_access_token;  

  if (useSsh) {
    return `git@${gitServer}:${repository}.git`;
  } else if (pat) {
    return `https://${pat}@${gitServer}/${repository}.git`;
  } else {
    return `https://${gitServer}/${repository}.git`;
  }
}

function execCmd(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}