Installation
============

There are a couple of different options to install the Pop PHP Framework. You can use Composer
or you can download the stand-alone version from the website http://www.popphp.org/.

Using Composer
--------------

If you want to use the full framework and all of its components, you can install
the ``popphp/popphp-framework`` repository in the following ways:

**Create a new project**

.. code-block:: bash

    composer create-project popphp/popphp-framework project-folder

**Add it to the composer.json file**

.. code-block:: json

    "require": {
        "popphp/popphp-framework": "^4.6.0"
    }

**Add it to an existing project**

.. code-block:: bash

    composer require popphp/popphp-framework

If you only want to use the core components, you can use the ``popphp/popphp`` repository
instead of the full ``popphp/popphp-framework`` repository.

Requirements
------------

The only main requirement for the Pop PHP Framework is that you have at least **PHP 7.3.0**
installed in your environment.

Recommendations
---------------

**Web Server**

When writing web applications, a web server that supports URL rewrites is recommended, such as:

+ Apache
+ Nginx
+ Lighttpd
+ IIS

**Extensions**

Various components of the Pop PHP Framework require different PHP extensions to function correctly.
If you wish to take advantage of the many components of Pop PHP, the following extensions are
recommended:

+ pop-db
    - mysqli
    - pdo_mysql
    - pdo_pgsql
    - pdo_sqlite
    - pgsql
    - sqlite3
    - sqlsrv

+ pop-image
    - gd
    - imagick

+ pop-cache
    - apc
    - memcached
    - redis

+ pop-debug
    - redis

+ other
    - curl
    - ftp
    - ldap

