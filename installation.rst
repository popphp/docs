Installation
============

You can use Composer to install the Pop PHP Framework or any of its supporting components.

Using Composer
--------------

If you want to use the full framework and all of its components, you can install
the ``popphp/popphp-framework`` repository in the following ways:

**Option 1: Create a New Project**

.. code-block:: bash

    composer create-project popphp/popphp-framework project-folder

**Option 2: Clone the Repo**

.. code-block:: bash

    git clone https://github.com/popphp/popphp-framework.git popphp
    cd popphp
    composer install

**Option 3: Use `composer require`**

.. code-block:: bash

    composer require popphp/popphp-framework

**Option 4: Use `composer.json`**

.. code-block:: json

    "require": {
        "popphp/popphp-framework": "^5.0.0"
    }


If you only want to use the core components, you can use the ``popphp/popphp`` repository
instead of the full ``popphp/popphp-framework`` repository.

Requirements
------------

The Pop PHP Framework has been built for and tested with **PHP 8.2** but at a minimum, it requires **8.1**.
So the only true requirement is that to have at least **PHP 8.1** installed in the environment.

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

