Pop\\Version
============

The `popphp/pop-version` component provides a simple API to test which version of Pop is installed,
as well as evaluate the environment in which your application is running.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-version

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-version": "2.1.*",
        }
    }

Basic Use
---------

Check the version

.. code-block:: php

    // echo '2.0.0'
    echo Pop\Version\Version::VERSION;

    // echo '2.0.0'
    echo Pop\Version\Version::getLatest();

    // Returns true
    if (Pop\Version\Version::isLatest()) { }

Evaluate the system environment

.. code-block:: php

    $env = Pop\Version\Version::systemCheck();

That will return an array will values like this:

.. code-block:: php

    Array
    (
        [pop] => Array
            (
                [installed] => 2.0.0
                [latest] => 2.0.0
                [compare] => 0
            )

        [php] => Array
            (
                [installed] => 5.4.32
                [required] => 5.4.0
                [compare] => 1
            )

        [windows] =>
        [environment] => Array
            (
                [apc] => 1
                [archive] => Array
                    (
                        [tar] =>
                        [rar] => 1
                        [zip] => 1
                        [bz2] => 1
                        [zlib] => 1
                    )

                [curl] => 1
                [db] => Array
                    (
                        [mysqli] => 1
                        [oracle] =>
                        [pdo] => Array
                            (
                                [mysql] => 1
                                [pgsql] => 1
                                [sqlite] => 1
                                [sqlsrv] =>
                            )

                        [pgsql] => 1
                        [sqlite] => 1
                        [sqlsrv] =>
                    )

                [dom] => Array
                    (
                        [dom_document] => 1
                        [simple_xml] => 1
                    )

                [ftp] => 1
                [geoip] => 1
                [image] => Array
                    (
                        [gd] => 1
                        [gmagick] =>
                        [imagick] => 1
                    )

                [ldap] => 1
                [mcrypt] => 1
                [memcache] => 1
                [soap] => 1
                [yaml] => 1
            )

    )

