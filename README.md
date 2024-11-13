# sync-git-repository-action
Used for synchronizing a Git repository. Supports cross-platform.  
This action checks the status of the local Git repository and determines the appropriate steps to update it to match the latest status of the remote repository.

### Requirements
- **Git**: Git must be installed and accessible from the command line.

### Inputs
- **access_token (Optional)**: Git access token for authentication.  
- **repo_name (Optional)**: The repository to sync. Defaults to the current repository.
- **branch_name (Optional)**: The branch to sync. Defaults to the current branch.
- **use_lfs (Optional)**: Enable Git LFS for large file support. Accepts "true" or "false". Default is "false".

### Usage
```yaml
- name: Sync Git Repository
  uses: Wtzd8645/sync-git-repository-action@v1
  with:
    access_token: ${{ secrets.YOUR_ACCESS_TOKEN }}
    use_lfs: true
```