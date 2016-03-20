Pop\\Db
=======

The `popphp/pop-db` component is a database component for interfacing with databases. By default, it provides
adapters for MySQL, PostgreSQL, Oracle, SQLServer and SQLite. Other adapters can be built by extending the core
abstract adapter. The component provides a SQL builder to assist with writing portable standard SQL queries
that can be used across the different database platforms. And, it also provides a record class that services as
an active record/row gateway hybrid. The record sub-component provides easy set up of database tables, along
with an easy API to access the database tables and the data in them.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-db

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-db": "2.0.*",
        }
    }

Basic Use
---------

The quickest way to connect to a database and start executing queries is to use the factory:

.. code-block:: php

    use Pop\Db\Db;

    $options = [
        'database' => 'database',
        'username' => 'username',
        'password' => 'password',
        'host'     => 'localhost'
    ];

    $mysql = Db::connect('mysql', $options);

The above code returns an instance of the ``Pop\\Db\\Adapter\\Mysql`` adapter. Other adapters
can be created like this:

.. code-block:: php

    $pgsql  = Db::connect('pgsql', $options);
    $sqlite = Db::connect(''sqlite', [
        'database' => '/path/to/database.sqlite'
    ]);

The component supports using the ``PDO`` class as well. You just have to add the `type` parameter
in the options array:

.. code-block:: php

    $pdoMysql = Db::connect('pdo', [
        'database' => 'database',
        'username' => 'username',
        'password' => 'password',
        'host'     => 'localhost'
        'type'     => 'mysql'
    ]);

    $pdoSqlite = Db::connect('pdo', [
        'database' => '/path/to/database.sqlite',
        'type'     => 'sqlite'
    ]);

The ``connect()`` factory method provides the shorthand to actually calling the database adapters'
constructors directly.

.. code-block:: php

    use Pop\Db\Adapter;

    $mysql = new Adapter\Mysql([
        'database' => 'mysql_database',
        'username' => 'mysql_username',
        'password' => 'mysql_password',
        'host'     => 'localhost'
    ]);

Queries
~~~~~~~

Once you have a database adapter object, you can run simple queries and access the results like this:

.. code-block:: php

    $db = Pop\Db\Db::connect('mysql', $options);

    $db->query('SELECT * FROM `users`');

    while ($row = $db->fetch()) {
        echo $row['username'];
    }

Prepared Statements
~~~~~~~~~~~~~~~~~~~

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

SQL Query Builder
-----------------

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

If the database adapter changed to PostgreSQL, then the output would be:

.. code-block:: text

    SELECT "id", "username" FROM "users" WHERE "id" > $1

And SQLite would look like:

.. code-block:: text

    SELECT "id", "username" FROM "users" WHERE "id" > :id

The SQL Builder component has an extensive API to assist you in constructing complex SQL statements. Here's
an example using JOIN and ORDER BY:

.. code-block:: php

    $db = Pop\Db\Db::connect('mysql', $options);

    $sql = new Pop\Db\Sql($db, 'users');
    $sql->select([
        'user_id'    => 'id',
        'user_email' => 'email'
    ]);

    $sql->select()->join('user_data', ['users.id' => 'user_data.user_id']);
    $sql->select()->orderBy('id', 'ASC');
    $sql->select->where('id > :id');

    echo $sql;

The above example would produce the following SQL statement for MySQL:

.. code-block:: text

    SELECT `id` AS `user_id`, `email` AS `user_email` FROM `users`
        LEFT JOIN `user_data` ON `users`.`id` = `user_data`.`user_id`
        WHERE `id` > ?
        ORDER BY `id` ASC;

Active Record
-------------

The ``Pop\\Db\\Record`` class uses the `Active Record pattern`_ as a base to allow you to work with
and query tables in a database directly. To set this up, you create a table class that extends the
``Pop\\Db\\Record`` class:

.. code-block:: php

    class Users extends Pop\Db\Record { }

By default, the table name will be parsed from the class name and it will have a primary key called `id`.
Those settings are configurable as well for when you need to override them. The "class-name-to-table-name"
parsing works by converting the CamelCase class name into a lower case underscore name (without the
namespace prefix):

* Users -> users
* MyUsers -> my_users
* MyApp\\Table\\SomeMetaData -> some_meta_data

If you need to override these default settings, you can do so in the child table class you create:

.. code-block:: php

    class Users extends Pop\Db\Record
    {
        protected $table  = 'my_custom_users_table';

        protected $prefix = 'pop_';

        protected $primaryKeys = ['id', 'some_other_id'];
    }

