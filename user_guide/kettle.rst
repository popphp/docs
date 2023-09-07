Kettle
=======

As of version 4.0, the Pop PHP Framework incorporates a CLI-based helper script called
``kettle``. It allows a user to quickly build the scaffolding for an application and
manage database functions from the command line.

Application Scaffolding
-----------------------

While a particular application structure isn't strictly enforced, applications built with the
``pop-kettle`` component follow a fairly straight-forward application structure. All of these
files and folders, outside of the ``kettle`` script, will be created for you if they do not already
exist. Please note, the ``kettle`` script file is kept in the main root level, and should be set to be
executable.

* app/

  - config/
  - src/
  - view/

* database/

  - migrations/
  - seeds/

* public/
* script/
* kettle

The ``app/`` folder contains the main set of folders and files that make the application work, like ``config/``,
``src/`` and ``view/``. The ``database/`` folder contains the database ``migrations`` and ``seeds`` folders.
The ``public/`` folder is the web document root that contains the main ``index.php`` front controller script file
that runs the main web application. The ``script/`` folder contains the main script that would run the console
version of the application.

The ``kettle`` script allows you to run a simple command that will wire up some basic application files and folders
to get started. By running the following command, you can set up the basic files and folders required to run
an application:

.. code-block:: bash

    $ ./kettle app:init [--web] [--api] [--cli] <namespace>

The ``<namespace>`` parameter is the namespace of your application, for example ``MyApp``.
The optional parameters of ``--web``, ``--api``, and ``--cli`` will create the related files
and folders to run the application as a normal web application, an API-driven web
application, a CLI-driven console application or any combination thereof.

After the application files and folders are copied over, you will be asked if you
would like to configure a database. Follow those steps to configure a database and
create the database configuration file.

**A Note About Folder Structure**

Once the script creates the starter files, you will see certain folders created based on the configuration
options used. If you used no options, or just the ``--web`` option, it will create the files and folders for
a basic web application:

* app/config
* app/src
* app/src/Http
* app/src/Http/Controller
* app/view
* public

If you use the ``--cli`` option, it will create the files and folders for a basic console application:

* app/config
* app/src
* app/src/Console
* app/src/Console/Controller
* script

If you use both ``--web`` and ``--cli`` options, it will create both sets of files and folders:

* app/config
* app/src
* app/src/Console
* app/src/Console/Controller
* app/src/Http
* app/src/Http/Controller
* app/view
* public
* script

If you use all 3 options together, ``--web``, ``--api`` and ``--cli``, it will create both sets of files and folders,
but it will break the ``Http`` namespace into 2 separate namespaces for the public-facing web application as well
as the API web application:

* app/config
* app/src
* app/src/Console
* app/src/Console/Controller
* app/src/Http
* app/src/Http/Controller
* app/src/Http/Api
* app/src/Http/Api/Controller
* app/src/Http/Web
* app/src/Http/Web/Controller
* app/view
* public
* script

The idea here being to keep both access points of the web application separate. So, for example, if a user's
browser requests ``http://localhost:8000/``, it would render an HTML page. And if an API request is sent to
``http://localhost:8000/api``, it would render a appropriate API response, like a set of JSON data.

Database Management
-------------------

Once the application is initialized, you can manage the database, or multiple databases, by using the
``db`` and ``migrate`` commands. If you don't pass anything in the optional ``[<database>]`` parameter,
it will default to the ``default`` database.

.. code-block:: bash

    ./kettle db:install [<database>]                    Install the database (Runs the config, test and seed commands)
    ./kettle db:config [<database>]                     Configure the database
    ./kettle db:test [<database>]                       Test the database connection
    ./kettle db:create-seed <seed> [<database>]         Create database seed class
    ./kettle db:seed [<database>]                       Seed the database with data
    ./kettle db:reset [<database>]                      Reset the database with original seed data
    ./kettle db:clear [<database>]                      Clear the database of all data

    ./kettle migrate:create <class> [<database>]        Create new database migration class
    ./kettle migrate:run [<steps>] [<database>]         Perform forward database migration
    ./kettle migrate:rollback [<steps>] [<database>]    Perform backward database migration
    ./kettle migrate:point [<id>] [<database>]          Point current to a specific migration, without running
    ./kettle migrate:reset [<database>]                 Perform complete rollback of the database

Installing the Database
~~~~~~~~~~~~~~~~~~~~~~~

The command to install the database is a convenient combination the ``db:config``, ``db:test`` and ``db:seed`` commands.
Running the ``db:install`` command will prompt you to enter the database configuration parameters. Once those are entered,
it will test the database, and on a successful test, it will run the seed command and install any initial data it finds
in the seeds folder. The ``db:install`` command is what is run at the end of the ``app:init`` command if you answer 'Y'
the question "Would you like to configure a database?"

Seeding the Database
~~~~~~~~~~~~~~~~~~~~

You can seed the database with data in one of two ways. You can either utilize a SQL file with the extension ``.sql``
in the ``/database/seeds/<database>`` folder or you can write a seeder class using PHP. To get a seed started,
you can run:

