# IaC

## setup gcp project

```sh
# switch account
gcloud auth login

# create project
export PROJECT_ID=visual-inspection-template
export Billing_Account=011D22-326CE7-7F1631
gcloud projects create $PROJECT_ID
gcloud config set project $PROJECT_ID
gcloud config list

# link billing account
gcloud beta billing accounts list
gcloud beta billing projects link $PROJECT_ID --billing-account $Billing_Account
```

## create bucket

```sh
export BUCKET_URI=gs://$PROJECT_ID
export REGION=us-central1

gsutil mb -l $REGION $BUCKET_URI
gsutil iam ch allUsers:objectViewer $BUCKET_URI
```

## invite users

```sh
gcloud projects get-iam-policy $PROJECT_ID --format json > ./policy.json
```

```json
// edit policy.json
{
  "members": ["user:masahiro.rikiso@gmail.com"],
  "role": "roles/editor"
}
```

```sh
gcloud projects set-iam-policy $PROJECT_ID ./policy.json
```
