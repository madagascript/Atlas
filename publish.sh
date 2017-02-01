
rsync -av ~/ionic-2/oikos/src/app/ ~/oikos-2/src/app/ionic2/app/
rsync -av ~/ionic-2/oikos/src/pages/ ~/oikos-2/src/app/ionic2/pages/
cd ~/oikos-2/
git commit -a -m 'cambios en la app de ionic'
git push