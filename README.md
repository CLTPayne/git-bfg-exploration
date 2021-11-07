# Git BFG Exploration

A minimal project to recreate an environment where a project secret had been committed to a repository. PRs and commits have been made to simulate the situation I was tasked with resolving. In reality though an secret that is pushed to a remote repository should be considered leaked.

Tool used to rewrite githistory - [BFG Repo Cleaner](https://rtyley.github.io/bfg-repo-cleaner/).

Alternative tools - `git-filter-branch`.

This process can also be used to strip out excessively large files from a project history.

#### Project Goals:

1. Practise running BFG Repo Cleaner in a project that does not matter, in case a mistake impacts the full git history.
2. Explore the impact of the synthetic references that GitHub adds to PRs, and thus why you need to contact GitHub customer serivce, after running BFG Repo Cleaner to remove PRs that reference the secret and run garbage collection.

#### User Stories:

```
As a business
So that I can sleep easy at night
I need to know that API secrets are not living in any git history.
```

#### How to remove secrets in git history:

1. From a parent directory, where you store you projects, create a mirror clone of the project you want to rewrite history. `--mirror` creates a complete copy with all refs: remote-tracking branches, notes, refs/originals/\* (backups from filter-branch).

```
git clone --mirror  https://github.com/CLTPayne/git-bfg-exploration.git
```

2. Create a text file with the secret you want to overwrite:

```
echo "COOL_SECRET" > secrets.txt
```

3. Run the BFG Repo Cleaner from the location you downloaded it to (update the package version and path as per the version you are using). Pass in the list of strings you want to replace, that your stored in the above file:

```
java -jar ~/Downloads/bfg-1.14.0.jar --replace-text secrets.txt git-bfg-exploration.git
```

This will update all commits and branches to 'clean' away the secret.

4. Change directory, and move inside the mirrored git repository:

```
cd git-bfg-exploration.git
```

5. To physically delete the unwanted secret, use [`git gc`](https://git-scm.com/docs/git-gc) to cleanup the now unnecessary (and unwanted) data.

```
git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

6. When you're ready (and you've checked the local repository now has `***REMOVED***` in place of the unwanted secret) push the changes to your remote server:

```
git push --force
```

NOTE: You will see errors for the non updated PR references when pushing to GitHub. These can only be removed by GitHub customer service.
