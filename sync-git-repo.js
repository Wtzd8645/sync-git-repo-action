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
  const pat = process.env.personal_access_token;
  const repository = process.env.repository;
  const branch = process.env.branch;
  const useLfs = process.env.use_lfs === 'true';
  const url = pat
    ? `https://${pat}@github.com/${repository}.git`
    : `https://github.com/${repository}.git`;

  console.log(`Sync Git repository. Repository: ${repository}, Branch: ${branch}`);
  if (!existsSync(join(process.cwd(), '.git'))) {
    console.log("Cloning repository.");
    execCmd(`git clone --branch "${branch}" --single-branch "${url}" .`);
  } else {
    console.log("Cleaning working directory.");
    execCmd("git clean -fd");
    execCmd("git reset --hard");

    console.log("Fetching latest changes from remote.");
    execCmd(`git fetch --prune "${url}" "refs/heads/${branch}:refs/remotes/origin/${branch}" -f`);

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

  if (useLfs) {
    console.log("Syncing LFS files.");
    execCmd("git lfs install");
    execCmd("git lfs pull");
  }
}

function execCmd(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}