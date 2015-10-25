Applications
============

The application object of the Pop PHP Framework is the main object that helps control and provide
access to the application's elements, configuration and current state. Within the application object
are ways to create, store and manipulate common elements that you may need during an application's
life-cycle, such as the router, service locator, event manager and module manager. Additionally,
you can also have access to the config object and the autoloader, if needed.

The application object's constructor is pretty flexible in what it can accept when setting up your
application. You can pass it individual instances of the objects your application will need:

.. code-block:: php

    <?php

    $router  = new Pop\Router\Router();
    $service = new Pop\Service\Locator();
    $events  = new Pop\Event\Manager();
    $config  = [
        'someConfigValue' => 'foo'
    ];

    $app = new Pop\Application(
        $router, $service, $events, $config
    );

Or, you can pass it a configuration array and let the application object create and set up the
objects for you:

.. code-block:: php

Once the application object and its dependencies are wired up, you'll be able to access them
through the appropriate methods:

.. code-block:: php

