pop-http
========

The `popphp/pop-http` component provides a robust API to handle HTTP requests and responses.
Also, it provides HTTP client adapters via cURL and streams, as well as file uploads via HTTP.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-http

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-http": "^4.1.6"
        }
    }

Basic Use
---------

In building a web application with the Pop PHP Framework, there are a few concepts and components
with which you'll need to be familiar. Along with the core components, one would commonly leverage
the ``popphp/pop-http`` component to get started on building a web application with Pop PHP.

Server
------

The ``popphp/pop-http`` component contains a server **request object** and a server **response object**
that can assist in capturing and managing the incoming requests to your application and handle assembling
the appropriate response back to the user.

Requests
~~~~~~~~

The main request class is ``Pop\Http\Server\Request``. It has a robust API to allow you to interact with the
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

    $request = new Pop\Http\Server\Request(null, '/system');

For example, if a request of ``/system/users`` came in, the application would know to use ``/users`` as
the request and route it accordingly. If you need to reference the request URI, there are a couple of
different methods to do so:

* ``$request->getBasePath();`` - returns only the base path ('/system')
* ``$request->getRequestUri();`` - returns only the request URI ('/users')
* ``$request->getFullRequestUri();`` - returns the full request URI string ('/system/users')

**Getting path segments**

If you need to break apart a URI into its segments access them for your application, you can do it with
the ``getSegment()`` method. Consider the URI ``/users/edit/1001``:

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

Auth Headers
~~~~~~~~~~~~

The ``Pop\Http\Auth`` class can assist with parsing an authorization header from an inbound request:

.. code-block:: php

    $request = new Pop\Http\Server\Request();
    $auth    = Pop\Http\Auth::parse($request->getHeader('Authorization'));

    print_r($auth);

.. code-block:: text

    Pop\Http\Auth Object
    (
        [header:protected] => Authorization
        [scheme:protected] => Bearer
        [token:protected] => AUTH_TOKEN
        [username:protected] => 
        [password:protected] => 
        [authHeader:protected] => 
    )


Responses
~~~~~~~~~

The ``Pop\Http\Server\Response`` class has a full-featured API that allows you to create a outbound response to send
back to the user or parse an inbound response from a request. The main constructor of the response object accepts
a configuration array with the basic data to get the response object started:

