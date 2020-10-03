pop-db
======

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

**Database Adapter API**

Here's a list of some of the available methods that are available under the database adapter classes:

* ``$db->query($sql);`` - Query the database with the SQL statement
* ``$db->prepare($sql);`` - Prepare the SQL statement
* ``$db->bindParams($params);`` - Bind parameters to the SQL statement
* ``$db->execute();`` - Execute prepared SQL statement
* ``$db->fetch();`` - Fetch the next row of the result set
* ``$db->fetchAll();`` - Fetch all of the rows of the result set
* ``$db->getNumberOfRows();`` - Get number of rows in the result set
* ``$db->getLastId();`` - Get last incremented ID from the previous statement
* ``$db->getTables();`` - Get list of tables in the database

Using Prepared Statements
-------------------------

You can also query the database using prepared statements as well. Let's assume the `users` table
from above also has and `id` column.

.. code-block:: php

    $db = Pop\Db\Db::connect('mysql', $options);

    $db->prepare('SELECT * FROM `users` WHERE `id` > ?');
    $db->bindParams(['id' => 1000]);
    $db->execute();

    $rows = $db->fetchAll();

    foreach ($rows as $row) {
        echo $row['username'];
    }

The Query Builder
-----------------

The query builder is a part of the component that provides an interface that will produce syntactically correct
SQL for whichever type of database you have elected to use. One of the main goals of this is portability across
different systems and environments. In order for it to function correctly, you need to pass it the database
adapter your application is currently using so that it can properly build the SQL. The easiest way to do this
is to just call the ``createSql()`` method from the database adapter. It will inject itself into the SQL builder
object being created.

Select
~~~~~~

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

Insert
~~~~~~

.. code-block:: php

    $sql->insert('users')->values([
        'username' => ':username',
        'password' => ':password'
    ]);
    echo $sql;

.. code-block:: sql

    -- MySQL
    INSERT INTO `users` (`username`, `password`) VALUES (?, ?)

.. code-block:: sql

    -- PostgreSQL
    INSERT INTO "users" ("username", "password") VALUES ($1, $2)

.. code-block:: sql

    -- SQLite
    INSERT INTO "users" ("username", "password") VALUES (:username, :password)

Update
~~~~~~

.. code-block:: php

    $sql->update('users')->values([
        'username' => ':username',
        'password' => ':password'
    ])->where('id = :id');
    echo $sql;

.. code-block:: sql

    -- MySQL
    UPDATE `users` SET `username` = ?, `password` = ? WHERE (`id` = ?)

.. code-block:: sql

    -- PostgreSQL
    UPDATE "users" SET "username" = $1, "password" = $2 WHERE ("id" = $3)

.. code-block:: sql

    -- SQLite
    UPDATE "users" SET "username" = :username, "password" = :password WHERE ("id" = :id)

Delete
~~~~~~

.. code-block:: php

    $sql->delete('users')
        ->where('id = :id');
    echo $sql;

.. code-block:: sql

    -- MySQL
    DELETE FROM `users` WHERE (`id` = ?)

.. code-block:: sql

    -- PostgreSQL
    DELETE FROM "users" WHERE ("id" = $1)

.. code-block:: sql

    -- SQLite
    DELETE FROM "users" WHERE ("id" = :id)

Joins
~~~~~

The SQL Builder has an API to assist you in constructing complex SQL statements that use joins. Typically,
the join methods take two parameters: the foreign table and an array with a 'key => value' of the two related
columns across the two tables. Here's a SQL builder example using a LEFT JOIN:

.. code-block:: php

    $sql->select(['id', 'username', 'email'])->from('users')
        ->leftJoin('user_info', ['users.id' => 'user_info.user_id'])
        ->where('id < :id')
        ->orderBy('id', 'DESC');

    echo $sql;

.. code-block:: sql

    -- MySQL
    SELECT `id`, `username`, `email` FROM `users`
        LEFT JOIN `user_info` ON (`users`.`id` = `user_info`.`user_id`)
        WHERE (`id` < ?) ORDER BY `id` DESC

.. code-block:: sql

    -- PostgreSQL
    SELECT "id", "username", "email" FROM "users"
        LEFT JOIN "user_info" ON ("users"."id" = "user_info"."user_id")
        WHERE ("id" < $1) ORDER BY "id" DESC

.. code-block:: sql

    -- SQLite
    SELECT "id", "username", "email" FROM "users"
        LEFT JOIN "user_info" ON ("users"."id" = "user_info"."user_id")
        WHERE ("id" < :id) ORDER BY "id" DESC

