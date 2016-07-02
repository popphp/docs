Pop\\Module
===========

The ``Pop\Module`` sub-component is part of the core `popphp/popphp` component. It serves as the
module manager to the main application object. With it, you can inject module objects into the
application which can extend the functionality and features of your main application.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/popphp

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/popphp": "2.1.*",
        }
    }

Basic Use
---------

Modules can be thought of as "mini-application objects" that allow you to extend the functionality
of your application. Module objects accept similar configuration parameters as an application object,
such as ``routes``, ``services`` and ``events``. Additionally, it accepts a ``prefix`` configuration
value as well to allow the module to register itself with the application autoloader. Here's an example
of what a module might look like and how you'd register it with an application:

.. code-block:: php

    $application = new Pop\Application();

    $moduleConfig = [
        'routes' => [
            '/' => [
                'controller' => 'MyModule\Controller\IndexController',
                'action'     => 'index'
            ]
        ],
        'prefix' => 'MyModule\\'
    ];

    $application->register('myModule', $moduleConfig);

In the above example, the module configuration is passed into the application object. From there,
an instance of the base module object is created and the configuration is passed into it. The newly
created module object is then registered with the module manager within the application object.

Custom Modules
--------------

You can pass your own custom module objects into the application as well, as long as they implement
the module interface provided. As the example below shows, you can create a new instance of your
custom module and pass that into the application, instead of just the configuration. The benefit of
doing this is to allow you to extend the base module class and methods and provide any additional
functionality that may be needed. In doing it this way, however, you will have to register your module's
namespace prefix with the application's autoloader prior to registering the module with the application
so that the application can properly detect and load the module's source files.

.. code-block:: php

    $application->autoloader->addPsr4('MyModule\\', __DIR__ . '/modules/mymodule/src');

    $myModule = new MyModule\Module([
        'routes' => [
            '/' => [
                'controller' => 'MyModule\Controller\IndexController',
                'action'     => 'index'
            ]
        ]
    ]);

    $application->register('myModule', $myModule);

The Module Manager
------------------

The module manager serves as the collection of module objects within the application. This facilitates
accessing the modules you've added to the application during its life-cycle. In the examples above, the
modules are not only being configured and created themselves, but they are also being registered with the
application object. This means that at anytime, you can retrieve a module object or its properties in
a number of ways:

.. code-block:: php

    $fooModule = $application->module('fooModule');

    $barModule = $application->modules['barModule'];

You can also check to see if a module has been registered with the application object:

.. code-block:: php

    if ($application->isRegistered('fooModule')) {
        // Do something with the 'fooModule'
    }

