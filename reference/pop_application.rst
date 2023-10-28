pop-application
===============

The ``Pop\Application`` class is the main application class of the Pop PHP Framework. It comes with
the core `popphp/popphp` component and serves as the main application container within an application
written using Pop. With it, you can wire your application's necessary configuration and manage all
of the aspects of your application.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/popphp

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/popphp": "^4.0.0"
        }
    }

Basic Use
---------

The application object of the Pop PHP Framework is the main object that helps control and provide
access to the application's elements, configuration and current state. Within the application object
are ways to create, store and manipulate common elements that you may need during an application's
life-cycle, such as the router, service locator, event manager and module manager. Additionally,
you can also have access to the config object and the autoloader, if needed.

The application object's constructor is flexible in what it can accept when setting up your
application. You can pass it individual instances of the objects your application will need:

.. code-block:: php

    $autoloader = include __DIR__ . '/vendor/autoload.php';
    $router     = new Pop\Router\Router();
    $service    = new Pop\Service\Locator();
    $events     = new Pop\Event\Manager();

    $app = new Pop\Application(
        $autoloader, $router, $service, $events
    );

In the above example, the autoloader, a router, a service locator and an event manager all get passed
into the application so that can be utilized at any given point with the application's life cycle.
Additionally, you can pass it a configuration array and let the application object create and set up
the objects for you:

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
            'session' => 'Pop\Session\Session::getInstance'
        ]
    ];

    $app = new Pop\Application($config);

Once the application object and its dependencies are wired up, you'll be able to interact
with the application object through the appropriate API calls.

* ``$app->bootstrap($autoloader = null)`` - Bootstrap the application
* ``$app->init()`` - Initialize the application
* ``$app->registerConfig($config)`` - Register a new configuration
* ``$app->registerRouter($router)`` - Register a new router object
* ``$app->registerServices($services)`` - Register a new service locator
* ``$app->registerEvents($events)`` - Register a new event manager
* ``$app->registerModules($modules)`` - Register a new module manager
* ``$app->registerAutoloader($autoloader)`` - Register an autoloader with the application
* ``$app->mergeConfig($config, $replace = false)`` - Merge config values into the application
* ``$app->run($exit, $forceRoute);`` - Run the application

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

The application object has some shorthand methods to help tidy up common calls to elements
within the application object:

* ``$app->register($name, $module);`` - Register a module
* ``$app->unregister($name);`` - Unregister a module
* ``$app->isRegistered($name);`` - Check if a module is registered
* ``$app->module($module)`` - Get a module object
* ``$app->addRoute($route, $controller);`` - Add a route
* ``$app->addRoutes($routes);`` - Add routes
* ``$app->setService($name, $service);`` - Set a service
* ``$app->getService($name);`` - Get a service
* ``$app->removeService($name);`` - Remove a service
* ``$app->on($name, $action, $priority = 0);`` - Attach an event
* ``$app->off($name, $action);`` - Detach an event
* ``$app->trigger($name, array $args = []);`` - Trigger an event

Of course, once you've configured your application object, you can run the application
by simply executing the ``run`` method:

.. code-block:: php

    $app->run();

The boolean parameter ``$exit`` is a flag that will be passed down to the router and allow
the router to determine how to exit the application if a route is not found. By default, it's
set to `true`, so the application exits out whenever a route is not found. However, if you
wanted the application to not exit for any reason after a failed route match, you can set that
flag to `false`.

The optional parameter ``$forceRoute`` allows for an override and forces the application to
run the provided route. This is useful when the application object is passed to other services,
for example, a queue service, that need to trigger specific routes to run at scheduled times.