Databases
=========

Databases are commonly a core piece of an application's functionality. The `popphp/pop-db`
component provides a layer of abstraction and control over databases within your application.
Natively, there are adapters that support for the following database drivers:

+ MySQL
+ PostgreSQL
+ Oracle
+ SQLServer
+ SQLite
+ PDO

One can use the above adapters, or extend the base `Pop\Db\Adapter\AbstractAdapter` class and
write your own. Additionally, access to individual database tables can be leveraged via the
`Pop\Db\Record` class.

Connecting to a Database
------------------------

You can use the database factory to create the appropriate adapter instance and connect to a database:

.. code-block:: php

    $db = Pop\Db\Db::connect('mysql', [
        'database' => 'my_database',
        'username' => 'my_db_user',
        'password' => 'my_db_password',
        'host'     => 'mydb.server.com'
    ]);

And for other database connections:

.. code-block:: php

    $mysql  = Pop\Db\Db::connect('mysql', $options);
    $pgsql  = Pop\Db\Db::connect('pgsql', $options);
    $oracle = Pop\Db\Db::connect('oracle', $options);
    $sqlsrv = Pop\Db\Db::connect('sqlsrv', $options);
    $sqlite = Pop\Db\Db::connect('sqlite', $options);

And if you'd like to use the PDO adapter:

.. code-block:: php

    $pdo = Pop\Db\Db::connect('pdo', [
        'database' => 'my_database',
        'username' => 'my_db_user',
        'password' => 'my_db_password',
        'host'     => 'mydb.server.com',
        'type'     => 'mysql'
    ]);

The PDO adapter required the `type` option to be defined so it can set the proper DSN.

Querying a Database
-------------------

Once you've created a database adapter object, you can then use the API to interact with and
query the database. Let's assume the database has a table `users` in it with the column `username`
in the table.

.. code-block:: php

    $db = Pop\Db\Db::connect('mysql', $options);

    $db->query('SELECT * FROM `users`');

    while ($row = $db->fetch()) {
        echo $row['username'];
    }

Using Prepared Statements
-------------------------

You can also query the database using prepared statements as well. Let's assume the `users` table
from above also has and `id` column.

.. code-block:: php

    $db = Pop\Db\Db::connect('mysql', $options);

    $db->prepare('SELECT * FROM `users` WHERE `id` > ?');
    $db->bindParams(['id' => 1000]);
    $db->execute();

    $rows = $db->fetchResult();

    foreach ($rows as $row) {
        echo $row['username'];
    }

Using Active Record
-------------------

The `Pop\Db\Record` class provides a robust `Active Record pattern`_ to allow you to work with and
query tables in a database directly. To set this up, you create a table class that extends the
`Pop\Db\Record` class:

.. code-block:: php

    class Users extends Pop\Db\Record { }

By default, the table name will be parsed from the class name and it will have a primary key called `id`.
Those settings are configurable as well for when you need to override them. The "class name to table name"
parsing works by converting the CamelCase class name into a lower case underscore name (without the
namespace prefix):

* Users -> users
* MyUsers -> my_users
* MyApp\Table\SomeMetaData -> some_meta_data

If you need to override these default settings, you can do so in the child table class you create:

.. code-block:: php

    class Users extends Pop\Db\Record
    {
        protected $table  = 'my_custom_table';

        protected $prefix = 'pop_';

        protected $primaryKeys = ['id', 'custom_id'];
    }

In the above example, the table is setting to a custom value, a table prefix is defined and the primary keys
are set to a value of two columns. The custom table prefix means that the full table name that will be used
in the class will be `pop_my_custom_table`.

Once you've created and configured your table classes, you can then use the API to interface with them. At
some point early in the beginning stages of your application's life cycle, you will need to set the database
adapter for the table classes to use. You can do that like this:

.. code-block:: php

    $db = Pop\Db\Db::connect('mysql', $options);
    Pop\Db\Record::setDb($db);

And that database adapter will be used for all table classes in your application that extend `Pop\Db\Record`.
If you want a specific database adapter for a particular table class, you can specify that as well:

.. code-block:: php

    $userDb = Pop\Db\Db::connect('mysql', $options)
    Users::setDb($userDb);

From there, the API to query the table in the database directly is as follows:


.. code-block:: php

    $users = Users::findAll(['order' => 'id ASC']);

    foreach ($users->rows() as $user) {
        echo $user->username;
    }

    $user = Users::findById(1001);

    if (isset($user->id)) {
        echo $user->username;
    }

    $user = Users::findBy(['username' => 'admin']);

    if (isset($user->id)) {
        echo $user->username;
    }

SQL Builder
-----------

The SQL Builder is a part of the component that provides an interface that will produce syntactically correct
SQL for whichever type of database you have elected to use. One of the main goals of this is portability across
different systems and environments. In order for it to function correctly, you need to pass it the database
adapter your application is currently using so that it can properly build the SQL.

.. code-block:: php

    $db = Pop\Db\Db::connect('mysql', $options);

    $sql = new Pop\Db\Sql($db, 'users');
    $sql->select(['id', 'username'])
        ->where('id > :id');

    echo $sql;

The above example will produce:

.. code-block:: text

    SELECT `id`, `username` FROM `users` WHERE `id` > ?

If the database adapter changed from MySQL to PostgreSQL, then the output would change to:

.. code-block:: text

    SELECT "id", "username" FROM "users" WHERE "id" > $1

And SQLite would look like:

.. code-block:: text

    SELECT "id", "username" FROM "users" WHERE "id" > :id

.. _Active Record pattern: https://en.wikipedia.org/wiki/Active_record_pattern