.. code-block:: bash

    $ ./kettle db:create-seed <seed> [<database>]

Where the ``<seed>`` is either the base class name of the seeder class that will be created, or the name of a
SQL file (i.e., ``seed.sql``) that will be populated later with raw SQL by the user. The template seeder class
will be copied to the ``/database/seeds/<database>`` folder:

.. code-block:: php

    <?php

    use Pop\Db\Adapter\AbstractAdapter;
    use Pop\Db\Sql\Seeder\AbstractSeeder;

    class MyFirstSeeder extends AbstractSeeder
    {

        public function run(AbstractAdapter $db)
        {

        }

    }

From there, you can populate your SQL file with the raw SQL needed, or you can fill in the ``run()`` method in
the seeder class with the SQL you need to seed your data:

.. code-block:: php

    <?php

    use Pop\Db\Adapter\AbstractAdapter;
    use Pop\Db\Sql\Seeder\AbstractSeeder;

    class DatabaseSeeder extends AbstractSeeder
    {

        public function run(AbstractAdapter $db)
        {
            $sql = $db->createSql();

            $sql->insert('users')->values([
                'username' => 'testuser',
                'password' => '12test34',
                'email'    => 'test@test.com'
            ]);

            $db->query($sql);
        }

    }

Then running the following command will execute any SQL in any SQL files or any of the SQL in the seeder classes:

.. code-block:: bash

    $ ./kettle db:seed

Database Migrations
~~~~~~~~~~~~~~~~~~~

You can create the initial database migration that would modify your database schema as your application
grows by running the command:

.. code-block:: bash

    $ ./kettle migrate:create <class> [<database>]

Where the ``<class>`` is the base class name of the migration class that will be created. You will see your new
migration class template in the ``/database/migrations/<database>`` folder:

.. code-block:: php

    <?php

    use Pop\Db\Sql\Migration\AbstractMigration;

    class MyFirstMigration5dd822cdede29 extends AbstractMigration
    {

        public function up()
        {

        }

        public function down()
        {

        }

    }

From there, you can populate the ``up()`` and ``down()`` with the schema to modify your database:

.. code-block:: php

    <?php

    use Pop\Db\Sql\Migration\AbstractMigration;

    class MyFirstMigration5dd822cdede29 extends AbstractMigration
    {

        public function up()
        {
            $schema = $this->db->createSchema();
            $schema->create('users')
                ->int('id', 16)->increment()
                ->varchar('username', 255)
                ->varchar('password', 255)
                ->varchar('email', 255)
                ->primary('id');

            $schema->execute();
        }

        public function down()
        {
            $schema = $this->db->createSchema();
            $schema->drop('users');
            $schema->execute();
        }

    }

You can run the migration and create the ``users`` table by running the command:

.. code-block:: bash

    $ ./kettle migrate:run

And you can rollback the migration and drop the users table by running the command:

.. code-block:: bash

    $ ./kettle migrate:rollback

Creating Application Files
--------------------------

You can create skeleton application files with the ``create`` commands to assist you in wiring up various MVC-based
components, such as models, views and controllers:

.. code-block:: bash

    ./kettle create:ctrl [--web] [--api] [--cli] <ctrl>      Create a new controller class
    ./kettle create:model <model>                            Create a new model class
    ./kettle create:view <view>                              Create a new view file

Once the respective class files or view scripts are created in the appropriate folders, you can then open them up
and begin writing your application code.

Running the Web Server
----------------------

The ``pop-kettle`` component also provides a simple way to run PHP's built-in web-server, by running the command:

.. code-block:: bash

    $ ./kettle serve [--host=] [--port=] [--folder=]

This is for development environments only and it is strongly advised against using the built-in web server
in a production environment in any way.

Accessing the Application
-------------------------

If you have wired up the beginnings of an application, you can then access the default routes in the following ways.
Starting the web server as described above using ``./kettle serve``, you can access the web application or API application.

For the web application you can go to the address ``http://localhost:8000/`` in any web browser and see the default
index HTML page.

If you've installed the API application instead, you can access it like this to see the default JSON response:

.. code-block:: bash

    $ curl -i -X GET http://localhost:8000/

However, if you have installed both the web and API applications, the API application's default route will move to
``http://localhost:8000/api`` and can be accessed like this:

.. code-block:: bash

    $ curl -i -X GET http://localhost:8000/api

Lastly, if you ``cd ./script``, you'll see the default CLI application script file that was created. The default route
available to the CLI application is the help route:

.. code-block:: bash

    $ ./myapp help

**Using on Windows**

Most UNIX-based environments should recognize the main ``kettle`` application script as a PHP script and run it
accordingly, without having to explicitly call the php command and pass the script and its parameters into it.
However, if you're on an environment like Windows, depending on your exact environment set up, you will most
likely have to prepend all of the command calls with the ``php`` command, for example:

.. code-block:: bash

    C:\popphp\pop-kettle>php kettle help
