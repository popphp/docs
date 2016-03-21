Pop\\Loader
===========

The `popphp/pop-loader` component provides an alternative autoloading option for those who may
require a PHP application to function outside of the Composer eco-system. The API mirrors Composer's
API so that the two autoloaders are interchangeable. Furthermore, the component provides a class
mapper class that will parse a provided source folder and generate a static classmap for faster
autoload times.

Installation
------------

Stand-alone
~~~~~~~~~~~

If you are installing this component as a stand-alone autoloader and not using composer, you can
get the component from `the releases page on Github`_. Once you download it and unpack it, you can
put the source files into your application's source directory.

Composer
~~~~~~~~

If you want to install it via composer you can install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-loader

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-loader": "2.0.*",
        }
    }

Basic Use
---------

The `popphp/pop-loader` component manages the autoloading of an application. If, for some reason you
do not or cannot use Composer, `popphp/pop-loader` provides an alternative with similar features and API.
It supports both PSR-4 and PSR-0 autoloading standards. Additionally, there is support for generating
and loading class maps, if you are interested in boosting the speed and performance of your
application's load times.

PSR-4
~~~~~

Let's assume the this class file exists here ``app/src/Test.php``:

.. code-block:: php

    <?php
    namespace MyApp;

    class Test
    {

    }

You can then register that namespace prefix and source location with the autoloaded object like this:

.. code-block:: php

    // Require the main ClassLoader class file
    require_once __DIR__ . '/../src/ClassLoader.php';

    $autoloader = new Pop\Loader\ClassLoader();
    $autoloader->addPsr4('MyApp\\', __DIR__ . '/../app/src');

    // The class is now available
    $test = new MyApp\Test();


PSR-0
~~~~~

There's also support for older the PSR-0 standard. If the class file existed here instead ``app/MyApp/Test.php``,
you could load it like so:

.. code-block:: php

    // Require the main ClassLoader class file
    require_once __DIR__ . '/../src/ClassLoader.php';

    $autoloader = new Pop\Loader\ClassLoader();
    $autoloader->addPsr0('MyApp', __DIR__ . '/../app');

    // The class is now available
    $test = new MyApp_Test();

Classmaps
---------

Loading
~~~~~~~

Let's use the following classmap file, ``classmap.php``, as an example:

.. code-block:: php

    <?php

    return [
        'MyApp\Foo\Bar' => '/path/to/myapp/src/Foo/Bar.php',
        'MyApp\Thing' => '/path/to/myapp/src/Thing.php',
        'MyApp\Test' => '/path/to/myapp/src/Test.php'
    ];

To load the above classmap, you can do the following:

.. code-block:: php

    $autoloader = new Pop\Loader\ClassLoader();
    $autoloader->addClassMapFromFile('classmap.php');

Generating
~~~~~~~~~~

If you'd like to generate a classmap based on your source folder, you can do that as well:

.. code-block:: php

    $mapper = new Pop\Loader\ClassMapper('path/to/myapp/src');
    $mapper->generateClassMap();
    $mapper->writeToFile('path/to/my-classmap.php');

From there, you can then set your autoloader to load that classmap for your application.

.. _the releases page on Github: https://github.com/popphp/pop-loader/releases