# sync-git-repository-action    
Designed for synchronizing Git repositories. Implemented with scripting languages to support cross-platform compatibility.

### Inputs
- **language (Optional)**: Specifies the scripting language to use for sync the repository. Options are "javascript" or "python". Default is "javascript".  
- **git_access_token (Optional)**: Git access token for authentication.  
- **git_repo_name (Required)**: The repository to sync.  
- **git_branch (Required)**: The branch to sync.  
- **enable_git_lfs (Optional)**: Is enable Git LFS. Options are "true" or "false". Default is "false".

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
          git_access_token: ${{ secrets.YOUR_ACCESS_TOKEN }}
          git_repo_name: "your-repository-name"
          git_branch: "your-branch-name"
          enable_git_lfs: true
```