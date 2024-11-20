# sync-git-repo-action
Used for synchronizing a Git repository. Supports cross-platform.  
This action checks the status of the local Git repository and determines the appropriate steps to update it to match the latest status of the remote repository.

### Requirements
- **Git**: Git must be installed and accessible from the command line.
- **Git-LFS**: If use_lfs is enabled, Git Large File Storage (LFS) must be installed.

### Inputs
- **personal_access_token (Optional)**: Personal Access Token (PAT) for Git authentication. Defaults to the GITHUB_TOKEN.  
- **repository (Optional)**: The repository to sync. Defaults to the current repository.
- **branch (Optional)**: The branch to sync. Defaults to the current branch.
- **use_lfs (Optional)**: Enable Git LFS for large file support. Defaults to false.

### Usage
```yaml
- name: Synchronize Git Repository
  uses: Wtzd8645/sync-git-repo-action@v1
  with:
    personal_access_token: ${{ secrets.YOUR_PAT }}
    use_lfs: true
```