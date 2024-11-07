import os
import subprocess

def run_command(command):
    result = subprocess.run(command, shell=True, text=True, capture_output=True)
    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr)
    return result.returncode == 0

def sync_git_repository():
    git_access_token = os.getenv('git_access_token')
    git_repo_name = os.getenv('git_repo_name')
    git_branch = os.getenv('git_branch')
    enable_git_lfs = os.getenv('enable_git_lfs') == 'true'

    if git_access_token:
        repo_url = f"https://{git_access_token}@github.com/{git_repo_name}.git"
    else:
        repo_url = f"https://github.com/{git_repo_name}.git"

    print(f"Sync Git repository. Name: {git_repo_name}, Branch: {git_branch}")
    if not os.path.exists(".git"):
        print("Cloning repository.")
        run_command(f'git clone --branch "{git_branch}" --single-branch "{repo_url}" .')
    else:
        print("Cleaning working directory.")
        run_command("git clean -fd")

        print("Fetching latest changes from remote.")
        run_command(f'git fetch --prune "{repo_url}" "refs/heads/*:refs/remotes/origin/*" -f')

        curr_branch = subprocess.check_output("git branch --show-current", shell=True, text=True).strip()
        if curr_branch != git_branch:
            run_command("git reset --hard")

            branch_exists = run_command(f'git show-ref --verify refs/heads/{git_branch}')
            if not branch_exists:
                print("Creating new tracking branch.")
                run_command(f'git checkout --track "origin/{git_branch}"')
            else:
                print("Checking out the branch.")
                run_command(f'git checkout "{git_branch}"')
    
    print("Syncing with remote branch.")
    run_command(f'git reset --hard "origin/{git_branch}"')

    if enable_git_lfs:
        print("Update LFS files.")
        run_command('git lfs install')
        run_command('git lfs pull')

sync_git_repository()