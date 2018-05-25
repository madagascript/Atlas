of=/tmp/body.txt
df -h | grep /dev/sd > $of
ping -c 3 google.com >> $of
mail domingo.munoz@gmail.com -s 'informe del sistema' < $of