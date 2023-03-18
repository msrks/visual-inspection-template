# Visual Inspection Template

## GitOps

```sh
export REPO=visual-inspection-template
git init
gh repo create $REPO --private
git remote add origin https://github.com/msrks/$REPO.git
git add -A
git commit -m "add: README.md"
git push -u origin master
```
