import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

function syncGitRepository() {
  const gitAccessToken = process.env.git_access_token;
  const gitRepoName = process.env.git_repo_name;
  const gitBranch = process.env.git_branch;
  const enableGitLfs = process.env.enable_git_lfs === 'true';
  const repoUrl = gitAccessToken
    ? `https://${gitAccessToken}@github.com/${gitRepoName}.git`
    : `https://github.com/${gitRepoName}.git`;

  console.log(`Sync Git repository. Name: ${gitRepoName}, Branch: ${gitBranch}`);
  if (!existsSync(join(process.cwd(), '.git'))) {
    console.log("Cloning repository.");
    execCommand(`git clone --branch "${gitBranch}" --single-branch "${repoUrl}" .`);
  } else {
    console.log("Cleaning working directory.");
    execCommand("git clean -fd");
    execCommand("git reset --hard");

    console.log("Fetching latest changes from remote.");
    execCommand(`git fetch --prune "${repoUrl}" "refs/heads/*:refs/remotes/origin/*" -f`);

    try {
      console.log("Checking out the branch.");
      execCommand(`git checkout "${gitBranch}"`);

      console.log("Syncing with remote branch.");
      execCommand(`git reset --hard "origin/${gitBranch}"`);
    } catch {
      console.log("Creating new tracking branch.");
      execCommand(`git checkout --track "origin/${gitBranch}"`);
    }
  }

  if (enableGitLfs) {
    console.log("Syncing LFS files.");
    execCommand("git lfs install");
    execCommand("git lfs pull");
  }
}

function execCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

syncGitRepository();