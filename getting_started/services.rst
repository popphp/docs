Services
========

If you need access to various services throughout the life-cycle of the application, you can
register them with the service locator and recall them later. You can pass an array of services
into the constructor, or you can set them individually as needed.

.. code-block:: php

    $services = new Pop\Service\Locator([
        'foo' => [
            'call' => 'MyApp\SomeService'
        ]
    ]);

    $services->setService('bar', 'MyApp\SomeService->bar');

Then, you can retrieve a service a number of ways:

.. code-block:: php

    $foo = $services['foo'];
    $bar = $services->get('bar');

If you'd like to determine if a service is available, but not loaded yet:

.. code-block:: php

    if ($services->isAvailable('foo')) {
        $foo = $services['foo'];
    } else {
        $services->setService('foo', 'MyApp\SomeService');
    }

The ``isLoaded`` method determines if the service has been set and already previously loaded:

.. code-block:: php

    if ($services->isLoaded('foo')) {
        $foo = $services['foo'];
    } else {
        $services->setService('foo', 'MyApp\SomeService');
    }

This is because service locator uses "lazy-loading" to store the service names and its attributes,
but doesn't load or create the services until they are actually called from the service locator.

You can remove a service from the service locator if needed:

.. code-block:: php

    $services->remove('foo');
    unset($services['bar']);

Syntax & Parameters
-------------------

You have a couple of different options when setting services. You can pass callable strings or already
instantiated instances of objects, although the latter would be potentially less efficient. Also, if
needed, you can define parameters that will be passed into the service being called.

Valid callable service strings are as follows:

1. 'SomeClass'
   Creates a new instance of 'SomeClass' and returns it.
2. 'SomeClass->foo'
   Creates a new instance of 'SomeClass', calls the method 'foo' and returns the value from it.
3. 'SomeClass::bar'
   Calls the static method 'bar' and returns the value from it.

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

In the example above, the service ``foo`` is defined by the callable ``MyApp\SomeService->foo``.
When the service ``foo`` is retrieved, the locator will create a new instance of ``MyApp\SomeService``,
call the method ``foo`` while passing the params ``bar`` and ``baz`` into the method and returning
that value from that method.
