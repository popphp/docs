Bootstrapping
=============

If you've installed the full framework, you can quickly bootstrap a small application
project by running the following command:

.. code-block:: bash

    boostrap/pop install MyApp

where ``MyApp`` is the desired namespace of your application. The above command will
create the necessary basic application scaffolding to run a simple web application.
You will see an ``app`` folder with your namespaced codebase in it and a ``public``
folder with the application's front controller in it. If you point a web server at
the public folder, you will see a basic index page:

.. code-block:: bash

    php -S localhost:8000 -t public

**Console Support**

You can also bootstrap an application with console support as well. If you run the
following command:

.. code-block:: bash

    boostrap/pop install --cli MyApp

The codebase created will also include a script folder with the CLI application script.
A default ``help`` command is set up be default:

.. code-block:: bash

    script/app help
