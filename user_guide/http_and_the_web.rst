HTTP and the Web
================

In building a web application with the Pop PHP Framework, there are a few concepts and components
that you'll need to be familiar with. Along with the core components, one would commonly leverage
the ``pop-http`` component, the ``pop-view`` component and the ``pop-web`` component  to get started
on building a web application with Pop PHP.

MVC
---

Pop PHP Framework is an MVC framework. It is assumed that you have some familiarity with the
`MVC design pattern`_. An overly simple description of it is that the "controller" (C) controls
and routes the incoming requests, calling the proper "models" (M) to handle the business logic
of the requests, returning the results of what was requested back to the user in a "view" (V).
The basic idea is separation of concerns in that each component of the MVC pattern is only
concerned with the one area it is assigned to handle, and that there is very little, if any,
cross-cutting concerns among them.

HTTP
----

The ``pop-http`` component contains a **request object** and a **response object** that can assist in
capturing and managing the incoming requests to your application and handle assembling the appropriate
response to push back out to the user.

Requests
~~~~~~~~

The main request class is ``Pop\Http\Request``. It has a robust API to allow you to interact with the
incoming request and extract data from it. If you pass nothing to the constructor a new request object,
it will attempt to parse the value contained in ``$_SERVER['REQUEST_URI']``. You can, however, pass it
a ``$uri`` to force a specific request, and also a ``$basePath`` to let the request object know that the
base of the application is contained in a sub-folder under the document root.

**Creating a new request object with a base path**

In the following example, let's assume our application is in a sub-folder under the main document root:

+ ``/httpdocs``
+ ``/httpdocs/system``
+ ``/httpdocs/system/index.php``

We create a request object and passing it a base path of ``/system`` so that application knows to parse
incoming request after the ``/system`` base path.

.. code-block:: php

    $request = new Pop\Http\Request(null, '/system');

For example, if a request of ``/system/users`` came in, the application would know to use ``/users`` as
the request and route it accordingly. If you need to reference the request URI, there are a couple of
different methods to do so:

* ``$request->getBasePath();`` - return only the base path ('/system')
* ``$request->getRequestUri();`` - return only the request URI ('/users/)
* ``$request->getFullRequestUri();`` - return the full request URI string ('/system/users/)

**Getting path segments**

If you need to break apart a URI into its segments access them for your application, you can do it with
the ``getPath()`` method. Consider the URI ``/users/edit/1001``:

* ``$request->getPath(0);`` - return 'users'
* ``$request->getPath(1);`` - return 'edit'
* ``$request->getPath(2);`` - return '1001'
* ``$request->getPath();`` - return an array containing all of the path segments

**Test Which HTTP Method**

* ``$request->isGet();``
* ``$request->isHead();``
* ``$request->isPost();``
* ``$request->isPut();``
* ``$request->isDelete();``
* ``$request->isTrace();``
* ``$request->isHead();``

**Retrieve Data from the Request**

* ``$request->getQuery($key = null);``
* ``$request->getPost($key = null);``
* ``$request->getFiles($key = null);``
* ``$request->getPut($key = null);``
* ``$request->getPatch($key = null);``
* ``$request->getServer($key = null);``
* ``$request->getEnv($key = null);``

If you do not pass the ``$key`` parameter in the above methods, the full array of values will be returned.
The results from the ``getQuery()``, ``getPost()`` and ``getFiles()`` methods mirror what is contained in
the ``$_GET``, ``$_POST`` and ``$_FILES`` globals. However, if the request method passed is **PUT** or
**PATCH**, the request object will attempt to parse the raw request data to provide the data from that.
The request object will also attempt to be content-aware and parse JSON or XML from the data if it
successfully detects a content type from the request.

If you need to access the raw request data or the parsed request data,you can do so with these methods:

* ``$request->getRawData();``
* ``$request->getParsedData();``

**Retrieve Request Headers**

* ``$request->getHeader($key);`` - return a single request header value
* ``$request->getHeaders();`` - return all header values in an array

Responses
~~~~~~~~~

The main response class is ``Pop\Http\Response``.



Views
-----



Web Components
--------------

Sessions
~~~~~~~~

Cookies
~~~~~~~




Putting It Together
-------------------



.. _MVC design pattern: https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller