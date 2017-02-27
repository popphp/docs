pop-image
=========

The `popphp/pop-image` component provides a robust API for image creation and manipulation. Adapters are
provided to utilize either the GD, Imagick or Gmagick extensions. Also, the SVG format is supported with
its own adapter as well.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-image

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-image": "3.0.*",
        }
    }

Basic Use
---------

Image manipulation and processing is another set of features that is often needed for a web
application. It is common to have to process images in some way for the web application to
perform its required functionality. The `popphp/pop-image` component provides that functionality
with a robust set of image processing and manipulation features. Within the component are
adapters written to support the ``Gd``, ``Imagick`` and ``Gmagick`` extensions.

By using either the ``Imagick`` or ``Gmagick`` adapters [*]_, you will open up a larger set of
features and functionality for your application, such as the ability to handle more image formats
and perform more complex image processing functions.

.. [*] It must be noted that the ``imagick`` and ``gmagick`` extensions cannot be used at the same
       time as they have conflicts with shared libraries and components that are used by both extensions.

Choose an Adapter
-----------------

Before you choose which image adapter to use, you may have to determine which PHP image extensions are
available for your application within its environment. There is an API to assist you with that. The following
example tests for each individual adapter to see if one is available, and if not, then moves on to the next:

.. code-block:: php

    if (Pop\Image\Gmagick::isAvailable()) {
        $image = Pop\Image\Gmagick::load('image.jpg');
    } else if (Pop\Image\Imagick::isAvailable()) {
        $image = Pop\Image\Imagick::load('image.jpg');
    } else if (Pop\Image\Gd::isAvailable()) {
        $image = Pop\Image\Gd::load('image.jpg');
    }

Similarly, you can check their availability like this as well:

.. code-block:: php

    // This will work with any of the 3 adapters
    $adapters = Pop\Image\Image::getAvailableAdapters();

    if ($adapters['gmagick']) {
        $image = Pop\Image\Gmagick::load('image.jpg');
    } else if ($adapters['imagick']) {
        $image = Pop\Image\Imagick::load('image.jpg');
    } else if ($adapters['gd']) {
        $image = Pop\Image\Gd::load('image.jpg');
    }

As far as which adapter or extension is the "best" for your application, that will really depend on your
application's needs and what's available in the environment on which your application is running. If you require
advanced image processing that can work with a large number of image formats, then you'll need to utilize either
the ``Imagick`` or ``Gmagick`` adapters. If you only require simple image processing with a limited number of
image formats, then the ``Gd`` adapter should work well.

The point of the API of the `popphp/pop-image` component is to help make applications more portable and mitigate
any issues that may arise should an application need to be installed on a variety of different environments.
The goal is to achieve a certain amount of "graceful degradation," should one of the more feature-rich image
extensions not be available on a new environment.

Basic Use
---------

**Loading an Image**

You can load an existing image from disk like this:

.. code-block:: php

    // Returns an instance of Pop\Image\Adapter\Gd with the image resource loaded
    $image = Pop\Image\Gd::load('path/to/image.jpg');

Or you can load an image from a data source like this:

.. code-block:: php

    // Returns an instance of Pop\Image\Adapter\Gd with the image resource loaded
    $image = Pop\Image\Gd::loadFromString($imageData);

Or create an instance of an image object with a new image resource via:

.. code-block:: php

    // Returns an instance of Pop\Image\Gd with a new image resource loaded
    $image =  Pop\Image\Gd::create(640, 480, 'new.jpg');

All three of the above adapters have the same core API below:

* ``$img->resizeToWidth($w);`` - resize the image to a specified width
* ``$img->resizeToHeight($h);`` - resize the image to a specified height
* ``$img->resize($px);`` - resize image to largest dimension
* ``$img->scale($scale);`` - scale image by percentage, 0.0 - 1.0
* ``$img->crop($w, $h, $x = 0, $y = 0);`` - crop image to specified width and height
* ``$img->cropThumb($px, $offset = null);`` - crop image to squared image of specified size
* ``$img->rotate($degrees, Color\ColorInterface $bgColor = null, $alpha = null);`` - rotate image by specified degrees
* ``$img->flip();`` - flip the image over the x-axis
* ``$img->flop();`` - flip the image over the y-axis
* ``$img->convert($to);`` - convert image to specified image type
* ``$img->writeToFile($to = null, $quality = 100);`` - save image, either to itself or a new location
* ``$img->outputToHttp($quality = 100, $to = null, $download = false, $sendHeaders = true);`` - output image via HTTP

