Installation
============

Installing Pop PHP is simple and there are couple of different options. You can use Composer
or you can download the stand-alone version from the website http://www.popphp.org/

Using Composer
--------------

If you only want the core components you can install the repository at popphp/popphp in the following ways:

Create a new project
~~~~~~~~~~~~~~~~~~~~
.. code-block:: bash
    composer create-project popphp/popphp project-folder

Add it to the composer.json file
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.. code-block:: bash
    "require": {
        "popphp/popphp": "2.0.*"
    }

Add it to an existing project
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.. code-block:: bash
    composer require popphp/popphp

If you want to use the use the full framework and all of its components, you can use the
`popphp/popphp-framework` repository instead.

Stand-alone Installation
------------------------

Of course, if you do not wish to use Composer and want to download and install a stand-alone version
of Pop, you can download a full version of the framework from the website http://www.popphp.org/
