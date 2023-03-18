# Visual Inspection Template

## Console

- [gcp](https://console.cloud.google.com/vertex-ai?referrer=search&authuser=0&project=visual-inspection-template)
- [firestore](https://console.firebase.google.com/u/0/project/visual-inspection-template/firestore/data/~2F?hl=ja)

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