Here's the available API for joins:

* ``$sql->join($foreignTable, array $columns, $join = 'JOIN');`` - Basic join
* ``$sql->leftJoin($foreignTable, array $columns);`` - Left join
* ``$sql->rightJoin($foreignTable, array $columns);`` - Right join
* ``$sql->fullJoin($foreignTable, array $columns);`` -  Full join
* ``$sql->outerJoin($foreignTable, array $columns);`` -  Outer join
* ``$sql->leftOuterJoin($foreignTable, array $columns);`` -  Left outer join
* ``$sql->rightOuterJoin($foreignTable, array $columns);`` -  Right outer join
* ``$sql->fullOuterJoin($foreignTable, array $columns);`` -  Full outer join
* ``$sql->innerJoin($foreignTable, array $columns);`` -  Outer join
* ``$sql->leftInnerJoin($foreignTable, array $columns);`` -  Left inner join
* ``$sql->rightInnerJoin($foreignTable, array $columns);`` -  Right inner join
* ``$sql->fullInnerJoin($foreignTable, array $columns);`` -  Full inner join

Predicates
~~~~~~~~~~

The SQL Builder also has an extensive API to assist you in constructing predicates with which to filter your
SQL statements. Here's a list of some of the available methods to help you construct your predicate clauses:

* ``$sql->where($where);`` - Add a WHERE predicate
* ``$sql->andWhere($where);`` - Add another WHERE predicate using the AND conjunction
* ``$sql->orWhere($where);`` - Add another WHERE predicate using the OR conjunction
* ``$sql->having($having);`` - Add a HAVING predicate
* ``$sql->andHaving($having);`` - Add another HAVING predicate using the AND conjunction
* ``$sql->orHaving($having);`` - Add another HAVING predicate using the OR conjunction

**AND WHERE**

.. code-block:: php

    $sql->select()
        ->from('users')
        ->where('id > :id')->andWhere('email LIKE :email');

    echo $sql;

.. code-block:: sql

    -- MySQL
    SELECT * FROM `users` WHERE ((`id` > ?) AND (`email` LIKE ?))

**OR WHERE**

.. code-block:: php

    $sql->select()
        ->from('users')
        ->where('id > :id')->orWhere('email LIKE :email');

    echo $sql;

.. code-block:: sql

    -- MySQL
    SELECT * FROM `users` WHERE ((`id` > ?) OR (`email` LIKE ?))

There is even a more detailed and granular API that comes with the predicate objects.

.. code-block:: php

    $sql->select()
        ->from('users')
        ->where->greaterThan('id', ':id')->and()->equalTo('email', ':email');

    echo $sql;

.. code-block:: sql

    -- MySQL
    SELECT * FROM `users` WHERE ((`id` > ?) AND (`email` = ?))

Nested Predicates
~~~~~~~~~~~~~~~~~

If you need to nest a predicate, there are API methods to allow you to do that as well:

* ``$sql->nest($conjunction = 'AND');`` - Create a nested predicate set
* ``$sql->andNest();`` - Create a nested predicate set using the AND conjunction
* ``$sql->orNest();`` - Create a nested predicate set using the OR conjunction

.. code-block:: php

    $sql->select()
        ->from('users')
        ->where->greaterThan('id', ':id')
            ->nest()->greaterThan('logins', ':logins')
                ->or()->lessThanOrEqualTo('failed', ':failed');

    echo $sql;

The output below shows the predicates for ``logins`` and ``failed`` are nested together:

.. code-block:: sql

    -- MySQL
    SELECT * FROM `users` WHERE ((`id` > ?) AND ((`logins` > ?) OR (`failed` <= ?)))

Sorting, Order & Limits
~~~~~~~~~~~~~~~~~~~~~~~

The SQL Builder also has methods to allow to further control your SQL statement's result set:

* ``$sql->groupBy($by);`` - Add a GROUP BY
* ``$sql->orderBy($by, $order = 'ASC');`` - Add an ORDER BY
* ``$sql->limit($limit);`` - Add a LIMIT
* ``$sql->offset($offset);`` - Add an OFFSET

Execute SQL
~~~~~~~~~~~

You can just pass the ``$sql`` object down into either the ``query()`` or ``prepare()`` methods of the ``$db``
adapter:

.. code-block:: php

    // No parameters
    $db->query($sql);

.. code-block:: php

    // Prepared statement with bound parameters
    $db->prepare($sql)
        ->bindParams($params)
        ->execute();

The Schema Builder
------------------

