Installation
============

Installing Pop PHP is simple and there are couple of different options. You can use Composer
or you can download the stand-alone version from the website http://www.popphp.org/

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
        "popphp/popphp-framework": "2.0.*"
    }

**Add it to an existing project**

.. code-block:: bash

    composer require popphp/popphp-framework

If you only want to use the core components, you can use the ``popphp/popphp`` repository
instead of the full ``popphp/popphp-framework`` repository.

Stand-alone Installation
------------------------

Of course, if you do not wish to use Composer and want to install a stand-alone version of Pop,
you can download a full version of the framework from the website http://www.popphp.org/. It is
set up for web applications by default, but can been switched to handle CLI applications as well.
The following files and folders are included:

* ``/public/``
    * ``index.php``
    * ``.htaccess``
* ``/vendor/``

*(The "vendor" folder contains the autoloader, the framework and all of the necessary components.)*
