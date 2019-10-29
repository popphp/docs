pop-cookie
==========

The `popphp/pop-cookie` component provides the basic functionality to manage cookies.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-cookie

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-cookie": "^3.1.3",
        }
    }

Basic Use
---------

The cookie component allows you to interact with and manage cookies within the user's session. When you
create a new instance of a cookie object, you can pass it some optional parameters for more control:

.. code-block:: php

    $cookie = Pop\Cookie\Cookie::getInstance([
        'expire'   => 300,
        'path'     => '/system',
        'domain'   => 'www.domain.com',
        'secure'   => true,
        'httponly' => true
    ]);

These are all options that give you further control over when a cookie value expires and where and how it
is available to the user. From there, you can store and retrieve cookie values like this:

.. code-block:: php

    $cookie->foo   = 'bar';
    $cookie['baz'] = 123;

    echo $cookie->foo;   // echos 'bar'
    echo $cookie['baz']; // echos 123

And then you can delete a cookie value like this:

.. code-block:: php

    $cookie->delete('foo');
    unset($cookie['baz']);
