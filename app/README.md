# app

```sh
export BUCKET_URI=gs://$PROJECT_ID
cd _sampleImages
gsutil -m cp -r domeLight/ok/*.png $BUCKET_URI/rawdata/humanLabeling/domeLight/ok/
gsutil -m cp -r barLight/ok/*.png $BUCKET_URI/rawdata/humanLabeling/barLight/ok/
```
