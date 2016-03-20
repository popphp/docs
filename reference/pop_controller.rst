Pop\\Controller
===============

The ``Pop\Controller`` sub-component is part of the core `popphp/popphp` component. It serves as the
blueprint controller class on which you can build your application's controller classes.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/popphp

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/popphp": "2.0.*",
        }
    }

Basic Use
---------

The main controller class that is provided is actually an abstract class on which you can build
the controller classes for your application. In it, is the main ``dispatch()`` method, as well
as methods to set and get the default action. The default action is set to ``error`` and that would
be the method the controller class expect to find and default to if no other method satisfies the
incoming route. You can change that to whatever method name you prefer with the ``setDefaultAction()``
method.

Take a look at an example controller class:

.. code-block:: php

    namespace MyApp\Controller;

    use Pop\Controller\AbstractController;

    class IndexController extends AbstractController
    {

        public function index()
        {
            // Do something for the index page
        }

        public function users()
        {
            // Do something for the users page
        }

        public function edit($id)
        {
            // Edit user with $id
        }

        public function error()
        {
            // Handle a non-match route request
        }

    }

As each incoming route's action is matched to a method, it will execute the corresponding method
in the controller object. If no route match is found, then it will default to the default action,
which in this case, is the ``error`` method. So depending on your type of application and how it
is configured, an example of a successful route could be:

.. code-block:: text

    http://localhost/users/edit/1001

which would route to and execute:

.. code-block:: php

    MyApp\Controller\UsersController->edit($id)
