Images
======

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
examples test each individual adapter to see if one is available, and if not, then moves on to the next:

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
web formats, then the ``Gd`` adapter should work well.

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
    $image = $imageService->create('image.jpg', 640, 480);

Formats
-------

The image formats available are dependent on which image adapter you choose. The ``Gd`` adapter is limited
to the 3 basic web formats:

- jpg
- png
- gif

The ``Imagick`` and ``Gmagick`` adapters support a much larger number of formats, including vector formats,
if the Ghostscript application and libraries are installed in the environment. The number of formats varies
depending on the environment, but the default formats are:

- ai
- avi
- bmp
- eps
- gif
- ico
- jpg
- mov
- mp4
- mpg
- mpeg
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

    $img = new Pop\Image\Gd('image.jpg', 640, 480);

Alternatively, you could use the ``Imagick`` adapter:

.. code-block:: php

    $img = new Pop\Image\Imagick('image.jpg', 640, 480);

or, you could use the ``Gmagick`` adapter if that extension is available instead:

.. code-block:: php

    $img = new Pop\Image\Gmagick('image.jpg', 640, 480);

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

The `popphp/pop-image` component comes with set of image manipulation objects that provide a robust
advanced feature set when processing images. You can think of these classes and their object instances
as the menus at the top of your favorite image editing software.

Adjust
~~~~~~

The adjust object allows you to perform the following functions:

- brightness
- contrast
- desaturate

And with the ``Imagick`` or ``Gmagick`` adapter, you can perform these advanced functions:

- hue
- saturation
- hsb
- level

Here's an example making some adjustments to the image resource:

.. code-block:: php

    $img = new Pop\Image\Imagick('image.jpg');
    $img->adjust->brightness(50)
        ->contrast(20)
        ->level(10, 10);

Draw
~~~~

The draw object allows you to perform the following functions:

- line
- rectangle
- square
- ellipse
- circle
- arc
- chord
- pie
- polygon

And with the ``Imagick`` or ``Gmagick`` adapter, you can perform these advanced functions:

- roundedRectangle
- roundedSquare

Here's an example drawing some different shapes with different styles on the image resource:

.. code-block:: php

    $img = new Pop\Image\Imagick('image.jpg');
    $img->draw->setFillColor(255, 0, 0);       // $r, $g, $b
        ->draw->setStrokeColor(0, 0, 0);       // $r, $g, $b
        ->draw->setStrokeWidth(5);             // $w
        ->draw->rectangle(100, 100, 320, 240); // $x, $y, $w, $h
        ->draw->circle(400, 300, 50);          // $x, $y, $w

Effect
~~~~~~

The effect object allows you to perform the following functions:

- border
- fill
- radialGradient
- verticalGradient
- horizontalGradient
- linearGradient

Here's an example applying some different effects to the image resource:

.. code-block:: php

    $img = new Pop\Image\Imagick('image.jpg');
    $img->effect->verticalGradient([255, 0, 0], [0, 0, 255]);

Filter
~~~~~~

The filter object allows you to perform the following functions:

- blur
- sharpen
- negate
- colorize
- pixelate
- pencil [1]_

And with the ``Imagick`` or ``Gmagick`` adapter, you can perform these advanced functions:

- gaussianBlur [1]_
- adaptiveBlur
- motionBlur
- radialBlur
- paint
- posterize
- noise
- diffuse
- skew
- swirl
- wave
- solarize [2]_

Here's an example applying some different filters to the image resource:

.. code-block:: php

    $img = new Pop\Image\Imagick('image.jpg');
    $img->filter->adaptiveBlur(10)  // $radius
        ->swirl(45)                 // $degrees
        ->negate();

.. [1] Not available with ``Gmagick``
.. [2] Only available with ``Gmagick``

Layer
~~~~~

The layer object allows you to perform the following functions:

- overlay

And with the ``Imagick`` or ``Gmagick`` adapter, you can perform these advanced functions:

- flatten

Here's an example working with layers over the image resource:

.. code-block:: php

    $img = new Pop\Image\Imagick('image.psd');
    $img->layer->overlay('watermark.png', 50, 50)  // $image, $x, $y
        ->flatten();

Type
~~~~

The type object allows you to perform the following functions:

- set the font
- set the font size
- set the text coordinates
- rotate the text
- set the text string

Here's an example working with text over the image resource:

.. code-block:: php

    $img = new Pop\Image\Imagick('image.psd');
    $img->type->setFillColor(128, 128, 128)        // $r, $g, $b
        ->size(12)
        ->font('fonts/Arial.ttf')
        ->xy(40, 120)
        ->text('Hello World!');

SVG
---

Extending the Component
-----------------------