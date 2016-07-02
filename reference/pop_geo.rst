Pop\\Geo
========

The `popphp/pop-geo` component provides a simple API for some common geographic needs, such as distance
calculation between two sets of coordinates. For this component to fully function, it requires the GeoIP
extension to be installed.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-geo

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-geo": "2.1.*",
        }
    }

Basic Use
---------

If the GeoIP extension and databases are installed, it will autodetect information based on the IP.

.. code-block:: php

    use Pop\Geo\Geo;

    $nola = new Geo();

    echo $nola->getLatitude();  // 29.9546500
    echo $nola->getLongitude(); // -90.0750700

Calculate Distance
------------------

You can give it a second set of coordinates to calculate the distance between them:

.. code-block:: php

    use Pop\Geo\Geo;

    $houston = new Geo([
        'latitude'  => 29.7632800,
        'longitude' => -95.3632700
    ]);

    echo $nola->distanceTo($houston);          // Outputs '317.11' miles
    echo $nola->distanceTo($houston, 2, true); // Outputs '510.34' kilometers

The 2nd parameter is the number of decimal places to round to, and the 3rd parameter returns
the value in kilometers instead of miles.

You can also manually give it 2 sets of points as well:

.. code-block:: php

    use Pop\Geo\Geo;

    $nola = [
        'latitude'  => 29.9546500,
        'longitude' => -90.0750700
    ];

    $houston = [
        'latitude'  => 29.7632800,
        'longitude' => -95.3632700
    ];

    echo Geo::calculateDistance($nola, $houston); // Outputs '317.11' miles
