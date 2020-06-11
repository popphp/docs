pop-auth
========

The `popphp/pop-auth` component is an authentication component that provides different adapters
to authenticate a user's identity. It is not to be confused with the ACL component, as that deals
with user roles and access to certain resources and not authenticating user identity.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-auth

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-auth": "^3.1.0",
        }
    }

Basic Use
---------

You can authenticate using a file, a database, over HTTP or over LDAP.

File
~~~~

For this example, we use a file called ``.htmyauth`` containing a colon-delimited
list of usernames and encrypted passwords:

.. code-block:: text

    admin:$...some hash...
    editor:$...some hash...
    reader:$...some hash...

.. code-block:: php

    use Pop\Auth;

    $auth = new Auth\File('/path/to/.htmyauth');
    $auth->authenticate('admin', '12admin34');

    if ($auth->isValid()) { } // Returns true

Database
~~~~~~~~

For this example, there is a table in a database called 'users' and a correlating table class
called ``MyApp\\Users`` that extends ``Pop\\Db\\Record``.

For simplicity, the table has a column called `username` and a column called `password`.
By default, the table adapter will look for a `username` column and a `password` column
unless otherwise specified.

.. code-block:: php

    use Pop\Auth;

    $auth = new Auth\Table('MyApp\Users');

    // Attempt #1
    $auth->authenticate('admin', 'bad-password');

    // Returns false because the value of the hashed attempted
    // password does not match the hash in the database
    if ($auth->isValid()) { }

    // Attempt #2
    $auth->authenticate('admin', '12admin34');
    
    // Returns the id for the user in the database (for later use)
    $userId = $auth->getUser()->id;

    // Returns true because the value of the hashed attempted
    // password matches the hash in the database
    if ($auth->isValid()) { }

HTTP
~~~~

In this example, the user can simply authenticate using a remote server over HTTP.
Based on the headers received from the initial request, the Http adapter will
auto-detect most things, like the the auth type (Basic or Digest), content encoding, etc.

.. code-block:: php

    use Pop\Auth;

    $auth = new Auth\Http('https://www.domain.com/auth', 'post');
    $auth->authenticate('admin', '12admin34');

    if ($auth->isValid()) { } // Returns true

LDAP
~~~~

Again, in this example, the user can simply authenticate using a remote server, but this
time, using LDAP. The user can set the port and other various options that may be necessary
to communicate with the LDAP server.

.. code-block:: php

    use Pop\Auth;

    $auth = new Auth\Ldap('ldap.domain', 389, [LDAP_OPT_PROTOCOL_VERSION => 3]);
    $auth->authenticate('admin', '12admin34');

    if ($auth->isValid()) { } // Returns true
