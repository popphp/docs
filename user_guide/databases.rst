Databases
=========

Databases are commonly a core piece of an application's functionality. The `popphp/pop-db`
component provides a layer of abstraction and control over databases within your application.
Natively, there are adapters that support for the following database drivers:

+ MySQL
+ PostgreSQL
+ SQLServer
+ SQLite
+ PDO

One can use the above adapters, or extend the base ``Pop\\Db\\Adapter\\AbstractAdapter`` class and
write your own. Additionally, access to individual database tables can be leveraged via the
``Pop\Db\Record`` class.

Connecting to a Database
------------------------

You can use the database factory to create the appropriate adapter instance and connect to a database:

.. code-block:: php

    $mysql = Pop\Db\Db::connect('mysql', [
        'database' => 'my_database',
        'username' => 'my_db_user',
        'password' => 'my_db_password',
        'host'     => 'mydb.server.com'
    ]);

And for other database connections:

.. code-block:: php

    $pgsql  = Pop\Db\Db::connect('pgsql', $options);
    $sqlsrv = Pop\Db\Db::connect('sqlsrv', $options);
    $sqlite = Pop\Db\Db::connect('sqlite', $options);

If you'd like to use the PDO adapter, it requires the `type` option to be defined so it can set
up the proper DSN:

.. code-block:: php

    $pdo = Pop\Db\Db::connect('pdo', [
        'database' => 'my_database',
        'username' => 'my_db_user',
        'password' => 'my_db_password',
        'host'     => 'mydb.server.com',
        'type'     => 'mysql'
    ]);

And there are shorthand methods as well:

.. code-block:: php

    $mysql  = Pop\Db\Db::mysqlConnect($options);
    $pgsql  = Pop\Db\Db::pgsqlConnect($options);
    $sqlsrv = Pop\Db\Db::sqlsrvConnect($options);
    $sqlite = Pop\Db\Db::sqliteConnect($options);
    $pdo    = Pop\Db\Db::pdoConnect($options);

The database factory outlined above is simply creating new instances of the database adapter objects.
The code below would produce the same results:

.. code-block:: php

    $mysql  = new Pop\Db\Adapter\Mysql($options);
    $pgsql  = new Pop\Db\Adapter\Pgsql($options);
    $sqlsrv = new Pop\Db\Adapter\Sqlsrv($options);
    $sqlite = new Pop\Db\Adapter\Sqlite($options);
    $pdo    = new Pop\Db\Adapter\Pdo($options);

The above adapter objects are all instances of ``Pop\\Db\\Adapter\\AbstractAdapter``, which implements the
``Pop\\Db\\Adapter\\AdapterInterface`` interface. If necessary, you can use that underlying foundation to
build your own database adapter to facilitate your database needs for your application.

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

The Query Builder
-----------------

The query builder is a part of the component that provides an interface that will produce syntactically correct
SQL for whichever type of database you have elected to use. One of the main goals of this is portability across
different systems and environments. In order for it to function correctly, you need to pass it the database
adapter your application is currently using so that it can properly build the SQL.

.. code-block:: php

    $db = Pop\Db\Db::connect('mysql', $options);

    $sql = $db->createSql();
    $sql->select(['id', 'username'])
        ->from('users')
        ->where('id > :id');

    echo $sql;

The above example will produce:

.. code-block:: sql

    SELECT `id`, `username` FROM `users` WHERE `id` > ?

If the database adapter changed to PostgreSQL, then the output would be:

.. code-block:: sql

    SELECT "id", "username" FROM "users" WHERE "id" > $1

And SQLite would look like:

.. code-block:: sql

    SELECT "id", "username" FROM "users" WHERE "id" > :id

The SQL Builder component has an extensive API to assist you in constructing complex SQL statements. Here's
an example using JOIN and ORDER BY:

.. code-block:: php

    $db = Pop\Db\Db::connect('mysql', $options);

    $sql = $db->createSql();
    $sql->select([
        'user_id'    => 'id',
        'user_email' => 'email'
    ])->from('users')
      ->leftJoin('user_data', ['users.id' => 'user_data.user_id'])
      ->orderBy('id', 'ASC');
      ->where('id > :id');

    echo $sql;

The above example would produce the following SQL statement for MySQL:

