pop-event
=========

The ``Pop\Event`` sub-component is part of the core `popphp/popphp` component. It serves as the
event manager and listener of the event-driven portion of an application written with Pop.

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

The event manager provides a way to hook specific event listeners and functionality into certain points
in an application's life cycle. You can create an event manager object and attach, detach or trigger event
listeners. You can pass callable strings or already instantiated instances of objects, although the latter
could be potentially less efficient.

.. code-block:: php

    $events = new Pop\Event\Manager();

    $events->on('foo', 'MyApp\Event->bootstrap');
    $events->on('bar', 'MyApp\Event::log');

    $events->trigger('foo');

The valid callable strings for events are as follows:

1. 'SomeClass'
2. 'SomeClass->foo'
3. 'SomeClass::bar'

With events, you can also inject parameters into them as they are called, so that they may have access to
any required elements or values of your application. For example, perhaps you need the events to have access
to configuration values from your main application object:

.. code-block:: php

    $events->trigger('foo', ['application' => $application]);

In the above example, any event listeners triggered by ``foo`` will get the application object injected
into them so that the event called can utilize that object and retrieve configuration values from it.

To detach an event listener, you call the ``off`` method:

.. code-block:: php

    $events->off('foo', 'MyApp\Event->bootstrap');

Event Priority
--------------

Event listeners attached to the same event handler can be assigned a priority value to determine the order
in which they fire. The higher the priority value, the earlier the event listener will fire.

.. code-block:: php

    $events->on('foo', 'MyApp\Event->bootstrap', 100);
    $events->on('foo', 'MyApp\Event::log', 10);

In the example above, the ``bootstrap`` event listener has the higher priority, so therefore it will fire
before the ``log`` event listener.
