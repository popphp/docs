HTTP and the Web
================

In building a web application with the Pop PHP Framework, there are a few concepts and components
with which you'll need to be familiar. Along with the core components, one would commonly leverage
the ``popphp/pop-http`` and ``popphp/pop-session`` components to get started on building a web
application with Pop PHP.

HTTP
----

The ``popphp/pop-http`` component contains a **request object** and a **response object** that can assist in
capturing and managing the incoming requests to your application and handle assembling the appropriate
response back to the user.

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

We create a request object and pass it the base path ``/system`` so that application knows to parse
incoming request after the ``/system`` base path.

.. code-block:: php

    $request = new Pop\Http\Request(null, '/system');

For example, if a request of ``/system/users`` came in, the application would know to use ``/users`` as
the request and route it accordingly. If you need to reference the request URI, there are a couple of
different methods to do so:

* ``$request->getBasePath();`` - returns only the base path ('/system')
* ``$request->getRequestUri();`` - returns only the request URI ('/users')
* ``$request->getFullRequestUri();`` - returns the full request URI string ('/system/users')

**Getting path segments**

If you need to break apart a URI into its segments access them for your application, you can do it with
the ``getPath()`` method. Consider the URI ``/users/edit/1001``:

* ``$request->getSegment(0);`` - returns 'users'
* ``$request->getSegment(1);`` - returns 'edit'
* ``$request->getSegment(2);`` - returns '1001'
* ``$request->getSegments();`` - returns an array containing all of the path segments

**Check the HTTP Method**

* ``$request->isGet();``
* ``$request->isHead();``
* ``$request->isPost();``
* ``$request->isPut();``
* ``$request->isPatch();``
* ``$request->isDelete();``
* ``$request->isTrace();``
* ``$request->isHead();``
* ``$request->isOptions();``
* ``$request->isConnect();``

**Retrieve Data from the Request**

* ``$request->getQuery($key = null);``
* ``$request->getPost($key = null);``
* ``$request->getFiles($key = null);``
* ``$request->getPut($key = null);``
* ``$request->getPatch($key = null);``
* ``$request->getDelete($key = null);``
* ``$request->getServer($key = null);``
* ``$request->getEnv($key = null);``

If you do not pass the ``$key`` parameter in the above methods, the full array of values will be returned.
The results from the ``getQuery()``, ``getPost()`` and ``getFiles()`` methods mirror what is contained in
the ``$_GET``, ``$_POST`` and ``$_FILES`` global arrays, respectively. The ``getServer()`` and ``getEnv()``
methods mirror the ``$_SERVER`` and ``$_ENV`` global arrays, respectively.

If the request method passed is **PUT**, **PATCH** or **DELETE**, the request object will attempt to parse
the raw request data to provide the data from that. The request object will also attempt to be content-aware
and parse JSON or XML from the data if it successfully detects a content type from the request.

If you need to access the raw request data or the parsed request data, you can do so with these methods:

* ``$request->getRawData();``
* ``$request->getParsedData();``

**Retrieve Request Headers**

* ``$request->getHeader($key);`` - return a single request header value
* ``$request->getHeaders();`` - return all header values in an array

Responses
~~~~~~~~~

The ``Pop\Http\Response`` class has a full-featured API that allows you to create a outbound response to send
back to the user or parse an inbound response from a request. The main constructor of the response object accepts
a configuration array with the basic data to get the response object started:

.. code-block:: php

    $response = new Pop\Http\Response([
        'code'    => 200,
        'message' => 'OK',
        'version' => '1.1',
        'body'    => 'Some body content',
        'headers' => [
            'Content-Type' => 'text/plain'
        ]
    ]);

All of that basic response data can also be set as needed through the API:

* ``$response->setCode($code);`` - set the response code
* ``$response->setMessage($message);`` - set the response message
* ``$response->setVersion($version);`` - set the response version
* ``$response->setBody($body);`` - set the response body
* ``$response->setHeader($name, $value);`` - set a response header
* ``$response->setHeaders($headers);`` - set response headers from an array

And retrieved as well:

* ``$response->getCode();`` - get the response code
* ``$response->getMessage();`` - get the response message
* ``$response->getVersion();`` - get the response version
* ``$response->getBody();`` - get the response body
* ``$response->getHeader($name);`` - get a response header
* ``$response->getHeaders($headers);`` - get response headers as an array
* ``$response->getHeadersAsString();`` - get response headers as a string