.. code-block:: sql

    SELECT `id` AS `user_id`, `email` AS `user_email` FROM `users`
        LEFT JOIN `user_data` ON `users`.`id` = `user_data`.`user_id`
        WHERE `id` > ?
        ORDER BY `id` ASC;

The Schema Builder
------------------

In addition to the query builder, there is also a schema builder to assist with database table
structures and their management. In a similar fashion to the query builder, the schema builder
has an API that mirrors the SQL that would be used to create, alter and drop tables in a database.

.. code-block:: php

    $db = Pop\Db\Db::connect('mysql', $options);

    $schema = $db->createSchema();
    $schema->create('users')
        ->int('id', 16)
        ->varchar('username', 255)
        ->varchar('password', 255);

    echo $schema;

The above code would produced the following SQL:

.. code-block:: sql

    CREATE TABLE `users` (
      `id` INT(16),
      `username` VARCHAR(255),
      `password` VARCHAR(255)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

Active Record
-------------

The ``Pop\Db\Record`` class uses the `Active Record pattern`_ as a base to allow you to work with
and query tables in a database directly. To set this up, you create a table class that extends the
``Pop\Db\Record`` class:

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

That database adapter will be used for all table classes in your application that extend ``Pop\Db\Record``.
If you want a specific database adapter for a particular table class, you can specify that on the table
class level:

.. code-block:: php

    $userDb = Pop\Db\Db::connect('mysql', $options)
    Users::setDb($userDb);

From there, the API to query the table in the database directly like in the following examples:

**Fetch a single row by ID, update data**

.. code-block:: php

    $user = Users::findById(1001);

    if (isset($user->id)) {
        $user->username = 'admin2';
        $user->save();
    }

**Fetch a single row by another column**

.. code-block:: php

    $user = Users::findOne(['username' => 'admin2']);

    if (isset($user->id)) {
        $user->username = 'admin3';
        $user->save();
    }

**Fetch multiple rows**

.. code-block:: php

    $users = Users::findAll([
        'order' => 'id ASC',
        'limit' => 25
    ]);

    foreach ($users as $user) {
        echo $user->username;
    }

    $users = Users::findBy(['logins' => 0]);

    foreach ($users as $user) {
        echo $user->username . ' has never logged in.';
    }

**Fetch and return only certain columns**

.. code-block:: php

    $users = Users::findAll(['select' => ['id', 'username']]);

    foreach ($users as $user) {
        echo $user->id . ': ' . $user->username;
    }

    $users = Users::findBy(['logins' => 0], ['select' => ['id', 'username']]);

    foreach ($users as $user) {
        echo $user->id . ': ' . $user->username . ' has never logged in.';
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

    $sql = Users::db()->createSql();

    $sql->select()
        ->from(Users::table())
        ->where('id > :id');

    $users = Users::execute($sql, ['id' => 1000]);

    foreach ($users as $user) {
        echo $user->username;
    }

The basic overview of the record class static API is as follows, using the child class ``Users`` as an example:

* ``Users::setDb(Adapter\AbstractAdapter $db, $prefix = null, $isDefault = false)`` - Set the DB adapter
* ``Users::hasDb()`` - Check if the class has a DB adapter set
* ``Users::db()`` - Get the DB adapter object
* ``Users::sql()`` - Get the SQL object
* ``Users::findById($id)`` - Find a single record by ID
* ``Users::findOne(array $columns = null, array $options = null)`` - Find a single record
* ``Users::findBy(array $columns = null, array $options = null, $resultAs = Record::AS_RECORD)`` - Find a record or records by certain column values
* ``Users::findAll(array $options = null, $resultAs = Record::AS_RECORD)`` - Find all records in the table
* ``Users::execute($sql, $params, $resultAs = Record::AS_RECORD)`` - Execute a custom prepared SQL statement
* ``Users::query($sql, $resultAs = Record::AS_RECORD)`` - Execute a simple SQL query

In the ``findOne``, ``findBy`` and ``findAll`` methods, the ``$options`` parameter is an associative array that can
contain values such as:

.. code-block:: php

    $options = [
        'select' => ['id', 'username'],
        'order'  => 'username ASC',
        'limit'  => 25,
        'offset' => 5
    ];

The `select` key value can be an array of only the columns you would like to select. Otherwise it will select all columns `*`.
The `order`, `limit` and `offset` key values all relate to those values to control the order, limit and offset of the
SQL query.

The ``$resultAs`` parameter allows you to set what the row set is returned as:

* ``AS_ARRAY`` - As arrays
* ``AS_OBJECT`` - As array objects
* ``AS_RECORD`` - As instances of the ``Pop\Db\Record``

The benefit of ``AS_RECORD`` is that you can operate on that row in real time, but if there are many
rows returned in the result set, performance could be hindered. Therefore, you can use something like
``AS_ARRAY`` as an alternative to keep the row data footprint smaller and lightweight.

**Accessing records non-statically**

If you're interested in an alternative to the active record pattern, there is a non-static API within the
``Pop\Db\Record`` class:

.. code-block:: php

    $user = new Users();
    $user->getById(5);
    echo $user->username;

The basic overview of the result class API is as follows:

* ``$user->getById($id)`` - Find a single record by ID
* ``$user->getOneBy(array $columns = null, array $options = null)`` - Find a single record by ID
* ``$user->getBy(array $columns = null, array $options = null, $resultAs = Record::AS_RECORD)`` - Find a record or records by certain column values
* ``$user->getAll(array $options = null, $resultAs = Record::AS_RECORD)`` - Find all records in the table

Relationships & Associations
----------------------------

Relationships and associations are supported to allow for a simple way to select related data within the database. Building
on the example above with the `Users` table, let's add an `Info` and an `Orders` table. The user will have a 1:1 relationship
with a row in the `Info` table, and the user will have a 1:many relationship with the `Orders` table:

.. code-block:: php

    class Users extends Pop\Db\Record
    {

        // Define a 1:1 relationship
        public function info()
        {
            return $this->hasOne('Info', 'user_id')
        }

        // Define a 1:many relationship
        public function orders()
        {
            return $this->hasMany('Orders', 'user_id');
        }

    }

    // Foreign key to the related user is `user_id`
    class Info extends Pop\Db\Record
    {

    }

    // Foreign key to the related user is `user_id`
    class Orders extends Pop\Db\Record
    {

        // Define the parent relationship up to the user that owns this order record
        public function user()
        {
            return $this->belongsTo('User', 'user_id');
        }

    }

So with those table classes wired up, there now exists a useful network of relationships among the database
entities that can be accessed like this:

.. code-block:: php

    $user = Users::findById(1);

    // Loop through all of the user's orders
    foreach ($user->orders as $order) {
        echo $order->id;
    }

    // Display the user's title stored in the `info` table
    echo $user->info->title;

Or, in this case, if you have selected an order already and want to access the parent user that owns it:

.. code-block:: php

    $order = Orders::findById(2);
    echo $order->user->username;

**Eager-Loading**

In the 1:many example given above, the orders are "lazy-loaded," meaning that they aren't called from of the
database until you call the ``orders()`` method. However, you can access a 1:many relationship with what is
called "eager-loading." However, to take full advantage of this, you would have alter the method in the `Users`
table:

.. code-block:: php

    class Users extends Pop\Db\Record
    {

        // Define a 1:many relationship
        public function orders($options = null, $eager = false)
        {
            return $this->hasMany('Orders', 'user_id', $options, $eager);
        }

    }

The ``$options`` parameter is a way to pass additional select criteria to the selection of the order rows,
such as `order` and `limit`. The ``$eager`` parameter is what triggers the eager-loading, however, with this
set up, you'll actually access it using the static ``with()`` method, like this:

.. code-block:: php

    $user = Users::with('orders')->getById(10592005);

    // Loop through all of the user's orders
    foreach ($user->orders as $order) {
        echo $order->id;
    }

A note about the access in the example given above. Even though a method was defined to access the different
relationships, you can use a magic property to access them as well, and it will route to that method. Also,
object and array notation is supported throughout any record object. The following example all produce the
same result:

.. code-block:: php

    $user = Users::findById(1);

    echo $user->info()->title;
    echo $user->info()['title'];
    echo $user->info->title;
    echo $user->info['title'];

Shorthand SQL Syntax
--------------------

To help with making custom queries more quickly and without having to utilize the Sql Builder, there is
shorthand SQL syntax that is supported by the ``Pop\Db\Record`` class. Here's a list of what is supported
and what it translates into:

**Basic operators**

.. code-block:: text

    $users = Users::findBy(['id' => 1]);   => WHERE id = 1
    $users = Users::findBy(['id!=' => 1]); => WHERE id != 1
    $users = Users::findBy(['id>' => 1]);  => WHERE id > 1
    $users = Users::findBy(['id>=' => 1]); => WHERE id >= 1
    $users = Users::findBy(['id<' => 1]);  => WHERE id < 1
    $users = Users::findBy(['id<=' => 1]); => WHERE id <= 1

**LIKE and NOT LIKE**

.. code-block:: text

    $users = Users::findBy(['%username%'   => 'test']); => WHERE username LIKE '%test%'
    $users = Users::findBy(['username%'    => 'test']); => WHERE username LIKE 'test%'
    $users = Users::findBy(['%username'    => 'test']); => WHERE username LIKE '%test'
    $users = Users::findBy(['-%username'   => 'test']); => WHERE username NOT LIKE '%test'
    $users = Users::findBy(['username%-'   => 'test']); => WHERE username NOT LIKE 'test%'
    $users = Users::findBy(['-%username%-' => 'test']); => WHERE username NOT LIKE '%test%'

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
        'id>'       => 1,
        '%username' => 'user1'
    ]);

