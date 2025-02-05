echo
echo
echo 'START M$SQL CUSTOM INITIALIZATION'
echo '================================='
echo
echo
##run the setup script to create the DB and the schema in the DB
##do this in a loop because the timing for when the SQL instance is ready is indeterminate

for i in {1..100};
do
    /opt/mssql-tools18/bin/sqlcmd -C -N -S localhost -U sa -P ${SA_PASSWORD} -d master -q "SELECT @@VERSION GO"
    if [ $? -eq 0 ]
    then

        #import the data from the sql file
        #/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d master -i /init/dmspooldatei.sql
        #/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d master -i /init/sybenutzer.sql

        echo "init completed"

        break
    else
        echo "not ready yet..."
        sleep 1
    fi
done & /opt/mssql/bin/sqlservr