Advanced Use
------------

The `popphp/pop-image` component comes with set of image manipulation objects that provide a more
advanced feature set when processing images. You can think of these classes and their object instances
as the menus at the top of your favorite image editing software.

Adjust
~~~~~~

The adjust object allows you to perform the following methods:

* ``$img->adjust->brightness($amount);``
* ``$img->adjust->contrast($amount);``
* ``$img->adjust->desaturate();``

And with the ``Imagick`` or ``Gmagick`` adapter, you can perform these advanced methods:

* ``$img->adjust->hue($amount);``
* ``$img->adjust->saturation($amount);``
* ``$img->adjust->hsb($h, $s, $b);``
* ``$img->adjust->level($black, $gamma, $white);``

Here's an example making some adjustments to the image resource:

.. code-block:: php

    $img = new Pop\Image\Imagick('image.jpg');
    $img->adjust->brightness(50)
        ->contrast(20)
        ->level(0.7, 1.0, 0.5);

Draw
~~~~

The draw object allows you to perform the following methods:

* ``$img->draw->line($x1, $y1, $x2, $y2);``
* ``$img->draw->rectangle($x, $y, $w, $h = null);``
* ``$img->draw->square($x, $y, $w);``
* ``$img->draw->ellipse($x, $y, $w, $h = null);``
* ``$img->draw->circle($x, $y, $w);``
* ``$img->draw->arc($x, $y, $start, $end, $w, $h = null);``
* ``$img->draw->chord($x, $y, $start, $end, $w, $h = null);``
* ``$img->draw->pie($x, $y, $start, $end, $w, $h = null);``
* ``$img->draw->polygon($points);``

And with the ``Imagick`` or ``Gmagick`` adapter, you can perform these advanced methods:

* ``$img->draw->roundedRectangle($x, $y, $w, $h = null, $rx = 10, $ry = null);``
* ``$img->draw->roundedSquare($x, $y, $w, $rx = 10, $ry = null);``

Here's an example drawing some different shapes with different styles on the image resource:

.. code-block:: php

    $img = new Pop\Image\Imagick('image.jpg');
    $img->draw->setFillColor(255, 0, 0);
        ->draw->setStrokeColor(0, 0, 0);
        ->draw->setStrokeWidth(5);
        ->draw->rectangle(100, 100, 320, 240);
        ->draw->circle(400, 300, 50);

Effect
~~~~~~

The effect object allows you to perform the following methods:

* ``$img->effect->border(array $color, $w, $h = null);``
* ``$img->effect->fill($r, $g, $b);``
* ``$img->effect->radialGradient(array $color1, array $color2);``
* ``$img->effect->verticalGradient(array $color1, array $color2);``
* ``$img->effect->horizontalGradient(array $color1, array $color2);``
* ``$img->effect->linearGradient(array $color1, array $color2, $vertical = true);``

Here's an example applying some different effects to the image resource:

.. code-block:: php

    $img = new Pop\Image\Imagick('image.jpg');
    $img->effect->verticalGradient([255, 0, 0], [0, 0, 255]);

Filter
~~~~~~

Each filter object is more specific for each image adapter. While a number of the available
filter methods are available in all 3 of the image adapters, some of their signatures vary
due the requirements of the underlying image extension.

The ``Gd`` filter object allows you to perform the following methods:

* ``$img->filter->blur($amount, $type = IMG_FILTER_GAUSSIAN_BLUR);``
* ``$img->filter->sharpen($amount);``
* ``$img->filter->negate();``
* ``$img->filter->colorize($r, $g, $b);``
* ``$img->filter->pixelate($px);``
* ``$img->filter->pencil();``

The ``Imagick`` filter object allows you to perform the following methods:

* ``$img->filter->blur($radius = 0, $sigma = 0, $channel = \Imagick::CHANNEL_ALL);``
* ``$img->filter->adaptiveBlur($radius = 0, $sigma = 0, $channel = \Imagick::CHANNEL_DEFAULT);``
* ``$img->filter->gaussianBlur($radius = 0, $sigma = 0, $channel = \Imagick::CHANNEL_ALL);``
* ``$img->filter->motionBlur($radius = 0, $sigma = 0, $angle = 0, $channel = \Imagick::CHANNEL_DEFAULT);``
* ``$img->filter->radialBlur($angle = 0, $channel = \Imagick::CHANNEL_ALL);``
* ``$img->filter->sharpen($radius = 0, $sigma = 0, $channel = \Imagick::CHANNEL_ALL);``
* ``$img->filter->negate();``
* ``$img->filter->paint($radius);``
* ``$img->filter->posterize($levels, $dither = false);``
* ``$img->filter->noise($type = \Imagick::NOISE_MULTIPLICATIVEGAUSSIAN, $channel = \Imagick::CHANNEL_DEFAULT);``
* ``$img->filter->diffuse($radius);``
* ``$img->filter->skew($x, $y, $color = 'rgb(255, 255, 255)');``
* ``$img->filter->swirl($degrees);``
* ``$img->filter->wave($amp, $length);``
* ``$img->filter->pixelate($w, $h = null);``
* ``$img->filter->pencil($radius, $sigma, $angle);``