In the above example, the table is set to a custom value, a table prefix is defined and the primary keys
are set to a value of two columns. The custom table prefix means that the full table name that will be used
in the class will be `pop_my_custom_users_table`.

Once you've created and configured your table classes, you can then use the API to interface with them. At
some point in the beginning stages of your application's life cycle, you will need to set the database
adapter for the table classes to use. You can do that like this:

.. code-block:: php

    $db = Pop\Db\Db::connect('mysql', $options);
    Pop\Db\Record::setDb($db);

That database adapter will be used for all table classes in your application that extend ``Pop\\Db\\Record``.
If you want a specific database adapter for a particular table class, you can specify that on the table
sub-class level:

.. code-block:: php

    $userDb = Pop\Db\Db::connect('mysql', $options)
    Users::setDb($userDb);

From there, the API to query the table in the database directly like in the following examples:


**Fetch multiple rows**

.. code-block:: php

    $users = Users::findAll([
        'order' => 'id ASC',
        'limit' => 25
    ]);

    foreach ($users->rows() as $user) {
        echo $user->username;
    }

    $user = Users::findBy(['username' => 'admin']);

    if (isset($user->id)) {
        echo $user->username;
    }

**Fetch a single row, update data**

.. code-block:: php

    $user = Users::findById(1001);

    if (isset($user->id)) {
        $user->username = 'admin2';
        $user->save();
    }

**Create a new record**

.. code-block:: php

    $user = new Users([
        'username' => 'editor',
        'email'    => 'editor@mysite.com'
    ]);

    $user->save();

You can execute custom SQL to run custom queries on the table. One way to do this is by using the SQL Builder:

.. code-block:: php

    $sql = Users::sql();

    $sql->select()->where('id > :id');

    $users = Users::execute($sql, ['id' => 1000]);

    foreach ($users->rows() as $user) {
        echo $user->username;
    }

Shorthand Syntax
----------------

To help with making custom queries more quickly and without having to utilize the Sql Builder, there is
shorthand SQL syntax that is supported by the ``Pop\\Db\\Record`` class. Here's a list of what is supported
and what it translates into:

**Basic operators**

.. code-block:: text

    $users = Users::findBy(['id' => 1]);   => WHERE id = 1
    $users = Users::findBy(['id>' => 1]);  => WHERE id > 1
    $users = Users::findBy(['id>=' => 1]); => WHERE id >= 1
    $users = Users::findBy(['id<' => 1]);  => WHERE id < 1
    $users = Users::findBy(['id<=' => 1]); => WHERE id <= 1

**LIKE and NOT LIKE**

.. code-block:: text

    $users = Users::findBy(['username' => '%test%']);    => WHERE username LIKE '%test%'
    $users = Users::findBy(['username' => 'test%']);     => WHERE username LIKE 'test%'
    $users = Users::findBy(['username' => '%test']);     => WHERE username LIKE '%test'
    $users = Users::findBy(['username' => '-%test']);    => WHERE username NOT LIKE '%test'
    $users = Users::findBy(['username' => 'test%-']);    => WHERE username NOT LIKE 'test%'
    $users = Users::findBy(['username' => '-%test%-']);  => WHERE username NOT LIKE '%test%'

**NULL and NOT NULL**

.. code-block:: text

    $users = Users::findBy(['username' => null]);  => WHERE username IS NULL
    $users = Users::findBy(['username-' => null]); => WHERE username IS NOT NULL

**IN and NOT IN**

.. code-block:: text

    $users = Users::findBy(['id' => [2, 3]]);  => WHERE id IN (2, 3)
    $users = Users::findBy(['id-' => [2, 3]]); => WHERE id NOT IN (2, 3)

**BETWEEN and NOT BETWEEN**

.. code-block:: text

    $users = Users::findBy(['id' => '(1, 5)']);  => WHERE id BETWEEN (1, 5)
    $users = Users::findBy(['id-' => '(1, 5)']); => WHERE id NOT BETWEEN (1, 5)

Additionally, if you need use multiple conditions for your query, you can and they will be
stitched together with AND:

.. code-block:: php

    $users = Users::findBy([
        'id>'      => 1,
        'username' => '%user1'
    ]);

which will be translated into:

.. code-block:: text

    WHERE (id > 1) AND (username LIKE '%test')

If you need to use OR instead, you can specify it like this:

.. code-block:: php

    $users = Users::findBy([
        'id>'      => 1,
        'username' => '%user1 OR'
    ]);

Notice the ' OR' added as a suffix to the second condition's value. That will apply the OR
to that part of the predicate like this:

.. code-block:: text

    WHERE (id > 1) OR (username LIKE '%test')

.. _Active Record pattern: https://en.wikipedia.org/wiki/Active_record_pattern