which will be translated into:

.. code-block:: text

    WHERE (id > 1) AND (username LIKE '%test')

If you need to use OR instead, you can specify it like this:

.. code-block:: php

    $users = Users::findBy([
        'id>'       => 1,
        '%username' => 'user1 OR'
    ]);

Notice the ' OR' added as a suffix to the second condition's value. That will apply the OR
to that part of the predicate like this:

.. code-block:: text

    WHERE (id > 1) OR (username LIKE '%test')

Database Migrations
-------------------

Database migrations are scripts that assist in implementing new changes to the database, as well
rolling back any changes to a previous state. It works by storing a directory of migration class
files and keeping track of the current state, or the last one that was processed. From that, you
can write scripts to run the next migration state or rollback to the previous one.

You can create a blank template migration class like this:

.. code-block:: php

    use Pop\Db\Sql\Migrator;

    Migrator::create('MyNewMigration', 'migrations');

The code above will create a file that look like ``migrations/20170225100742_my_new_migration.php``
and it will contain a blank class template:

.. code-block:: php

    <?php

    use Pop\Db\Sql\Migration\AbstractMigration;

    class MyNewMigration extends AbstractMigration
    {

        public function up()
        {

        }

        public function down()
        {

        }

    }

From there, you can write your forward migration steps in the ``up()`` method, or your rollback steps
in the ``down()`` method. Here's an example that creates a table when stepped forward, and drops
that table when rolled back:

