# sync-git-repo-action
Used for synchronizing a Git repository. Supports cross-platform.  
This action synchronizes the local Git branch with the target branch or tag, ensuring it reflects the latest state of the remote repository.

### Requirements
- **Git**: Git 2.23 or higher must be installed and accessible from the command line.
- **Git-LFS**: If use_lfs is enabled, Git Large File Storage (LFS) must be installed.

### Inputs
- **repo_path (Optional)**: The path to the repository to sync. Defaults to github.workspace.
- **git_server (Optional)**: The Git server to sync. Defaults to github.com.
- **use_ssh (Optional)**: Use SSH for Git authentication. Defaults to false.
- **personal_access_token (Optional)**: Personal Access Token (PAT) for Git authentication. Defaults to github.actor:github.token.
- **repo_name (Optional)**: The repository to sync. Defaults to github.repository.
- **ref_name (Optional)**: The branch or tag to sync. Defaults to github.ref_name.
- **deep_clean (Optional)**: If true, uses the --ffdx flag to remove all untracked and ignored files; otherwise, uses -ffd to remove only untracked files. Defaults to false.
- **use_lfs (Optional)**: Enable Git LFS for large file support. Defaults to false.

### Usage
```yaml
- name: Synchronize Git Repository
  uses: Wtzd8645/sync-git-repo-action@v1
  with:
    personal_access_token: ${{ secrets.YOUR_PAT }}
    use_lfs: true
```