Aplicaciones
============

El objeto Application del Framework Pop PHP es el objeto principal que ayuda a controlar y provee
acceso a los elementos de la aplicación, configuración y estado actual. Dentro del objeto Application
hay maneras de crear, almacenar y manipular elementos comunes que puedes necesitar durante el ciclo
de vida de una aplicación, tál como el router, el localizador de servicios, y los manejadores de evento
y módulo. Adicionalmente, puedes tener acceso a la configuración del objeto y el autoloader, si lo
necesitas.

Configurando una Aplicación
--------------------------

El constructor del objeto Application es flexible en lo que puede aceptar cuando configuras tu
aplicación. Puedes pasarle instancias individuales de los objetos que tu aplicación necesitará:

.. code-block:: php

    $router  = new Pop\Router\Router();
    $service = new Pop\Service\Locator();
    $events  = new Pop\Event\Manager();

    $app = new Pop\Application(
        $router, $service, $events
    );

Ó, puedes pasarle un arreglo de configuración y dejar que el objeto Application cree y configure
los objetos por tí:

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

**El Autoloader**

You can also pass in the autoloader and access it through the application object if it is
needed to register other components of the application. However, it is required that the
autoloader object's API mirrors that of Composer's ``Composer\Autoload\ClassLoader`` class
or Pop PHP's ``Pop\Loader\ClassLoader`` class.

.. code-block:: php

    $autoloader = include __DIR__ . '/vendor/autoload.php';

    $app = new Pop\Application($autoloader);

    $app->autoloader->add('Test', __DIR__ . '/src/Test');   // PSR-0
    $app->autoloader->addPsr4('MyApp\\', __DIR__ . '/src'); // PSR-4


If needed, you can autoload your application's source through the application constructor
by setting a ``prefix`` and ``src`` keys in the configuration array:

.. code-block:: php

    $autoloader = include __DIR__ . '/vendor/autoload.php';

    $app = new Pop\Application($autoloader, [
        'prefix' => 'MyApp\\',
        'src'    => __DIR__ . '/src'
    ]);

If you need to autoload the above example as PSR-0, then set the ``psr-0`` config key to ``true``.
And then you can always continue autoloading other code sources by accessing the autoloader
through the application object, as in the first example.

Basic API
---------

Once the application object and its dependencies are wired up, you'll be able to interact
with the application object through the appropriate API calls.

* ``$app->bootstrap($autoloader = null)`` - Bootstrap the application
* ``$app->init()`` - Initialize the application
* ``$app->registerConfig($config)`` - Register a new configuration object
* ``$app->registerRouter($router)`` - Register a new router object
* ``$app->registerServices($services)`` - Register a new service locator
* ``$app->registerEvents($events)`` - Register a new event manager
* ``$app->registerModules($modules)`` - Register a new module manager
* ``$app->registerAutoloader($autoloader)`` - Register an autoloader with the application
* ``$app->mergeConfig($config, $preserve = false)`` - Merge config values into the application
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

Running an Application
----------------------

Of course, once you've configured your application object, you can run the application
by simply executing the ``run`` method:

.. code-block:: php

    $app->run();
