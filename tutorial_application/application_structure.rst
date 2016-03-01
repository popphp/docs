Application Structure
=====================

After installation, if you take a look at the files and folders in the tutorial application,
you'll see the following:

* app/

  - config/
  - data/
  - src/
  - view/

* public/
* script/
* vendor/

The ``app/`` folder contains the main set of folders and files that main the application work.
The ``data/`` folder contains the SQLite database file. The ``public/`` folder is the web document
root that contains the main index file. And the ``script/`` folder contains the main script to
execute the CLI side of the application.

This structure isn't necessarily set in stone, but it follows a typical structure that one might
expect to see within an application. Within the ``app/config/`` and ``app/src/Controller/``, you'll
see files specific to the current environment of the application, web or console. Each environment
is explained more in depth in the next sections.

Application Object
~~~~~~~~~~~~~~~~~~

If you look inside the ``Tutorial\Application`` class, you see the lines:

.. code-block:: php

    $this->on('app.init', function($application){
        Record::setDb($application->services['database']);
    });

Once those lines of code are executed upon the ``app.init`` event trigger, the database becomes available
to the rest of the application. Furthermore, you'll see a CLI specific header and footer that is only
triggered if the environment is on the console.

Application Classes
~~~~~~~~~~~~~~~~~~~

Beyond the main application class, there are classes for the following, each in its own folder:

* controllers - ``app/src/Controller``
* forms - ``app/src/Form``
* models - ``app/src/Model``
* tables - ``app/src/Table``

There is a specific controller for each of the two environments, web and console. There is a single form
for collecting, validating and submitting a post comment. That form class is only used in the web
environment as it is a web form. And the model and table classes are used in both environments, as they
serve as the gateway between the application and its data.
