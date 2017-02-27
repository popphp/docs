Application Structure
=====================

After installation, if you take a look at the files and folders in the tutorial application,
you'll see the following basic application structure:

* app/

  - config/
  - database/
  - src/
  - view/

* public/
* script/
* vendor/

The ``app/`` folder contains the main set of folders and files that make the application work.
The ``database/`` folder contains the SQLite database file. The ``public/`` folder is the web document
root that contains the main index file. And the ``script/`` folder contains the main script to
execute the CLI side of the application.

A more expanded version of an Pop application structure may look like this:

* app/

  - config/

    - forms/
    - resources/
    - routes/

      - web.php
      - cli.php

    - app.web.php
    - app.cli.php

  - database/

    - migrations/
    - app.sql

  - src/

    - Controller/
    - Module.php

  - view/

* data/

  - logs/
  - tmp/

* logs/
* public/
* script/
* tests/
* vendor/

This structure isn't necessarily set in stone, but it follows a typical structure that one might
expect to see within an application. Within the ``app/config/`` and ``app/src/Controller/``, you'll
see files specific to the current environment of the application, web or console. Each environment
is explained more in depth in the next sections.

Application Module
~~~~~~~~~~~~~~~~~~

Application development with Pop PHP promotes modular development, meaning that it aides creating
smaller "mini-application" modules that can be registered with the main application object.
If you look inside the ``Tutorial\Module`` class, you see the lines:

.. code-block:: php

    $this->application->on('app.init', function($application){
        Record::setDb($application->services['database']);
    });

Once those lines of code are executed upon the ``app.init`` event trigger, the database becomes available
to the rest of the application. Furthermore, you'll see a CLI specific header and footer that is only
triggered if the environment is on the console.

Front Controllers
~~~~~~~~~~~~~~~~~

You can see the main front controllers in the ``public/`` and ``scripts/`` folders: ``public/index.php``
and ``script/app`` respectively. Looking into each of those, you can see that the main ``Pop\Application``
object is created and wired up, with the ``Tutorial\Module`` object being registered with the main application
object so that it will be wired up and function correctly.

Application Classes
~~~~~~~~~~~~~~~~~~~

Beyond the front controllers and the main module class, there are classes for the following, each in its own folder:

* controllers - ``app/src/Controller``
* forms - ``app/src/Form``
* models - ``app/src/Model``
* tables - ``app/src/Table``

There is a specific controller for each of the two environments, web and console. There is a single form
for collecting, validating and submitting a post comment. That form class is only used in the web
environment as it is a web form. And the model and table classes are used in both environments, as they
serve as the gateway between the application and its data.
