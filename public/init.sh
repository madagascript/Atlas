#!/bin/bash
function general(){
  setxkbmap es
  apt-get update
  apt-get install libappindicator3-1 -y
  dpkg -i /media/user/Datos/2018/code_1.23.0-1525361119_amd64.deb
  dpkg -i /media/user/Datos/2018/google-chrome-stable_current_amd64.deb
}

function lamp(){
  apt-get install mysql-server -y
  apt-get install phpmyadmin -y  
  echo create database wordpress > create.sql
  mysql -uroot -pa < create.sql
}

function wordpress(){
  cd /var/www/html
  wget https://es.wordpress.org/wordpress-4.9.5-es_ES.tar.gz
  tar xvzf wordpress-4.9.5-es_ES.tar.gz
  chown -R www-data:www-data /var/www/html/wordpress  
}

function mean(){
  cd /tmp
  wget https://nodejs.org/dist/v8.11.1/node-v8.11.1-linux-x64.tar.xz
  tar xf node-v8.11.1-linux-x64.tar.xz
  cd node-v8.11.1-linux-x64
  rsync -av bin /usr/local/
  rsync -av lib /usr/local/
  node -v
  npm -v
  npm i nodemon -g
}

function mongoShell(){
  apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
  echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.6 main" | tee /etc/apt/sources.list.d/mongodb-org-3.6.list
  apt-get update
  apt-get install -y mongodb-org-shell
}

function hosts(){
  cat /media/user/Datos/2018/middleware-local/public/hosts.txt >> /etc/hosts  
}

general 
mean
mongoShell
hosts


