import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

function runCommand(command) {
  try {
    const output = execSync(command, { stdio: 'inherit' });
    if (output) {
      console.log(output.toString());
    }
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

function syncGitRepository() {
  const gitAccessToken = process.env.git_access_token;
  const gitRepoName = process.env.git_repo_name;
  const gitBranch = process.env.git_branch;

  const repoUrl = gitAccessToken 
      ? `https://${gitAccessToken}@github.com/${gitRepoName}.git` 
      : `https://github.com/${gitRepoName}.git`;
  
  console.log(`Sync Git repository. Name: ${gitRepoName}, Branch: ${gitBranch}`);
  if (!existsSync(join(process.cwd(), '.git'))) {
    console.log("Cloning repository.");
    runCommand(`git clone --branch "${gitBranch}" --single-branch "${repoUrl}" .`);
  } else {
    console.log("Cleaning working directory.");
    runCommand("git clean -fd");

    console.log("Fetching latest changes from remote.");
    runCommand(`git fetch --prune "${repoUrl}" "refs/heads/*:refs/remotes/origin/*" -f`);

    const currBranch = execSync("git branch --show-current", { encoding: 'utf-8' }).trim();
    if (currBranch !== gitBranch) {
      runCommand("git reset --hard");

      const branchExists = execSync(`git show-ref --verify refs/heads/${gitBranch}`, { stdio: 'pipe' }).toString().trim();
      if (!branchExists) {
        console.log("Creating new tracking branch.");
        runCommand(`git checkout --track "origin/${gitBranch}"`);
      } else {
        console.log("Checking out the branch.");
        runCommand(`git checkout "${gitBranch}"`);
      }
    }

    console.log("Syncing with remote branch.");
    runCommand(`git reset --hard "origin/${gitBranch}"`);
  }
}

syncGitRepository();