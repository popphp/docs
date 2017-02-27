Working with the Console App
============================

The CLI side of the application is set up to demonstrate how one would program and interact
with an application via the console. From a user perspective, running the following commands
will trigger certain actions.

To show the help screen:

.. code-block:: bash

    script/pop help

.. image:: images/pop-cli1.png

To show the current posts:

.. code-block:: bash

    script/pop show

.. image:: images/pop-cli2.png

To delete a post:

.. code-block:: bash

    script/pop delete

.. image:: images/pop-cli3.png

Script File
~~~~~~~~~~~

A closer look at the application code in the main ``script/pop`` file and you'll see:

.. code-block:: php

    #!/usr/bin/php
    <?php

    // Require autoloader
    $autoloader = include __DIR__ . '/../vendor/autoload.php';

    // Create main app object, register the app module and run the app
    $app = new Pop\Application($autoloader, include __DIR__ . '/../app/config/app.cli.php');
    $app->register(new Tutorial\Module());
    $app->run();

In the above file, the shell environment is set to PHP. Like the web index file, this script file
loads the autoloader, and the new application object is created, passing the console application
configuration file into the application object. From there, the ``run()`` method is called and the
console application is routed and on its way.

If you take a look at the ``app/config/app.cli.php`` file, you'll see the console routes,
as well as the database service, are defined in the file. The routes are automatically passed and wired
up to a router object and the main application object sets the database object that is to be used from the
service.

ConsoleController
~~~~~~~~~~~~~~~~~

Looking at the main ``ConsoleController`` class in the ``app/src/Controller/`` folder, you will see the
various method actions that serve as the route end points. Within the constructor of the controller,
a few object properties are wired up that will be needed, such at the console object and the help
command. Within the ``help`` method, you can see a basic call to display the help text in the console.
The ``show`` method accesses the model to retrieve the data to display the posts in the console. The
``delete`` method handles a more complex transaction, triggering a prompt for the user to enter the
selected post ID to delete.
