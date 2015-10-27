Applications
============

The application object of the Pop PHP Framework is the main object that helps control and provide
access to the application's elements, configuration and current state. Within the application object
are ways to create, store and manipulate common elements that you may need during an application's
life-cycle, such as the router, service locator, event manager and module manager. Additionally,
you can also have access to the config object and the autoloader, if needed.

Configuring an Application
--------------------------

The application object's constructor is flexible in what it can accept when setting up your
application. You can pass it individual instances of the objects your application will need:

.. code-block:: php

    $router  = new Pop\Router\Router();
    $service = new Pop\Service\Locator();
    $events  = new Pop\Event\Manager();

    $app = new Pop\Application(
        $router, $service, $events
    );

Or, you can pass it a configuration array and let the application object create and set up the
objects for you:

.. code-block:: php

    $config = [
        'routes' => [
            '/' => [
                'controller' => 'MyApp\Controller\IndexController',
                'action'     => 'index'
            ]
        ],
        'events' => [
            [
                'name'     => 'app.init',
                'action'   => 'MyApp\Event::doSomething',
                'priority' => 1000
            ]
        ],
        'services' => [
            'session' => 'Pop\Web\Session::getInstance'
        ]
    ];

    $app = new Pop\Application($config);

**The Autoloader**

You can also pass in the autoloader and access through the application object if it is
needed to register other components of the application. However, it is required that the
autoloader object's API mirrors that of Composer's ``Composer\Autoload\ClassLoader`` or
Pop PHP's ``Pop\Loader\ClassLoader``.

.. code-block:: php

    $autoloader = include __DIR__ . '/vendor/autoload.php';

    $app = new Pop\Application($autoloader);

    $app->autoloader->addPsr4('MyApp\\', __DIR__ . '/src');

Basic API
---------

Once the application object and its dependencies are wired up, you'll be able to interact
with the application object through the appropriate API calls.

* ``$app->bootstrap($autoloader = null)`` - Bootstrap the application
* ``$app->init()`` - Initialize the application
* ``$app->loadConfig($config)`` - Load a new configuration
* ``$app->loadRouter($router)`` - Load a new router object
* ``$app->loadServices($services)`` - Load a new service locator
* ``$app->loadEvents($events)`` - Load a new event manager
* ``$app->loadModules($modules)`` - Load a new module manager
* ``$app->registerAutoloader($autoloader)`` - Register an autoloader with the application
* ``$app->mergeConfig($config, $replace = false)`` - Merge config values into the application
* ``$app->run()`` - Run the application

You can access the main elements of the application object through the following methods:

* ``$app->autoloader()`` - Access the autoloader
* ``$app->config()`` - Access the configuration object
* ``$app->router()`` - Access the router
* ``$app->services()`` - Access the service locator
* ``$app->events()`` - Access the event manager
* ``$app->modules()`` - Access the module manager

Also, magic methods expose them as direct properties as well:

* ``$app->autoloader`` - Access the autoloader
* ``$app->config`` - Access the configuration object
* ``$app->router`` - Access the router
* ``$app->services`` - Access the service locator
* ``$app->events`` - Access the event manager
* ``$app->modules`` - Access the module manager

Shorthand Methods
-----------------

The application object has some shorthand methods to help tidy up common calls to elements
within the application object:

* ``$app->register($name, $module);`` - Register a module
* ``$app->unregister($name);`` - Unregister a module
* ``$app->isRegistered($name);`` - Check is a module is registered
* ``$app->module($module)`` - Get a module object
* ``$app->addRoute($route, $controller);`` - Add a route
* ``$app->addRoutes($routes);`` - Add routes
* ``$app->setService($name, $service);`` - Set a service
* ``$app->getService($name);`` - Get a service
* ``$app->removeService($name);`` - Remove a service
* ``$app->on($name, $action, $priority = 0);`` - Attach an event
* ``$app->off($name, $action);`` - Detach an event
* ``$app->trigger($name, array $args = []);`` - Trigger an event

Running an Application
----------------------

Of course, once you've configured your application object, you can run the application
by simply executing the ``run`` method:

.. code-block:: php

    $app->run();
