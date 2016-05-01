Pop\\Web
========

The `popphp/pop-web` component provides a basic toolbox of common web sub-components, such
classes to manage sessions and cookies.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-web

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-web": "2.0.*",
        }
    }

Basic Use
---------

The ``popphp/pop-web`` component has a few useful sub-components that come with it. The two most commonly
used would be the **session** and **cookie** sub-components.

Sessions
~~~~~~~~

The session sub-component gives you multiple ways to interact with the ``$_SESSION`` variable and store
and retrieve data to it. The following are supported:

* Managing basic sessions and session values
* Creating namespaced sessions
* Setting session value expirations
* Setting request-based session values

**Basic Sessions**

.. code-block:: php

    $sess = Pop\Web\Session::getInstance();
    $sess->user_id    = 1001;
    $sess['username'] = 'admin';

The above snippet saves values to the user's session. To recall it later, you can access the session like this:

.. code-block:: php

    $sess = Pop\Web\Session::getInstance();
    echo $sess->user_id;    // echos out 1001
    echo $sess['username']; // echos out 'admin'

And to destroy the session and its values, you can call the ``kill()`` method:

.. code-block:: php

    $sess = Pop\Web\Session::getInstance();
    $sess->kill();

**Namespaced Sessions**

Namespaced sessions allow you to store session under a namespace to protect and preserve that data away
from the normal session data.

.. code-block:: php

    $sessFoo = new Pop\Web\SessionNamespace('foo');
    $sessFoo->bar = 'baz'

What's happening "under the hood" is that an array is being created with the key ``foo`` in the main ``$_SESSION``
variable and any data that is saved or recalled by the ``foo`` namespaced session object will be stored in that array.

.. code-block:: php

    $sessFoo = new Pop\Web\SessionNamespace('foo');
    echo $sessFoo->bar; // echos out 'baz'

    $sess = Pop\Web\Session::getInstance();
    echo $sess->bar; // echos out null, because it was only stored in the namespaced session

And you can unset a value under a session namespace like this:

.. code-block:: php

    $sessFoo = new Pop\Web\SessionNamespace('foo');
    unset($sessFoo->bar);

**Session Value Expirations**

Both basic sessions and namespaced sessions support timed values used to "expire" a value stored in session.

.. code-block:: php

    $sess = Pop\Web\Session::getInstance();
    $sess->setTimedValue('foo', 'bar', 60);

The above example will set the value for ``foo`` with an expiration of 60 seconds. That means that if another
request is made after 60 seconds, ``foo`` will no longer be available in session.

**Request-Based Session Values**

Request-based session values can be stored as well, which sets a number of time, or "hops", that a value is
available in session. This is useful for **flash messaging**. Both basic sessions and namespaced sessions
support request-based session values.

.. code-block:: php

    $sess = Pop\Web\Session::getInstance();
    $sess->setRequestValue('foo', 'bar', 3);

The above example will allow the value for ``foo`` to be available to the user for 3 requests. After the 3rd
request, ``foo`` will no longer be available in session. The default value of "hops" is 1.

Cookies
~~~~~~~

The cookie sub-component allows you to interact with and manage cookies within the user's session. When you
create a new instance of a cookie object, you can pass it some optional parameters for more control:

.. code-block:: php

    $cookie = Pop\Web\Cookie::getInstance([
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
