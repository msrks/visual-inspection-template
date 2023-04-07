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

## Dir Structure

```txt
% git ls-tree -r --name-only HEAD | tree --fromfile -L 3 -d
.
├── .vscode
├── app
│   ├── _sampleImages
│   │   ├── barLight
│   │   └── domeLight
│   ├── components
│   │   ├── elements
│   │   ├── layouts
│   │   ├── modules
│   │   └── templates
│   ├── contexts
│   ├── db
│   ├── functions
│   │   └── src
│   ├── lib
│   ├── pages
│   ├── public
│   ├── types
│   └── utils
├── docs
├── edge
│   ├── backend
│   │   ├── backend
│   │   └── static
│   ├── frontend
│   │   ├── public
│   │   ├── src
│   │   └── types
│   └── ml
│       ├── ml
│       └── models
├── infra
└── ml
    └── ml-python
        └── ml
```
