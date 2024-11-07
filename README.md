# sync-git-repository-action    
Used to synchronize a Git repository using a specified scripting language.

### Inputs
**language (Optional)**: Specifies the scripting language to use for sync the repository. Options are javascript or python. Default is javascript.  
**git_access_token (Optional)**: Git access token for authentication.  
**git_repo_name (Required)**: The repository to sync.  
**git_branch (Required)**: The branch to sync.  

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
          language: "javascript"   # Or "python", based on your preferred language
          git_access_token: ${{ secrets.YOUR_ACCESS_TOKEN }}
          git_repo_name: "your-repository-name"
          git_branch: "your-branch-name"
```