.. code-block:: php

    $response = new Pop\Http\Server\Response([
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

    use Pop\Http\Server\Response;

    $response = new Response();
    $response->setCode(403);
    $response->setMessage(Response::getMessageFromCode(403)); // Sets 'Forbidden'

**Sending the Response**

.. code-block:: php

    $response = new Pop\Http\Server\Response([
        'code'    => 200,
        'message' => 'OK',
        'version' => '1.1',
        'body'    => 'Some body content',
        'headers' => [
            'Content-Type' => 'text/plain'
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

    Pop\Http\Server\Response::redirect('http://www.domain.com/some-new-page');

**Parsing a Response**

In parsing a response from a request, you pass either the URL or a response string that
already exists. A new response object with all of its data parsed from that response
will be created:

.. code-block:: php

    $response = Pop\Http\Parser::parseResponseFromUri('http://www.domain.com/some-page');

    if ($response->getCode() == 200) {
        // Do something with the response
    } else if ($response->isError()) {
        // Uh oh. Something went wrong
    }

File Uploads
~~~~~~~~~~~~

Management of HTTP file uploads is also available under the ``popphp/pop-http`` component's server
features. With it, you can set parameters such as where to route the uploaded files as well
enforce certain requirements, like file types and file size.

.. code-block:: php

    use Pop\Http\Server\Upload;

    $upload = new Upload('/path/to/uploads');
    $upload->setDefaults();

    $upload->upload($_FILES['file_upload']);

    // Do something with the newly uploaded file
    if ($upload->isSuccess()) {
        $file = $upload->getUploadedFile();
    } else {
        echo $upload->getErrorMessage();
    }

The above code creates the upload object, sets the upload path and sets the basic defaults, which includes a max
file size of 10MBs, and an array of allowed common file types as well as an array of common disallowed file types.

**File upload names and overwrites**

By default, the file upload object will not overwrite a file of the same name. In the above example, if
``$_FILES['file_upload']['name']`` is set to 'my_document.docx' and that file already exists in the upload path,
it will be renamed to 'my_document_1.docx'.

If you want to enable file overwrites, you can do this:

.. code-block:: php

    $upload->overwrite(true);

Also, you can give the file a direct name on upload like this:

.. code-block:: php

    $upload->upload($_FILES['file_upload'], 'my-custom-filename.docx');

And if you need to check for a duplicate filename first, you can use the checkFilename method. If the filename exists,
it will append a '_1' to the end of the filename, or loop through until it finds a number that doesn't exist yet (_#).
If the filename doesn't exist yet, it returns the original name.

.. code-block:: php

    $filename = $upload->checkFilename('my-custom-filename.docx');

    // $filename is set to 'my-custom-filename_1.docx'
    $upload->upload($_FILES['file_upload'], $filename);

Client
------

The ``popphp/pop-http`` component also has two client classes that extend the functionality of both the
PHP cURL extension and PHP's built-in stream functionality. The clients also have their own request and
response classes. The request object is built as you construct the request via the client classes and the
response object is created and returned once the request is sent to a server and a response is returned.

The two examples sets below are almost identical in use. Both client classes are very similar in their API
with only minor differences in the configuration for the client type. Shared methods within both client classes'
APIs include:

* ``$client->setField($name, $value);`` - Set field data to be sent in the request
* ``$client->setFields($fields);`` - Set all field data to be sent in the request
* ``$client->addRequestHeader($name, $value);`` - Add a request header
* ``$client->addRequestHeaders($headers);`` - Add request headers
* ``$client->hasResponseHeader($name);`` - Check is the client has a response header
* ``$client->getResponseHeader($name);`` - Get a response header
* ``$client->getResponseHeaders();`` - Get response headers
* ``$client->getResponseCode();`` - Get response code
* ``$client->getResponseBody();`` - Get raw response body
* ``$client->getParsedResponse();`` - Get the parsed response based on content-type, if available
* ``$client->open();`` - Open and prepare the client request
* ``$client->send();`` - Send the client request

cURL
~~~~

The cURL class gives you control to set up an HTTP request using the underlying PHP cURL extension.

.. code-block:: php

    $client = new Pop\Http\Client\Curl('http://www.mydomain.com/user', 'POST');
    $client->setReturnHeader(true)
           ->setReturnTransfer(true);

    $client->setFields([
        'id'    => 1001,
        'name'  => 'Test Person',
        'email' => 'test@test.com'
    ]);

    $client->send();

    // 200
    echo $client->getResponseCode();

    // Display the body of the returned response
    echo $client->getResponseBody();

Additional methods available with the cURL client API include:

* ``$client->setOption($opt, $val);`` - Set a cURL-specific option
* ``$client->setOptions($opts);`` - Set cURL-specific options
* ``$client->setReturnHeader(true);`` - Set cURL option to return the header
* ``$client->setReturnTransfer(true);`` - Set cURL option to return the transfer

Streams
~~~~~~~

.. code-block:: php

    $client = new Pop\Http\Client\Stream('http://www.mydomain.com/', 'POST');

    $client->setFields([
        'id'    => 1001,
        'name'  => 'Test Person',
        'email' => 'test@test.com'
    ]);

    $client->send();

    // 200
    echo $client->getResponseCode();

    // Display the body of the returned response
    echo $client->getResponseBody();

Additional methods available with the stream client API include:

* ``$client->createContext();`` - Create a new stream context
* ``$client->addContextOption($name, $option);`` - Add a context option
* ``$client->addContextParam($name, $param);`` - Add a context parameter
* ``$client->setContextOptions(array $options);`` - Set context options
* ``$client->setContextParams(array $params);`` - Set context parameters

Both clients support some shorthand methods to assist in creating more complex requests, like forms or JSON payloads.

**Creating a JSON Payload**

If you want the request payload to go across as a JSON payload, you can call this method:

.. code-block:: php

    $client->createAsJson();

This will prep the request for JSON formatting and append the proper ``Content-Type: application/json``
header to the request object.

**Creating a URL-encoded Form**

If you want the request payload to go across as a URL-encoded form, you can call this method:

.. code-block:: php

    $client->createUrlEncodedForm();

This will prep the request for formatting the request field data as a URL-encoded form and append the
proper ``Content-Type: application/x-www-form-urlencoded`` header to the request object.

**Creating a Multipart Form**

If you want the request payload to go across as a multipart form, you can call this method:

.. code-block:: php

    $client->createMultipartForm();

This will prep the request for formatting the request field data as a multipart form and append the
proper ``Content-Type: multipart/form-data`` header to the request object.

Auth Headers
~~~~~~~~~~~~

The ``Pop\Http\Auth`` class can assist with creating an authorization header for outbound HTTP client requests:

**Client Example, Using Basic Auth**

.. code-block:: php

    // Automatically creates the base64 encoded basic auth header
    $client = new Pop\Http\Client\Stream('http://www.mydomain.com/auth', 'POST');
    $client->setAuth(Pop\Http\Auth::createBasic('username', 'password'));
    $client->send();

    // 200, if the credentials are valid
    echo $client->getResponseCode();


**Client Example, Using Bearer Token**

.. code-block:: php

    // Automatically creates the auth header with the correct bearer token
    $client = new Pop\Http\Client\Curl('http://www.mydomain.com/auth', 'POST');
    $client->setAuth(Pop\Http\Auth::createBearer('AUTH_TOKEN'));
    $client->send();

    // 200, if the credentials are valid
    echo $client->getResponseCode();


**Client Example, Using API Key with Custom Header**

.. code-block:: php

    // Automatically creates the auth header with the custom header name and API key value
    $client = new Pop\Http\Client\Stream('http://www.mydomain.com/auth', 'POST');
    $client->setAuth(Pop\Http\Auth::createKey('API_KEY', 'X-Api-Key'));
    $client->send();

    // 200, if the credentials are valid
    echo $client->getResponseCode();