.. code-block:: php

    <?php

    use Pop\Db\Sql\Migration\AbstractMigration;

    class MyNewMigration extends AbstractMigration
    {

        public function up()
        {
            $schema = $this->db->createSchema();
            $schema->create('users')
                ->int('id', 16)->increment()
                ->varchar('username', 255)
                ->varchar('password', 255)
                ->primary('id');

            $this->db->query($schema);
        }

        public function down()
        {
            $schema = $this->db->createSchema();
            $schema->drop('users');
            $this->db->query($schema);
        }

    }

To step forward, you would call the migrator like this:

.. code-block:: php

    use Pop\Db\Db;
    use Pop\Db\Sql\Migrator;

    $db = Pop\Db\Db::connect('mysql', [
        'database' => 'my_database',
        'username' => 'my_db_user',
        'password' => 'my_db_password',
        'host'     => 'mydb.server.com'
    ]);

    $migrator = new Migrator($db, 'migrations');
    $migrator->run();

The above code would have created the table ``users`` with the defined columns.
To roll back the migration, you would call the migrator like this:

.. code-block:: php

    use Pop\Db\Db;
    use Pop\Db\Sql\Migrator;

    $db = Pop\Db\Db::connect('mysql', [
        'database' => 'my_database',
        'username' => 'my_db_user',
        'password' => 'my_db_password',
        'host'     => 'mydb.server.com'
    ]);

    $migrator = new Migrator($db, 'migrations');
    $migrator->rollback();

And the above code here would have dropped the table ``users`` from the database.

.. _Active Record pattern: https://en.wikipedia.org/wiki/Active_record_pattern
