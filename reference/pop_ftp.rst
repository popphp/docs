pop-ftp
=======

The `popphp/pop-ftp` component provides a simple API for the managing FTP connections and transferring files
over FTP.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-ftp

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-ftp": "^3.0.3",
        }
    }

Basic Use
---------

Create a new directory, change into it and upload a file:

.. code-block:: php

    use Pop\Ftp\Ftp;

    $ftp = new Ftp('ftp.myserver.com', 'username', 'password');

    $ftp->mkdir('somedir');
    $ftp->chdir('somedir');

    $ftp->put('file_on_server.txt', 'my_local_file.txt');

Download a file from a directory:

.. code-block:: php

    use Pop\Ftp\Ftp;

    $ftp = new Ftp('ftp.myserver.com', 'username', 'password');

    $ftp->chdir('somedir');

    $ftp->get('my_local_file.txt', 'file_on_server.txt');
