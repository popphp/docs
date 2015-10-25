Routing
=======

The router object facilitates the configuration and matching of the routes to access your application.
It supports both HTTP and CLI routing. With it, you can establish valid routes along with any parameters
that may be required with them.

**HTTP Route Example**

.. code-block:: php

    $router->addRoute('/hello', function() {
        echo 'Hello World';
    });

In the above example, a web request of ``/hello`` will execute the closure as the controller and echo
``Hello World`` out to the browser.

**CLI Route Example**

.. code-block:: php

    $router->addRoute('hello', function($name) {
        echo 'Hello World';
    });

In the above example, a CLI command of ``hello`` will execute the closure as the controller and echo
``Hello World`` out to the console.

Defining route dispatch parameters, you can define required (or optional) data that is needed for a
particular route:

.. code-block:: php

    $router->addRoute('/hello/:name', function($name) {
        echo 'Hello ' . ucfisrt($name);
    });

.. code-block:: php

    $router->addRoute('hello <name>', function($name) {
        echo 'Hello ' . ucfisrt($name);
    });

The HTTP request of ``/hello/pop`` and the CLI command of ``hello pop`` will echo out
``Hello Pop`` to the browser and screen, respectively.

Of course, the controller can be, and usually is, a class instead of a closure for more control
over what happens for each route:

.. code-block:: php

    class MyApp\Controller\IndexController
    {
        public function hello($name = null)
        {
            if (null === $name) {
                echo 'Hello World!';
            } else {
                echo 'Hello ' . ucfisrt($name);
            }
        }
    }

    $router->addRoute('/hello[/:name]', [
        'controller' => 'MyApp\Controller\IndexController',
        'action'     => 'hello'
    ]);

In the above example, a controller class is used to route the request to the ``hello`` method. Also,
and example of an optional dispatch parameter is used as well.

Dynamic Routing
---------------

Dynamic routing is also supported. You can define routes as outlined in the example above and they will
be dynamically mapped and routed to the correct controller and method. Let's assume your application has
the following controller class:

.. code-block:: php

    class MyApp\Controller\UsersController
    {

        public function index()
        {
            // Show a list of users
        }

        public function edit($id = null)
        {
            // Edit the user with the ID of $id
        }
    }


You could define a dynamic route for HTTP like this:

.. code-block:: php

    $router->addRoute('/:controller/:action[/:param]', [
        'prefix' => 'MyApp\Controller\\'
    ]);

and for CLI like this:

.. code-block:: php

    $router->addRoute('<controller> <action> [<param>]', [
        'prefix' => 'MyApp\Controller\\'
    ]);

And the follow routes would be valid due to dynamic route matching:

**HTTP**

``/users``
``/users/edit/1001``

**CLI**

``users``
``users edit 1001``

