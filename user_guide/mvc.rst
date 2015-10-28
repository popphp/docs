MVC
===

Pop PHP Framework is an MVC framework. It is assumed that you have some familiarity with the
`MVC design pattern`_. An overly simple description of it is that the "controller" (C) serves
as the bridge between the "models" (M) and "view" (V). It calls the proper models to handle
the business logic of the request, returning the results of what was requested back to the
user in a view. The basic idea is separation of concerns in that each component of the MVC
pattern is only concerned with the one area it is assigned to handle, and that there is very
little, if any, cross-cutting concerns among them.

Controllers
-----------

There is a controller interface ``Pop\Controller\ControllerInterface`` and an abstract controller
class ``Pop\Controller\AbstractController`` that are provided with the core components of the
Pop PHP Framework. The main application object and router object are wired to interact with
controller objects that extend the abstract controller class, or at least implement the
controller interface. The functionality is basic, as the API manages a default action and the
dispatch method:

* ``$controller->setDefaultAction($default)``
    - The "setDefaultAction" method sets the default action to handle a request that hasn't
      been assigned an action. Typically, this would be an "error" method or something along
      those lines. This method may not be used at all, as you can set the protected ``$defaultAction``
      property within your child controller class directly.
* ``$controller->getDefaultAction()``
    - This method retrieves the name of the current default action.
* ``$controller->dispatch($action = null, $params = null)``
    - This is the main dispatch method, which will look for the "$action" method within
      the controller class and attempt to execute it, passing the "$params" into it if they
      are present. If the "$action" method is not found, the controller will fall back on
      the defined default action.

Views
-----

The ``popphp/pop-view`` component provides the functionality for creating and rendering views.
The topic of views will be covered more in-depth in the next section of the user guide, `Views`_.
But for now, know that the view component supports both file-based templates and string or
stream-based templates. Data can be pushed into and retrieved from a view object and a template
can be set in which the data will be rendered. A basic example would be:

.. code-block:: php

    $data = [
        'title'   => 'Home Page',
        'content' => '<p>Some page content.</p>'
    ];

    $view = new Pop\View\View('index.phtml', $data);

    echo $view;

Assuming the ``index.phtml`` template file is written containing the variables ``$title`` and
``$content``, that data will be parsed and displayed within that template.

Again, the main ideas and concepts of the view component will be explored more the `Views`_ section
of the user guide.

Models
------

There is no official "model component" with Pop PHP. This is because the model component of your
application should be specific to your application. It is the thing that knows all about your application's
business logic and data and knows how to handle it. So a component with that responsibility within
you application should be written specifically for your application.

Model objects could be simple repositories that handle data transactions and provide data to views.
They could integrate with your data source, such as a database, to save and retrieve data for your
application. There are many different ways you can go with how you build and utilize model objects
within your application.

More in-depth examples will be given later in the user guide.

.. _MVC design pattern: https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller
.. _Views: ./views.html