import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

syncGitRepo();

function syncGitRepo() {
  const accessToken = process.env.access_token;
  const repoName = process.env.repo_name;
  const branchName = process.env.branch_name;
  const useGitLfs = process.env.use_lfs === 'true';
  const repoUrl = accessToken
    ? `https://${accessToken}@github.com/${repoName}.git`
    : `https://github.com/${repoName}.git`;

  console.log(`Sync Git repository. Repository: ${repoName}, Branch: ${branchName}`);
  if (!existsSync(join(process.cwd(), '.git'))) {
    console.log("Cloning repository.");
    execCommand(`git clone --branch "${branchName}" --single-branch "${repoUrl}" .`);
  } else {
    console.log("Cleaning working directory.");
    execCommand("git clean -fd");
    execCommand("git reset --hard");

    console.log("Fetching latest changes from remote.");
    execCommand(`git fetch --prune "${repoUrl}" "refs/heads/*:refs/remotes/origin/*" -f`);

    try {
      console.log("Checking out the branch.");
      execSync(`git checkout "${branchName}"`);

      console.log("Syncing with remote branch.");
      execCommand(`git reset --hard "origin/${branchName}"`);
    } catch {
      console.log("Creating new tracking branch.");
      execCommand(`git checkout --track "origin/${branchName}"`);
    }
  }

  if (useGitLfs) {
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