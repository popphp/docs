popcorn
=======

The Popcorn PHP Micro-Framework is a lightweight REST-based micro-framework that's built
on top of the Pop PHP Framework core components. With it, you can rapidly wire together
the routes and configuration needed for your REST-based web application, while leveraging
the pre-existing features and functionality of the Pop PHP Framework.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/popcorn

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/popcorn": "^3.2.0",
        }
    }

Basic Use
---------

In a simple ``index.php`` file, you can define the routes you want to allow
in your application. In this example, we'll use simple closures as our
controllers. The wildcard route '*' can serve as a "catch-all" to handle
routes that are not found or not allowed.

.. code-block:: php

    use Popcorn\Pop;

    $app = new Pop();

    // Home page: http://localhost:8000/
    $app->get('/', function() {
        echo 'Hello World!';
    });

    // Say hello page: http://localhost:8000/hello/john
    $app->get('/hello/:name', function($name) {
        echo 'Hello ' . ucfirst($name) . '!';
    });

    // Wildcard route to handle errors
    $app->get('*', function() {
        header('HTTP/1.1 404 Not Found');
        echo 'Page Not Found.';
    });

    // Post route to process an auth request
    $app->post('/auth', function() {
        if ($_SERVER['HTTP_AUTHORIZATION'] == 'my-token') {
            echo 'Auth successful';
        } else {
            echo 'Auth failed';
        }
    });

    $app->run();

In the above POST example, if you attempted access that URL via GET
(or any method that wasn't POST), it would fail. If you access that URL
via POST, but with the wrong application token, it will return the
'Auth failed' message as enforced by the application. Access the URL
via POST with the correct application token, and it will be successful:

.. code-block:: bash

    curl -X POST --header "Authorization: bad-token" http://localhost:8000/auth
    Auth failed

    curl -X POST --header "Authorization: my-token" http://localhost:8000/auth
    Auth successful

Advanced Usage
--------------

In a more advanced example, we can take advantage of more of an MVC-style
of wiring up an application using the core components of Pop PHP with
Popcorn. Keeping it simple, let's look at a controller class
``MyApp\Controller\IndexController`` like this:

.. code-block:: php

    namespace MyApp\Controller;

    use Pop\Controller\AbstractController;
    use Pop\Http\Request;
    use Pop\Http\Response;
    use Pop\View\View;

    class IndexController extends AbstractController
    {

        protected $response;
        protected $viewPath;

        public function __construct()
        {
            $this->request = new Request();
            $this->response = new Response();
            $this->viewPath = __DIR__ . '/../view/';
        }

        public function index()
        {
            $view = new View($this->viewPath . '/index.phtml');
            $view->title = 'Welcome';

            $this->response->setBody($view->render());
            $this->response->send();
        }

        public function error()
        {
            $view = new View($this->viewPath . '/error.phtml');
            $view->title =  'Error';

            $this->response->setBody($view->render());
            $this->response->send(404);
        }

    }

and two view scripts, ``index.phtml`` and ``error.phtml``, respectively:

.. code-block:: php

    <!DOCTYPE html>
    <!-- index.phtml //-->
    <html>

    <head>
        <title><?=$title; ?></title>
    </head>

    <body>
        <h1><?=$title; ?></h1>
        <p>Hello World.</p>
    </body>

    </html>

.. code-block:: php

    <!DOCTYPE html>
    <!-- error.phtml //-->
    <html>

    <head>
        <title><?=$title; ?></title>
    </head>

    <body>
        <h1 style="color: #f00;"><?=$title; ?></h1>
        <p>Sorry, that page was not found.</p>
    </body>

    </html>

Then we can set the app like this:

.. code-block:: php

    use Popcorn\Pop;

    $app = new Pop();

    $app->get('/', [
        'controller' => 'MyApp\Controller\IndexController',
        'action'     => 'index',
        'default'    => true
    ]);

    $app->run();

The 'default' parameter sets the controller as the default controller
to handle routes that aren't found. Typically, there is a default action
such as an 'error' method to handle this.

API Overview
------------

Here is an overview of the available API within the module ``Popcorn\Pop`` class:

* ``get($route, $controller)`` - Set a GET route
* ``head($route, $controller)`` - Set a HEAD route
* ``post($route, $controller)`` - Set a POST route
* ``put($route, $controller)`` - Set a PUT route
* ``delete($route, $controller)`` - Set a DELETE route
* ``trace($route, $controller)`` - Set a TRACE route
* ``options($route, $controller)`` - Set an OPTIONS route
* ``connect($route, $controller)`` - Set a CONNECT route
* ``patch($route, $controller)`` - Set a PATCH route
* ``setRoute($method, $route, $controller)`` - Set a specific route
* ``setRoutes($methods, $route, $controller)`` - Set a specific route and apply to multiple methods at once

The ``setRoutes()`` method allows you to set a specific route and apply it to multiple methods all at once,
like this:

.. code-block:: php

    use Popcorn\Pop;

    $app = new Pop();

    $app->setRoutes('get,post', '/login', [
        'controller' => 'MyApp\Controller\IndexController',
        'action'     => 'login'
    ]);

    $app->run();

In the above example, the route ``/login`` would display the login form on GET, and then submit the form
on POST, processing and validating it.