The ``Gmagick`` filter object allows you to perform the following methods:

* ``$img->filter->blur($radius = 0, $sigma = 0, $channel = \Gmagick::CHANNEL_ALL);``
* ``$img->filter->motionBlur($radius = 0, $sigma = 0, $angle = 0);``
* ``$img->filter->radialBlur($angle = 0, $channel = \Gmagick::CHANNEL_ALL);``
* ``$img->filter->sharpen($radius = 0, $sigma = 0, $channel = \Gmagick::CHANNEL_ALL);``
* ``$img->filter->negate();``
* ``$img->filter->paint($radius);``
* ``$img->filter->noise($type = \Gmagick::NOISE_MULTIPLICATIVEGAUSSIAN);``
* ``$img->filter->diffuse($radius);``
* ``$img->filter->skew($x, $y, $color = 'rgb(255, 255, 255)');``
* ``$img->filter->solarize($threshold);``
* ``$img->filter->swirl($degrees);``
* ``$img->filter->pixelate($w, $h = null);``

Here's an example applying some different filters to the image resource:

.. code-block:: php

    $img = new Pop\Image\Imagick('image.jpg');
    $img->filter->gaussianBlur(10)
        ->swirl(45)
        ->negate();

Layer
~~~~~

The layer object allows you to perform the following methods:

* ``$img->layer->overlay($image, $x = 0, $y = 0);``

And with the ``Imagick`` or ``Gmagick`` adapter, you can perform this advanced method:

* ``$img->layer->flatten();``

Here's an example working with layers over the image resource:

.. code-block:: php

    $img = new Pop\Image\Imagick('image.psd');
    $img->layer->flatten()
        ->overlay('watermark.png', 50, 50);

Type
~~~~

The type object allows you to perform the following methods:

* ``$img->type->font($font);`` - set the font
* ``$img->type->size($size);`` - set the font size
* ``$img->type->x($x);`` - set the x-position of the text string
* ``$img->type->y($y);`` - set the y-position of the text string
* ``$img->type->xy($x, $y);`` - set both the x- and y-position together
* ``$img->type->rotate($degrees);`` - set the amount of degrees in which to rotate the text string
* ``$img->type->text($string);`` - place the string on the image, using the defined parameters

Here's an example working with text over the image resource:

.. code-block:: php

    $img = new Pop\Image\Imagick('image.jpg');
    $img->type->setFillColor(128, 128, 128)
        ->size(12)
        ->font('fonts/Arial.ttf')
        ->xy(40, 120)
        ->text('Hello World!');

Extending the Component
-----------------------

The `popphp/pop-image` component was built in a way to facilitate extending it and injecting your own
custom image processing features. Knowing that the image processing landscape is vast, the component
only scratches the surface and provides the core feature set that was outlined above across the different
adapters.

If you are interested in creating and injecting your own, more robust set of features into the component
within your application, you can do that by extending the available manipulation classes.

For example, if you wanted to add a couple of methods to the adjust class for the ``Gd`` adapter,
you can do so like this:

.. code-block:: php

    namespace MyApp\Image;

    class CustomAdjust extends \Pop\Image\Adjust\Gd
    {
        public function customAction1() {}

        public function customAction2() {}

        public function customAction3() {}
    }

Then, later in your application, when you call up the ``Gd`` adapter, you can inject your custom adjust
adapter like this:

.. code-block:: php

    namespace MyApp;

    $image = new \Pop\Image\Gd\('image.jpg');
    $image->setAdjust(new MyApp\Image\CustomAdjust());

So when you go you use the image adapter, your custom features will be available along will the
original set of features:

.. code-block:: php

    $image->adjust->brightness(50)
        ->customAction1()
        ->customAction2()
        ->customAction3();

This way, you can create and call whatever custom features are needed for your application on top of
the basic features that are already available.