**Check the Response**

* ``$response->isSuccess();`` - 100, 200 or 300 level response code
* ``$response->isRedirect();`` - 300 level response code
* ``$response->isError();`` - 400 or 500 level response code
* ``$response->isClientError();`` - 400 level response code
* ``$response->isServerError();`` - 500 level response code

And you can get the appropriate response message from the code like this:

.. code-block:: php

    use Pop\Http\Response;

    $response = new Response();
    $response->setCode(403);
    $response->setMessage(Response::getMessageFromCode(403)); // Sets 'Forbidden'

**Sending the Response**

.. code-block:: php

    $response = new Pop\Http\Response([
        'code'    => 200,
        'message' => 'OK',
        'version' => '1.1',
        'body'    => 'Some body content',
        'headers' => [
            'Content-Type'   => 'text/plain'
        ]
    ]);

    $response->setHeader('Content-Length', strlen($response->getBody()));
    $response->send();

The above example would produce something like:

.. code-block:: text

    HTTP/1.1 200 OK
    Content-Type: text/plain
    Content-Length: 19

    Some body content

**Redirecting a Response**

.. code-block:: php

    Pop\Http\Response::redirect('http://www.domain.com/some-new-page');
    exit();

**Parsing a Response**

In parsing a response from a request, you pass either the URL or a response string that
already exists. A new response object with all of its data parsed from that response
will be created:

.. code-block:: php

    $response = Pop\Http\Response::parse('http://www.domain.com/some-page');

    if ($response->getCode() == 200) {
        // Do something with the response
    } else if ($response->isError()) {
        // Uh oh. Something went wrong
    }


Sessions
--------

The session component gives you multiple ways to interact with the ``$_SESSION`` variable and store
and retrieve data to it. The following are supported:

* Managing basic sessions and session values
* Creating namespaced sessions
* Setting session value expirations
* Setting request-based session values

**Basic Sessions**

.. code-block:: php

    $sess = Pop\Session\Session::getInstance();
    $sess->user_id    = 1001;
    $sess['username'] = 'admin';

The above snippet saves values to the user's session. To recall it later, you can access the session like this:

.. code-block:: php

    $sess = Pop\Session\Session::getInstance();
    echo $sess->user_id;    // echos out 1001
    echo $sess['username']; // echos out 'admin'

And to destroy the session and its values, you can call the ``kill()`` method:

.. code-block:: php

    $sess = Pop\Session\Session::getInstance();
    $sess->kill();

**Namespaced Sessions**

Namespaced sessions allow you to store session under a namespace to protect and preserve that data away
from the normal session data.

.. code-block:: php

    $sessFoo = new Pop\Session\SessionNamespace('foo');
    $sessFoo->bar = 'baz'

What's happening "under the hood" is that an array is being created with the key ``foo`` in the main ``$_SESSION``
variable and any data that is saved or recalled by the ``foo`` namespaced session object will be stored in that array.

.. code-block:: php

    $sessFoo = new Pop\Session\SessionNamespace('foo');
    echo $sessFoo->bar; // echos out 'baz'

    $sess = Pop\Session\Session::getInstance();
    echo $sess->bar; // echos out null, because it was only stored in the namespaced session

And you can unset a value under a session namespace like this:

.. code-block:: php

    $sessFoo = new Pop\Session\SessionNamespace('foo');
    unset($sessFoo->bar);

**Session Value Expirations**

Both basic sessions and namespaced sessions support timed values used to "expire" a value stored in session.

.. code-block:: php

    $sess = Pop\Session\Session::getInstance();
    $sess->setTimedValue('foo', 'bar', 60);

The above example will set the value for ``foo`` with an expiration of 60 seconds. That means that if another
request is made after 60 seconds, ``foo`` will no longer be available in session.

**Request-Based Session Values**

Request-based session values can be stored as well, which sets a number of time, or "hops", that a value is
available in session. This is useful for **flash messaging**. Both basic sessions and namespaced sessions
support request-based session values.

.. code-block:: php

    $sess = Pop\Session\Session::getInstance();
    $sess->setRequestValue('foo', 'bar', 3);

The above example will allow the value for ``foo`` to be available to the user for 3 requests. After the 3rd
request, ``foo`` will no longer be available in session. The default value of "hops" is 1.
