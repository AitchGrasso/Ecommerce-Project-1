# Contributing to TechTonic - Ecommerce Template

This README provides a step-by-step guide on how we organize this project using GitHub, where multiple contributors can work on the same project without overwriting each other's changes. This approach involves forking your own repository and working on separate branches. 

## Workflow Overview

1. **Fork the Repository**
2. **Clone the Repository**
3. **Create a Branch**
4. **Make Changes**
5. **Commit and Push Changes**
6. **Create a Pull Request**
7. **Review and Merge**
8. **Update Local Repository**
9. **Repeat the Process**

## Detailed Workflow

1. **Fork the Repository**: Each contributor should start by forking the main repository. This creates a personal copy of the repository under each contributor's GitHub account.

2. **Clone the Repository**: Each contributor should clone their forked repository to their local machine using Git. This creates a local copy of the project on their computer.

3. **Create a Branch**: Each contributor should create a new branch in their local repository to work on their changes. Branches allow contributors to isolate their work from the main branch and other contributors' branches.

```git checkout -b branch-name```

Replace `branch-name` with a meaningful name for the branch, such as the feature or issue being worked on.

4. **Make Changes**: Contributors can now make their desired changes to the codebase on their local branch. They can add, modify, or delete files as necessary.

5. **Commit and Push Changes**: Once the changes are made, contributors should commit their changes to the local branch and push the branch to their forked repository on GitHub.

```
git add .
git commit -m "Add a descriptive commit message"
git push origin branch-name
```

Replace `branch-name` with the name of the branch created in step 3.

6. **Create a Pull Request**: After pushing the changes to their forked repository, each contributor can create a pull request (PR) from their branch to the main repository. This informs the project maintainer(s) about the proposed changes.
- On the main repository's GitHub page, click on the "New pull request" button.
- Select the branch you created in step 3 to compare with the main branch.
- Review the changes, add a description, and create the pull request.

7. **Review and Merge**: The project maintainer(s) or other designated contributors can review the pull request, provide feedback, and suggest changes if needed. Once the changes are reviewed and approved, the pull request can be merged into the main branch. Merging incorporates the changes made by the contributor into the main project while preserving everyone else's work.

8. **Update Local Repository**: After the pull request is merged, contributors should update their local repository with the latest changes from the main branch. This ensures that they have the most up-to-date codebase for further contributions.

```
git checkout main
git pull upstream main
```

The `upstream` remote refers to the original repository you forked from. You should add it as a remote to your local repository before running the `git pull` command.

9. **Repeat the Process**: Contributors can repeat steps 3-8 to work on new features, bug fixes, or improvements, always creating new branches for their changes.

By following this workflow, each contributor can work independently on their own branches, contribute their changes, and avoid overwriting each other's work. It also allows for better collaboration and code review before integrating changes into the main project.
