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

#### What to do if you've lost something!

A few days after the PRs diffs and references had been deleted I noticed some missing documentation in our project. I could see the PR merged to `main` successfully so my guess is that I must have not merged the PR before I made the `--mirror` clone and did the history rewrite, or I somehow was missing some commits. Luckily it was my own PR so I spotted it… and it was only documentation (although it was a lot of info and I’d deleted the notes I had used to create it).

I still had the `--mirror` clone I had made the changes to locally and a back up of the repository (a regular clone though).

Gooling to understand what I had left in the `--mirror` cloned `.git` repo, this was the most useful and got me to the stage of viewing the PR ref I had lost and needed (`pull/26/` in my case)! https://www.jvt.me/posts/2019/01/19/git-ref-github-pull-requests/

1. Show all the available references (which I could also see in the `packed-refs` file):

```
git show-ref
```

2. Log the last commit for the PR you want to restore:

```
git log -1 pull/26/head
```

3. Log the content of that commit:

```
git show -1 pull/26/head
```

All the info I needed was in a single commit and it was markdown so I just copied the logged changes from this command, then recommitted them to the project in a new PR.

I'm sure there are better ways to do this recovery but I was very glad I still had the `--mirror` clone and recommend keeping it for a few weeks after the PR refs are removed!
