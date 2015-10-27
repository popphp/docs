Events
======

The event manager provides a way to hook specific event listeners and functionality into certain points
in an application's life cycle. You can create an event manager object and attach, detach or trigger event
listeners. You can pass callable strings or already instantiated instances of objects, although the latter
could be potentially less efficient.

.. code-block:: php

    $events = new Pop\Event\Manager();

    $events->on('foo', 'MyApp\Event->bootstrap');
    $events->on('bar', 'MyApp\Event::log');

    $events->trigger('foo');

Similar to `services`_, the valid callable strings for events are as follows:

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

    $events->off('foo');

Event Priority
--------------

Event listeners attached to the same event handler can be assigned a priority value to determine the order
in which they fire. The higher the priority value, the earlier the event listener will fire.

.. code-block:: php

    $events->on('foo', 'MyApp\Event->bootstrap', 100);
    $events->on('foo', 'MyApp\Event::log', 10);

In the example above, the ``bootstrap`` event listener has the higher priority, so therefore it will fire
before the ``log`` event listener.

Events in a Pop Application
---------------------------

Within the context of a Pop application object, an event manager object is created by default or one can
be injected. The default hook points within a Pop application object are:

* app.init
* app.route.pre
* app.route.post
* app.dispatch.pre
* app.dispatch.post
* app.error

This conveniently wires together various common points in the application's life cycle where one may need
to fire off an event of some kind. You can build upon these event hook points, creating your own that are
specific to your application. For example, perhaps you require an event hook point right before a controller
in your application sends a response. You could create an event hook point in your application like this:

.. code-block:: php

    $application->on('app.send.pre', 'MyApp\Event::logResponse');

And then in your controller method, right before you send then response, you would trigger that event:

.. code-block:: php

    class MyApp\Controller\IndexController extends \Pop\Controller\AbstractController
    {
        public function index()
        {
            $this->application->trigger->('app.send.pre', ['controller' => $this]);
            echo 'Home Page';
        }
    }

The above example assumes that the application object is injected into the controller object and stored
as a property. Also, it injects the controller object into the event listener in case the event called
requires interaction with the controller or any of its properties. By default, the application object is
injected into the events that are triggered from a Pop application object, but as demonstrated above,
you can inject your own required parameters into an event call as well.

.. _services: ./services.html#syntax-parameters
