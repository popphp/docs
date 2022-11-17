pop-router
==========

The ``Pop\Router`` sub-component is part of the core `popphp/popphp` component. It serves as the
primary router to the main application object. With it, you can define routes for both web-based
and console-based applications.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/popphp

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/popphp": "^3.7.2"
        }
    }

Basic Use
---------

The router object facilitates the configuration and matching of the routes to access your application.
It supports both HTTP and CLI routing. With it, you can establish valid routes along with any parameters
that may be required with them.

**HTTP Route Example**

.. code-block:: php

    $router->addRoute('/hello', function() {
        echo 'Hello World';
    });

In the above example, a web request of ``http://localhost/hello`` will execute the closure as the controller and echo
``Hello World`` out to the browser.

**CLI Route Example**

.. code-block:: php

    $router->addRoute('hello', function($name) {
        echo 'Hello World';
    });

In the above example, a CLI command of ``./app hello`` will execute the closure as the controller and echo
``Hello World`` out to the console.

A controller object can be, and usually is, an instance of a class instead of a closure
for more control over what happens for each route:

.. code-block:: php

    class MyApp\Controller\IndexController extends \Pop\Controller\AbstractController
    {
        public function index()
        {
            echo 'Hello World!';
        }
    }

    $router->addRoute('/', [
        'controller' => 'MyApp\Controller\IndexController',
        'action'     => 'index'
    ]);

In the above example, the request ``/`` is routed to the ``index()`` method in the defined controller class.

Controller Parameters
---------------------

It's common to require access to various elements and values of your application while within an
instance of your controller class. To provide this, the router object allows you to inject parameters
into the controller upon instantiation. Let's assume your controller's constructor looks like this:

.. code-block:: php

    class MyApp\Controller\IndexController extends \Pop\Controller\AbstractController
    {
        protected $foo;
        protected $bar;

        public function __construct($foo, $bar)
        {
            $this->foo = $foo;
            $this->bar = $bar;
        }
    }

You could then inject parameters into the controller's constructor like this:

.. code-block:: php

    $router->addControllerParams(
        'MyApp\Controller\IndexController', [
            'foo' => $foo,
            'bar' => $bar
        ]
    );

If you require parameters to be injected globally to all of your controller classes, then you can
replace the controller name ``'MyApp\Controller\IndexController`` with ``*`` and they will be injected
into all controllers. You can also define controller parameters within the route configuration as well.

.. code-block:: php

    $config = [
        'routes' => [
            '/products' => [
                'controller'       => 'MyApp\Controller\ProductsController',
                'action'           => 'index',
                'controllerParams' => [
                    'baz'    => 789
                ]
            ]
        ]
    ];

    $app = new Pop\Application($config);


Dispatch Parameters
-------------------

Defining route dispatch parameters, you can define required (or optional) parameters that are needed for a
particular route:

.. code-block:: php

    $router->addRoute('/hello/:name', function($name) {
        echo 'Hello ' . ucfirst($name);
    });

.. code-block:: php

    $router->addRoute('hello <name>', function($name) {
        echo 'Hello ' . ucfirst($name);
    });

The HTTP request of ``http://localhost/hello/pop`` and the CLI command of ``./app hello pop`` will each
echo out ``Hello Pop`` to the browser and console, respectively.

**Optional Dispatch Parameters**

Consider the following controller class and method:

.. code-block:: php

    class MyApp\Controller\IndexController extends \Pop\Controller\AbstractController
    {
        public function hello($name = null)
        {
            if (null === $name) {
                echo 'Hello World!';
            } else {
                echo 'Hello ' . ucfirst($name);
            }
        }
    }

Then add the following routes for HTTP and CLI:

**HTTP:**

.. code-block:: php

    $router->addRoute('/hello[/:name]', [
        'controller' => 'MyApp\Controller\IndexController',
        'action'     => 'hello'
    ]);

**CLI:**

.. code-block:: php

    $router->addRoute('hello [<name>]', [
        'controller' => 'MyApp\Controller\IndexController',
        'action'     => 'hello'
    ]);

In the above example, the parameter ``$name`` is an optional dispatch parameter and the ``hello()``
method performs differently depending on whether or not the parameter value it present.

Dynamic Routing
---------------

Dynamic routing is also supported. You can define routes as outlined in the examples below and they will
be dynamically mapped and routed to the correct controller and method. Let's assume your application has
the following controller class:

