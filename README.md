# sync-git-repository-action

### Requirements
The action requires Git to be installed and accessible from the command line.

### Inputs
- **access_token (Optional)**: Git access token for authentication.  
- **repo_name (Optional)**: The repository to sync. Defaults to the current repository.
- **branch_name (Optional)**: The branch to sync. Defaults to the current branch.
- **use_lfs (Optional)**: Enable Git LFS for large file support. Accepts "true" or "false". Default is "false".

### Usage 
Here’s how to use this action in a GitHub workflow:  
```yaml
jobs:
  sync-repo:
    runs-on: ubuntu-latest
    steps:
      - name: Sync Git Repository
        uses: Wtzd8645/sync-git-repository-action@master
        with:
          access_token: ${{ secrets.YOUR_ACCESS_TOKEN }}
          enable_git_lfs: true
```