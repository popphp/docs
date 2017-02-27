pop-service
===========

The ``Pop\Service`` sub-component is part of the core `popphp/popphp` component. It serves as the
service locator for the main application object. With it, you can wire up services that may be needed
during the life-cycle of the application and call them when necessary.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/popphp

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/popphp": "3.0.*",
        }
    }

Basic Use
---------

If you need access to various services throughout the life-cycle of the application, you can
register them with the service locator and recall them later. You can pass an array of services
into the constructor, or you can set them individually as needed.

.. code-block:: php

    $services = new Pop\Service\Locator([
        'foo' => 'MyApp\SomeService'
    ]);

    $services->set('bar', 'MyApp\SomeService->bar');
    $services['baz'] = 'MyApp\SomeService->baz';

Then, you can retrieve a service in a number of ways:

.. code-block:: php

    $foo = $services['foo'];
    $bar = $services->get('bar');

You can use the ``isAvailable`` method if you'd like to determine if a service is available, but not loaded yet:

.. code-block:: php

    if ($services->isAvailable('foo')) {
        $foo = $services['foo'];
    } else {
        $services->set('foo', 'MyApp\SomeService');
    }

The ``isLoaded`` method determines if the service has been set and previously called:

.. code-block:: php

    if ($services->isLoaded('foo')) {
        $foo = $services['foo'];
    }

The service locator uses "lazy-loading" to store the service names and their attributes, and doesn't load or
create the services until they are actually needed and called from the service locator.

You can also remove a service from the service locator if needed:

.. code-block:: php

    $services->remove('foo');
    unset($services['bar']);

Syntax & Parameters
-------------------

You have a couple of different options when setting services. You can pass callable strings or already
instantiated instances of objects, although the latter could be potentially less efficient. Also, if
needed, you can define parameters that will be passed into the service being called.

**Syntax**

Valid callable service strings are as follows:

1. 'SomeClass'
2. 'SomeClass->foo'
3. 'SomeClass::bar'

The first callable string example creates a new instance of ``SomeClass`` and returns it. The second
callable string example creates a new instance of ``SomeClass``, calls the method ``foo()`` and returns the value
from it. The third callable string example calls the static method ``bar()`` in the class ``SomeClass``
and returns the value from it.

**Parameters**

Additionally, if you need to inject parameters into your service upon calling your service, you can
set a service using an array with a ``call`` key and a ``params`` key like this:

.. code-block:: php

    $services = new Pop\Service\Locator([
        'foo' => [
            'call'   => 'MyApp\SomeService->foo',
            'params' => [
                'bar' => 123,
                'baz' => 456
            ]
        ]
    ]);

In the example above, the service ``foo`` is defined by the callable string ``MyApp\SomeService->foo``.
When the service ``foo`` is retrieved, the locator will create a new instance of ``MyApp\SomeService``,
call the method ``foo`` while passing the params ``bar`` and ``baz`` into the method and returning
that value from that method.

Service Container
-----------------

A service container class is available if you prefer to track and access your services through it.
The first call to create a new service locator object will automatically register it as the 'default'
service locator.

.. code-block:: php

    $services = new Pop\Service\Locator([
        'foo' => 'MyApp\SomeService'
    ]);

At some later point in your application:

.. code-block:: php

    $services = Pop\Service\Container::get('default');

If you would like register additional custom service locator objects, you can do that like so:

.. code-block:: php

    Pop\Service\Container::set('customServices', $myCustomServiceLocator);

And then later in your application:

.. code-block:: php

    if (Pop\Service\Container::has('customServices')) {
        $myCustomServiceLocator = Pop\Service\Container::get('customServices');
    }
