Pop\\Crypt
==========

The `popphp/pop-crypt` component is a component for handling data encryption. One-way encryption is
supported via `crypt`, `bcrypt`, `md5` and `sha`. Two-way encryption is supported with `mcrypt`.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-crypt

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-crypt": "2.1.*",
        }
    }

Basic Use
---------

Each crypt object has an API to assist you with building and encrypting the string based on the
set fo rules and procedures associated with each type of encryption.

Crypt
~~~~~

Crypt is one of the more simple ways to encrypt a string into a hash:

.. code-block:: php

    $crypt = new Pop\Crypt\Crypt();
    $crypt->setSalt($crypt->generateRandomString(32));
    $hash  = $crypt->create('my-password');

    // Outputs the hash
    echo $hash;

    if ($crypt->verify('bad-password', $hash)) {} // Returns false
    if ($crypt->verify('my-password', $hash))  {} // Returns true

Bcrypt
~~~~~~

Bcrypt is considered one of the stronger methods of creating encrypted hashes. With it,
you can specify the prefix and performance cost. The higher the cost, the stronger the hash.
However, the higher the cost, the longer it will take to generate the hash. The cost range
values are between '04' and '31'.

Again, it's best to use a strong salt for better security. In fact, it's considered a best
practice to use a strong random string as the salt, which the Bcrypt class generates
automatically for you if you don't specify one.

.. code-block:: php

    $bcrypt = new Pop\Crypt\Bcrypt();
    $bcrypt->setCost('12')
           ->setPrefix('$2y$');

    $hash= $bcrypt->create('my-password');

    // Outputs the hash
    echo $hash;

    if ($bcrypt->verify('bad-password', $hash)) {} // Returns false
    if ($bcrypt->verify('my-password', $hash))  {} // Returns true

Md5
~~~

This isn't to be confused with the basic ``md5()`` function built into PHP. It is not recommended
to use that function for password hashing as it only generates a 32-character hexadecimal number
and is vulnerable to dictionary attacks.

As before, it's best to use a strong salt for better security. In fact, it's considered a best
practice to use a strong random string as the salt. Like Bcrypt, the Md5 class will automatically
generate a random salt for you if you don't specify one.

.. code-block:: php

    $md5  = new Pop\Crypt\Md5();
    $hash = $md5->create('my-password');

    // Outputs the hash
    echo $hash;

    if ($md5->verify('bad-password', $hash)) {} // Returns false
    if ($md5->verify('my-password', $hash))  {} // Returns true

Sha
~~~

This isn't to be confused with the basic ``sha1()`` function built into PHP. It is not recommended
to use that function for password hashing as it only generates a 40-character hexadecimal number
and is vulnerable to dictionary attacks.

With the Sha class, you can set the bits (256 or 515) and rounds (between 1000 and 999999999),
which will affect the performance and strength of the hash.

As before, it's best to use a strong salt for better security. In fact, it's considered a best
practice to use a strong random string as the salt. Like Bcrypt and Md5, the Sha class will
automatically generate a random salt for you if you don't specify one.


.. code-block:: php

    $sha  = new Pop\Crypt\Sha();
    $sha->setBits512()
        ->setRounds(10000);

    $hash = $sha->create('my-password');

    // Outputs the hash
    echo $hash;

    if ($sha->verify('bad-password', $hash)) {} // Returns false
    if ($sha->verify('my-password', $hash))  {} // Returns true

Mcrypt
~~~~~~

Mcrypt provides a way to create a two-way encryption hash, in which you can create an unreadable
encrypted hash and then decrypt it later to retrieve the value of it. You have several parameters
that you can set with the Mcrypt class to help control the performance and security of the hashing.
These values are set by default, or you can set them yourself.

As with the others, it's best to use a strong salt for better security. In fact, it's considered
a best practice to use a strong random string as the salt. Like the others, the Mcrypt class will
automatically generate a random salt for you if you don't specify one.

.. code-block:: php

    $mcrypt = new Pop\Crypt\Mcrypt();
    $mcrypt->setCipher(MCRYPT_RIJNDAEL_256)
           ->setMode(MCRYPT_MODE_CBC)
           ->setSource(MCRYPT_RAND);

    $hash = $mcrypt->create('my-password');

    // Outputs the hash
    echo $hash;

    if ($mcrypt->verify('bad-password', $hash)) {} // Returns false
    if ($mcrypt->verify('my-password', $hash))  {} // Returns true

You can then retrieve the value of the hash by decrypting it:

.. code-block:: php

    $decrypted = $mcrypt->decrypt($hash);

    // Outputs 'my-password'
    echo $decrypted;
