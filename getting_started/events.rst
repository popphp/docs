Events
======

The event manager provides a way to hook specific events and functionality into certain points in an
application's life cycle. You can create an event manager object and attach, detach or trigger events.
You can pass callable strings or already instantiated instances of objects, although the latter would
be potentially less efficient.

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

In the above example, any events triggered by ``foo`` will get the application object injected into them
so that the event called can utilize that object and retrieve configuration values from it.

To detach an event, you simply call the ``off`` method:

.. code-block:: php

    $events->off('foo');

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
in your application sends its response. You could create an event hook point in your application like this:

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
as a property. Also, it injects the controller object into the event in case the event called requires
interaction with the controller or any of its properties. By default, the application object is injected
into the events that are triggered from a Pop application object, but as demonstrated above, you can
inject your own required parameters into an event call as well.

.. _services: ./services.html#syntax-parameters
