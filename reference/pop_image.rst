Pop\\Image
==========

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
            "popphp/pop-image": "2.0.*",
        }
    }

Basic Use
---------

Image manipulation and processing is another set of features that is often needed for a web
application. It is common to have to process images in some way for the web application to
perform its required functionality. The `popphp/pop-image` component provides that functionality
with a robust set of image processing and manipulation features. Within the component are
adapters written to support the ``Gd``, ``Imagick`` and ``Gmagick`` extensions.

Additionally, there is an ``Svg`` adapter that supports the creation and manipulation of SVG image
files via an API that is similar to the other raster-based image adapters. With all of the adapters,
there is a base set of image creation, processing and manipulation features that are available.

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

    if (Pop\Image\Gmagick::isInstalled()) {
        $imageService = new Pop\Image\Factory\Gmagick();
    } else if (Pop\Image\Imagick::isInstalled()) {
        $imageService = new Pop\Image\Factory\Imagick();
    } else if (Pop\Image\Gd::isInstalled()) {
        $imageService = new Pop\Image\Factory\Gd();
    }

Similarly, you can check their availability like this as well:

.. code-block:: php

    // This will work with any of the 3 adapters
    $adapters = Pop\Image\Gd::getAvailableAdapters();

    if ($adapters['gmagick']) {
        $imageService = new Pop\Image\Factory\Gmagick();
    } else if ($adapters['imagick']) {
        $imageService = new Pop\Image\Factory\Imagick();
    } else if ($adapters['gd']) {
        $imageService = new Pop\Image\Factory\Gd();
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

**Using the Image Factory**

If you wish to use the factory class, perhaps as an image service like shown above, you can do so like this:

.. code-block:: php

    $imageService = new Pop\Image\Factory\Gd();

And then later in your application, you can load an instance of an image object via:

.. code-block:: php

    // Returns an instance of Pop\Image\Gd with the existing image resource loaded
    $image = $imageService->load('image.jpg');

Or create an instance of an image object with a new image via:

.. code-block:: php

    // Returns an instance of Pop\Image\Gd with a new image resource loaded
    $image = $imageService->create('new.jpg', 640, 480);

Formats
-------

The image formats available are dependent on which image adapter you choose. The ``Gd`` adapter is limited
to the 3 basic web image formats:

- jpg
- png
- gif

The ``Imagick`` and ``Gmagick`` adapters support a much larger number of formats, including vector formats,
if the Ghostscript application and libraries are installed in the environment. The number of formats varies
depending on the environment, but the default formats include:

- ai
- bmp
- eps
- gif
- ico
- jpg
- pdf
- png
- ps
- psb
- psd
- svg
- tif

Within those two adapters, the list may grow or shrink based on what's available in the environment. To check
or test what formats can be processed, you can use the static ``getFormats()`` method. This method will return
an associative array with the image file extension as the key and the image mime type as the value:

.. code-block:: php

    $formats = Pop\Image\Imagick::getFormats();

    if (array_key_exists('pdf', $formats)) {
        // Do something with a PDF
    }

Basic Use
---------

The core feature of the main image adapters include basic image functionality, such as resizing or cropping
an image. Additionally, you can convert an image to a different format as well as save the image. Here's a
look at the shared API of the ``Gd``, ``Imagick`` and ``Gmagick`` adapters.

**Loading an existing image**

To load an existing image resource, you could use the ``Gd`` adapter like this:

.. code-block:: php

    $img = new Pop\Image\Gd('image.jpg');

Alternatively, you could use the ``Imagick`` adapter:

.. code-block:: php

    $img = new Pop\Image\Imagick('image.jpg');

or, you could use the ``Gmagick`` adapter if that extension is available instead:

.. code-block:: php

    $img = new Pop\Image\Gmagick('image.jpg');

**Create a new image**

To create a new image resource, you could use the ``Gd`` adapter like this:

.. code-block:: php

    $img = new Pop\Image\Gd('new.jpg', 640, 480);

Alternatively, you could use the ``Imagick`` adapter:

.. code-block:: php

    $img = new Pop\Image\Imagick('new.jpg', 640, 480);

or, you could use the ``Gmagick`` adapter if that extension is available instead:

.. code-block:: php

    $img = new Pop\Image\Gmagick('new.jpg', 640, 480);

All three of the above adapters have the same core API below:

* ``$img->resizeToWidth($w);`` - resize the image to a specified width
* ``$img->resizeToHeight($h);`` - resize the image to a specified height
* ``$img->resize($px);`` - resize image to largest dimension
* ``$img->scale($scale);`` - scale image by percentage, 0.0 - 1.0
* ``$img->crop($w, $h, $x = 0, $y = 0);`` - crop image to specified width and height
* ``$img->cropThumb($px, $offset = null);`` - crop image to squared image of specified size
* ``$img->rotate($degrees, array $bgColor = [255, 255, 255]);`` - rotate image by specified degrees
* ``$img->flip();`` - flip the image over the x-axis
* ``$img->flop();`` - flip the image over the y-axis
* ``$img->convert($type);`` - convert image to specified image type
* ``$img->setQuality($quality);`` - set the image quality, 0 - 100
* ``$img->save($to = null);`` - save image, either to itself or a new location
* ``$img->output($download = false, $sendHeaders = true);`` - output image via HTTP

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

SVG
---

The ``Svg`` adapter has an API that is similar to the raster-based adapters, but is different in other
areas in that it is processing and manipulating a vector image object instead of a bitmap image.

Creating a new SVG image resource is similar to the other adapters:

.. code-block:: php

    $svg = new Pop\Image\Svg('new.svg', 640, 480);

as is loading an existing SVG image resource as well:

.. code-block:: php

    $svg = new Pop\Image\Imagick('image.svg');

The core API of the ``Svg`` adapter looks like this:

* ``$svg->save($to = null);``
* ``$svg->output($download = false, $sendHeaders = true);``

From there the ``Svg`` adapter has 3 of the advanced manipulation objects available to it: **draw**,
**effect** and **type**.

Draw
~~~~

The draw object allows you to perform the following methods:

* ``$svg->draw->line($x1, $y1, $x2, $y2);``
* ``$svg->draw->rectangle($x, $y, $w, $h = null);``
* ``$svg->draw->square($x, $y, $w);``
* ``$svg->draw->roundedRectangle($x, $y, $w, $h = null, $rx = 10, $ry = null);``
* ``$svg->draw->roundedSquare($x, $y, $w, $rx = 10, $ry = null);``
* ``$svg->draw->ellipse($x, $y, $w, $h = null);``
* ``$svg->draw->circle($x, $y, $w);``
* ``$svg->draw->arc($x, $y, $start, $end, $w, $h = null);``
* ``$svg->draw->polygon($points);``

Here's an example drawing some different shapes with different styles on the image resource:

.. code-block:: php

    $svg = new Pop\Image\Svg('image.svg');
    $svg->draw->setFillColor(255, 0, 0);
        ->draw->setStrokeColor(0, 0, 0);
        ->draw->setStrokeWidth(5);
        ->draw->rectangle(100, 100, 320, 240);
        ->draw->circle(400, 300, 50);

Effect
~~~~~~

The effect object allows you to perform the following methods:

* ``$svg->effect->border(array $color, $w, $dashLen = null, $dashGap = null);``
* ``$svg->effect->fill($r, $g, $b);``
* ``$svg->effect->radialGradient(array $color1, array $color2, $opacity = 1.0);``
* ``$svg->effect->verticalGradient(array $color1, array $color2, $opacity = 1.0);``
* ``$svg->effect->horizontalGradient(array $color1, array $color2, $opacity = 1.0);``
* ``$svg->effect->linearGradient(array $color1, array $color2, $opacity = 1.0, $vertical = true);``

Here's an example applying some different effects to the image resource:

.. code-block:: php

    $svg = new Pop\Image\Svg('image.svg');
    $svg->effect->verticalGradient([255, 0, 0], [0, 0, 255]);

Type
~~~~

The type object allows you to perform the following methods:

* ``$svg->type->font($font);`` - set the font
* ``$svg->type->size($size);`` - set the font size
* ``$svg->type->x($x);`` - set the x-position of the text string
* ``$svg->type->y($y);`` - set the y-position of the text string
* ``$svg->type->xy($x, $y);`` - set both the x- and y-position together
* ``$svg->type->rotate($degrees);`` - set the amount of degrees in which to rotate the text string
* ``$svg->type->text($string);`` - place the string on the image, using the defined parameters

Here's an example working with text over the image resource:

.. code-block:: php

    $svg = new Pop\Image\Svg('image.svg');
    $svg->type->setFillColor(128, 128, 128)
        ->size(12)
        ->font('Arial')
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