In addition to the query builder, there is also a schema builder to assist with database table
structures and their management. In a similar fashion to the query builder, the schema builder
has an API that mirrors the SQL that would be used to create, alter and drop tables in a database.
It is also built to be portable and work across different environments that may have different chosen
database adapters with which to work. And like the query builder, in order for it to function correctly,
you need to pass it the database adapter your application is currently using so that it can properly
build the SQL. The easiest way to do this is to just call the ``createSchema()`` method from the
database adapter. It will inject itself into the Schema builder object being created.

The examples below show separate schema statements, but a single schema builder object can have multiple
schema statements within one schema builder object's life cycle.

Create Table
~~~~~~~~~~~~

.. code-block:: php

    $db = Pop\Db\Db::mysqlConnect($options);

    $schema = $db->createSchema();
    $schema->create('users')
        ->int('id', 16)
        ->varchar('username', 255)
        ->varchar('password', 255);

    echo $schema;

The above code would produced the following SQL:

.. code-block:: sql

    -- MySQL
    CREATE TABLE `users` (
      `id` INT(16),
      `username` VARCHAR(255),
      `password` VARCHAR(255)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

**Foreign Key Example**

Here is an example of creating an additional ``user_info`` table that references the above ``users`` table
with a foreign key:

.. code-block:: php

    $schema->create('user_info')
        ->int('user_id', 16)
        ->varchar('email', 255)
        ->varchar('phone', 255)
        ->foreignKey('user_id')->references('users')->on('id')->onDelete('CASCADE');

The above code would produced the following SQL:

.. code-block:: sql

    -- MySQL
    ALTER TABLE `user_info` ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`)
      REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

Alter Table
~~~~~~~~~~~

.. code-block:: php

    $schema->alter('users')
        ->addColumn('email', 'VARCHAR', 255);

    echo $schema;

The above code would produced the following SQL:

.. code-block:: sql

    -- MySQL
    ALTER TABLE `users` ADD `email` VARCHAR(255);

Drop Table
~~~~~~~~~~

.. code-block:: php

    $schema->drop('users');

    echo $schema;

The above code would produced the following SQL:

.. code-block:: sql

    -- MySQL
    DROP TABLE `users`;

Execute Schema
~~~~~~~~~~~~~~

You can execute the schema by using the ``execute()`` method within the schema builder object:

.. code-block:: php

    $schema->execute();

Schema Builder API
~~~~~~~~~~~~~~~~~~

In the above code samples, if you want to access the table object directly, you can like this:

.. code-block:: php

    $createTable   = $schema->create('users');
    $alterTable    = $schema->alter('users');
    $truncateTable = $schema->truncate('users');
    $renameTable   = $schema->rename('users');
    $dropTable     = $schema->drop('users');

Here's a list of common methods available with which to build your schema:

* ``$createTable->ifNotExists();`` - Add a IF NOT EXISTS flag
* ``$createTable->addColumn($name, $type, $size = null, $precision = null, array $attributes = []);`` - Add a column
* ``$createTable->increment($start = 1);`` - Set an increment value
* ``$createTable->defaultIs($value);`` - Set the default value for the current column
* ``$createTable->nullable();`` - Make the current column nullable
* ``$createTable->notNullable();`` - Make the current column not nullable
* ``$createTable->index($column, $name = null, $type = 'index');`` - Create an index on the column
* ``$createTable->unique($column, $name = null);`` - Create a unique index on the column
* ``$createTable->primary($column, $name = null);`` - Create a primary index on the column

The following methods are shorthand methods for adding columns of various common types. Please note, if the
selected column type isn't supported by the current database adapter, the column type is normalized to
the closest type.

* ``$createTable->integer($name, $size = null, array $attributes = []);``
* ``$createTable->int($name, $size = null, array $attributes = []);``
* ``$createTable->bigInt($name, $size = null, array $attributes = []);``
* ``$createTable->mediumInt($name, $size = null, array $attributes = []);``
* ``$createTable->smallInt($name, $size = null, array $attributes = []);``
* ``$createTable->tinyInt($name, $size = null, array $attributes = []);``
* ``$createTable->float($name, $size = null, $precision = null, array $attributes = []);``
* ``$createTable->real($name, $size = null, $precision = null, array $attributes = [])``
* ``$createTable->double($name, $size = null, $precision = null, array $attributes = []);``
* ``$createTable->decimal($name, $size = null, $precision = null, array $attributes = []);``
* ``$createTable->numeric($name, $size = null, $precision = null, array $attributes = []);``
* ``$createTable->date($name, array $attributes = []);``
* ``$createTable->time($name, array $attributes = []);``
* ``$createTable->datetime($name, array $attributes = []);``
* ``$createTable->timestamp($name, array $attributes = []);``
* ``$createTable->year($name, $size = null, array $attributes = []);``
* ``$createTable->text($name, array $attributes = []);``
* ``$createTable->tinyText($name, array $attributes = []);``
* ``$createTable->mediumText($name, array $attributes = []));``
* ``$createTable->longText($name, array $attributes = []);``
* ``$createTable->blob($name, array $attributes = []);``
* ``$createTable->mediumBlob($name, array $attributes = []);``
* ``$createTable->longBlob($name, array $attributes = []);``
* ``$createTable->char($name, $size = null, array $attributes = []);``
* ``$createTable->varchar($name, $size = null, array $attributes = []);``

The following methods are all related to the creation of foreign key constraints and their relationships:

* ``$createTable->int($name, $size = null, array $attributes = [])`` - Create a foreign key on the column
* ``$createTable->references($foreignTable);`` - Create a reference to a table for the current foreign key constraint
* ``$createTable->on($foreignColumn);`` - Used in conjunction with ``references()`` to designate the foreign column
* ``$createTable->onDelete($action = null)`` - Set the ON DELETE parameter for a foreign key constraint

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

Fetching Records
~~~~~~~~~~~~~~~~

Once a record class is correctly wired up, you can use the API to query the table in the database directly
like in the following examples:

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

Create a Record
~~~~~~~~~~~~~~~

.. code-block:: php

    $user = new Users([
        'username' => 'editor',
        'email'    => 'editor@mysite.com'
    ]);

    $user->save();

Delete a Record
~~~~~~~~~~~~~~~

.. code-block:: php

    $user = Users::findById(1001);

    if (isset($user->id)) {
        $user->delete();
    }

**Deleting Multiple Records**

You can delete multiple rows by passed a ``$columns`` parameter into the delete method.

.. code-block:: php

    $user = new Users();
    $user->delete(['logins' => 0]);

Execute Custom SQL
~~~~~~~~~~~~~~~~~~

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

Tracking Changed Values
~~~~~~~~~~~~~~~~~~~~~~~

The ``Pop\Db\Record`` class the ability to track changed values within the record object. This is often times
referred to "dirty attributes."

.. code-block:: php

    $user = Users::findById(1001);

    if (isset($user->id)) {
        $user->username = 'admin2';
        $user->save();

        $dirty = $user->getDirty();
    }

The ``$dirty`` variable will contain two arrays: `old` and `new`:

.. code-block:: text

    [old] => [
        "username" => "admin"
    ],
    [new] => [
        "username" => "admin2"
    ]

And as you can see, only the field or fields that have been changed are stored.

Active Record API
~~~~~~~~~~~~~~~~~

The basic overview of the record class static API is as follows, using the child class ``Users`` as an example:

* ``Users::setDb(Adapter\AbstractAdapter $db, $prefix = null, $isDefault = false)`` - Set the DB adapter
* ``Users::hasDb()`` - Check if the class has a DB adapter set
* ``Users::db()`` - Get the DB adapter object
* ``Users::sql()`` - Get the SQL object
* ``Users::findById($id)`` - Find a single record by ID
* ``Users::findOne(array $columns = null, array $options = null)`` - Find a single record
* ``Users::findOneOrCreate(array $columns = null, array $options = null)`` - Find a single record or create it if it doesn't exist
* ``Users::findLatest($by = null, array $columns = null, array $options = null)`` - Find the latest record
* ``Users::findBy(array $columns = null, array $options = null, $asArray = false)`` - Find a record or records by certain column values
* ``Users::findByOrCreate(array $columns = null, array $options = null, $asArray = false)`` - Find a record or records by certain column values or create it if doesn't exist
* ``Users::findAll(array $options = null, $asArray = false)`` - Find all records in the table
* ``Users::execute($sql, $params, $asArray = false)`` - Execute a custom prepared SQL statement
* ``Users::query($sql, $asArray = false)`` - Execute a simple SQL query
* ``Users::getTotal(array $columns = null, array $options = null)`` - Get total of rows in the table

The basic overview of the record class instance API is as follows:

* ``$user->getById($id)`` - Find a single record by ID
* ``$user->getOneBy(array $columns = null, array $options = null)`` - Find a single record by ID
* ``$user->getBy(array $columns = null, array $options = null, $asArray = false)`` - Find a record or records by certain column values
* ``$user->getAll(array $options = null, $asArray = false)`` - Find all records in the table
* ``$user->save();`` - Save the record
* ``$user->delete(array $columns = null);`` - Delete the record or records
* ``$user->increment($column, $amount = 1);`` - Increment a numeric column
* ``$user->decrement($column, $amount = 1);`` - Decrement a numeric column
* ``$user->replicate(array $replace = []);`` - Replicate a record
* ``$user->isDirty();`` - Check if the record has been changed
* ``$user->getDirty();`` - Get any changes from the record
* ``$user->resetDirty();`` - Reset the record if there were any changes

In the some of the methods above, the ``$options`` parameter is an associative array that can contain values such as:

.. code-block:: php

    $options = [
        'select' => ['id', 'username'],
        'order'  => 'username ASC',
        'limit'  => 25,
        'offset' => 5,
        'join'   => [
            [
                'table'   => 'user_info',
                'columns' => ['users.id' => 'user_info.user_id']
            ]
        ]
    ];

The `select` key value can be an array of only the columns you would like to select. Otherwise it will select all columns `*`.
The `order`, `limit` and `offset` key values all relate to those values to control the order, limit and offset of the
SQL query. The `join` key allows you to pass the parameters in to create a JOIN statement.

Encoded Record
~~~~~~~~~~~~~~

As of ``pop-db`` version 4.5.0 (included as of Pop PHP Framework 4.0.2), there is now support for an encoded record class,
which provides the functionality to more easily store and retrieve data that needs to be encoded in some way. The
five ways supported out of the box are:

* JSON-encoded values
* PHP-serialized values
* Base64-encoded values
* Password hash values (one-way hashing)
* OpenSSL-encrypted values

Similar to the example above, you would create and wire up a table class, filling in the necessary configuration details,
like below:

.. code-block:: php

    class Users extends Pop\Db\Record\Encoded
    {
        protected $jsonFields      = ['info'];
        protected $phpFields       = ['metadata'];
        protected $base64Fields    = ['contents'];
        protected $hashFields      = ['password'];
        protected $encryptedFields = ['ssn'];
        protected $hashAlgorithm   = PASSWORD_BCRYPT;
        protected $hashOptions     = ['cost' => 10];
        protected $cipherMethod    = 'AES-256-CBC';
        protected $key             = 'SOME_KEY';
        protected $iv              = 'SOME_BASE64_ENCODED_IV';
    }

In the above example, you configure the fields that will need to be encoded and decoded, as well as pertinent configuration
options for hashing and encryption. Now, when you save and retrieve data, the encoding and decoding will be handled for you:

.. code-block:: php

    $user = new Users([
        'username' => 'editor',
        'password' => '12edit34',
        'info'     => [
            'foo' => 'bar'
        ],
        'metadata' => [
            'attrib' => 'value'
        ],
        'contents' => 'Some text from a file.',
        'ssn'      => '123-45-6789'
    ]);

    $user->save();

The values will be correctly encoded and stored in the database, like such:

.. code-block:: text

    password: $2y$10$juVQwg2Gndy/sH5jxFcO/.grehHDvhs8QaRWFQ7hPkvCLHjDUdkNe
    info: {"foo":"bar"}
    metadata: a:1:{s:6:"attrib";s:5:"value";}
    contents: U29tZSB0ZXh0IGZyb20gYSBmaWxlLg==
    ssn: zoVgGSiYu4QvIt2XIREe3Q==

And then retrieving the record will automatically decode the values for you to access:

.. code-block:: php

    $user = Users::findById(1);
    print_r($user->toArray());

which will display:

.. code-block:: text

    Array
    (
        [username] => editor
        [password] => $2y$10$juVQwg2Gndy/sH5jxFcO/.grehHDvhs8QaRWFQ7hPkvCLHjDUdkNe
        [info] => Array
            (
                [foo] => bar
            )

        [metadata] => Array
            (
                [attrib] => value
            )

        [contents] => Some text from a file.
        [ssn] => 123-45-6789
    )

Please note that the password hashing functionality supports one-way hashing only. So the value of those fields will
only be encoded once, and then never decoded. You can call the ``verify($key, $value)`` method to verify a password
attempt against the hash:

.. code-block:: php

    $user = Users::findById(1);
    if ($user->verify('password', '12edit34')) {
        // Login
    } else {
        // Deny user
    }

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

The static ``with()`` method also supports multiple relationships as well:

.. code-block:: php

    $user = Users::with(['orders', 'posts'])->getById(1001);

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
