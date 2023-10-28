pop-session
===========

The `popphp/pop-session` component provides the functionality to manage sessions.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-session

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-session": "^4.0.0"
        }
    }

Basic Use
---------

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
