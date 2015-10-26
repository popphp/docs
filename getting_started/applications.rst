Applications
============

The application object of the Pop PHP Framework is the main object that helps control and provide
access to the application's elements, configuration and current state. Within the application object
are ways to create, store and manipulate common elements that you may need during an application's
life-cycle, such as the router, service locator, event manager and module manager. Additionally,
you can also have access to the config object and the autoloader, if needed.

Configuring an Application
--------------------------

The application object's constructor is pretty flexible in what it can accept when setting up your
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

Once the application object and its dependencies are wired up, you'll be able to access them
through the appropriate methods and properties:

**Access the router**

.. code-block:: php

    $app->router->addRoute($router, $controller);

**Access the service locator**

.. code-block:: php

    $sess = $app->services['session'];


**Access the event manager**

.. code-block:: php

    $app->events->on('app.init', $action);

You can pass in configuration values that your application may need during its life-cycle
via an array or array-like object:

.. code-block:: php

    $app = new Pop\Application([
        'foo' => 'bar'
    ]);

    $foo = $app->config['foo'];

You can also pass in the autoloader if it is needed as well:

.. code-block:: php

    $autoloader = include __DIR__ . '/vendor/autoload.php';

    $app = new Pop\Application($autoloader);

    $app->autoloader->addPsr4('MyApp\Foo\\', __DIR__ . '/foo/src');

Running an Application
----------------------

Of course, once you've configured your application object, you can run the application
by simply executing the ``run`` method:

.. code-block:: php

    $app->run();