.. code-block:: php

    class MyApp\Controller\UsersController extends \Pop\Controller\AbstractController
    {

        public function index()
        {
            // Show a list of users
        }

        public function edit($id = null)
        {
            // Edit the user with the ID# of $id
        }
    }

You could define a dynamic route for HTTP like this:

.. code-block:: php

    $router->addRoute('/:controller/:action[/:param]', [
        'prefix' => 'MyApp\Controller\\'
    ]);

and routes such as these would be valid:

* ``http://localhost/users``
* ``http://localhost/users/edit/1001``

For CLI, you can define a dynamic route like this:

.. code-block:: php

    $router->addRoute('<controller> <action> [<param>]', [
        'prefix' => 'MyApp\Controller\\'
    ]);

and routes such as these would be valid:

* ``./app users``
* ``./app users edit 1001``

Named Routes
------------

Named routes are supported either through the API or through the routes configuration. The benefit of
named routes is that it gives a simple name to call up and reference the route when needed.

**Via the API**

.. code-block:: php

    $router = new Pop\Router\Router();

    $router->addRoute('/home', function() {
        echo 'Home!' . PHP_EOL;
    })->name('home');

    $router->addRoute('/hello/:name', function($name) {
        echo 'Hello, ' . $name . '!' . PHP_EOL;
    })->name('hello');


**Via Route Configuration**

.. code-block:: php

    $app = new Application([
        'routes' => [
            '/home' => [
                'controller' => function () {
                    echo 'Home!' . PHP_EOL;
                },
                'name' => 'home'
            ],
            '/hello/:name' => [
                'controller' => function ($name) {
                    echo 'Hello, ' . $name . '!' . PHP_EOL;
                },
                'name' => 'hello'
            ]
        ]
    ]);

URL Generation
--------------

Using the named routed feature described above, you can generate URLs as needed by calling on the router
and passing an array or object down with any of the dispatch parameters. The simple way to do this is with
the static ``Pop\Route\Route`` class, which can store the application's current router.

Consider the following named route:

.. code-block:: php

    $router->addRoute('/hello/:name', function($name) {
        echo 'Hello, ' . $name . '!' . PHP_EOL;
    })->name('hello');

Below is an example of how to generate the appropriate URLs for a data set that would utilize that route:

.. code-block:: php

    foreach ($names as $name):
        echo '<a href="' . Route::url('hello', $name) . '">'  . $name->name . '</a><br />' . PHP_EOL;
    endforeach;

.. code-block:: html

    <a href="/hello/nick">nick</a><br />
    <a href="/hello/jim">jim</a><br />
    <a href="/hello/world">world</a><br />

Routing Syntax
--------------

The tables below outline the accepted routing syntax for the route matching:

HTTP
~~~~

+---------------------------------+---------------------------------------------------------------------+
| Web Route                       | What's Expected                                                     |
+=================================+=====================================================================+
| /foo/:bar/:baz                  | The 2 params are required                                           |
+---------------------------------+---------------------------------------------------------------------+
| /foo/:bar[/:baz]                | First param required, last one is optional                          |
+---------------------------------+---------------------------------------------------------------------+
| /foo/:bar/:baz*                 | One required param, one required param that is a collection (array) |
+---------------------------------+---------------------------------------------------------------------+
| /foo/:bar[/:baz*]               | One required param, one optional param that is a collection (array) |
+---------------------------------+---------------------------------------------------------------------+

CLI
~~~

+-------------------------------------+----------------------------------------------------------------------+
| CLI Route                           | What's Expected                                                      |
+=====================================+======================================================================+
| foo bar                             | Two commands are required                                            |
+-------------------------------------+----------------------------------------------------------------------+
| foo bar\|baz                        | Two commands are required, the 2nd can accept 2 values               |
+-------------------------------------+----------------------------------------------------------------------+
| foo [bar\|baz]                      | The second command is optional and can accept 2 values               |
+-------------------------------------+----------------------------------------------------------------------+
| foo -o1 [-o2]                       | First option required, 2nd option is optional                        |
+-------------------------------------+----------------------------------------------------------------------+
| foo --option1\|-o1 [--option2\|-o2] | 1st option required, 2nd optional; long & short supported for both   |
+-------------------------------------+----------------------------------------------------------------------+
| foo \<name\> [\<email\>]            | First param required, 2nd param optional                             |
+-------------------------------------+----------------------------------------------------------------------+
| foo --name= [--email=]              | First value param required, 2nd value param optional                 |
+-------------------------------------+----------------------------------------------------------------------+
