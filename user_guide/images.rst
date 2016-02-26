Images
======

Image manipulation and processing is another set of features that is often needed for a web
application. It is common to have to process images in some way for the web application to
perform its required functionality. The `popphp/pop-image` component provides that functionality
with a robust set of image processing and manipulation features. Within the component are
adapters written to support the ``Gd``, ``Imagick`` and ``Gmagick`` extensions*.

Additionally, there is an ``Svg`` adapter that supports the creation and manipulation of SVG image
files via an API that is similar to the other raster-based image adapters. With all of the adapters,
there is a base set of image creation, processing and manipulation features that are available.

By using either the ``Imagick`` or ``Gmagick`` adapters [*]_, you will open up a larger set of
features and functionality for your application, such as the ability to handle more image formats
and perform more complex image processing functions.

.. [*] It must be noted that the ``imagick`` and ``gmagick`` extensions cannot be used at the same
       time as they have conflicts with shared libraries and components that are used by both extensions.

Basic Use
---------

The core feature of the main image adapters include basic image functionality, such as resizing or cropping
an image. Additionally, you can convert an image to a different format and save it under a different file name.
Here's a look at the shared API of the ``Gd``, ``Imagick`` and ``Gmagick`` adapters.

**Loading an existing image**

.. code-block:: php

    $gd = new Pop\Image\Gd('image.jpg');

**Create a new image**

.. code-block:: php

    $gd = new Pop\Image\Gd('image.jpg', 640, 480);

* ``$gd->resizeToWidth($w);`` - resize the image to a specified width
* ``$gd->resizeToHeight($h);`` - resize the image to a specified height
* ``$gd->resize($px);`` - resize image to largest dimension
* ``$gd->scale($scale);`` - scale image by percentage, 0.0 - 1.0
* ``$gd->crop($w, $h, $x = 0, $y = 0);`` - crop image to specified width and height
* ``$gd->cropThumb($px, $offset = null);`` - crop image to squared image of specified size
* ``$gd->rotate($degrees, array $bgColor = [255, 255, 255]);`` - rotate image a certain number of degrees
* ``$gd->flip();`` - flip the image over the x-axis
* ``$gd->flop();`` - flip the image over the y-axis
* ``$gd->convert($type);`` - convert image to specified image type
* ``$gd->setQuality($quality);`` - set the image quality, 0 - 100
* ``$gd->save($to = null);`` - save image, either overwriting existing image file, or to specified location
* ``$gd->output($download = false, $sendHeaders = true);`` - output image via HTTP

**Using the factory**

If you wish to use the factory class, perhaps as an image service, you can do so like this:

.. code-block:: php

    $imageService = new Pop\Image\Factory\Gd();

And then later in your application, you can load an instance of an image object via:

.. code-block:: php

    $image = $imageService->load('image.jpg');

Or create an instance of an image object with a new image via:

.. code-block:: php

    $image = $imageService->create('image.jpg', 640, 480);

Advanced Use
------------

The `popphp/pop-image` component comes with set of image manipulation objects that provide a robust
advanced feature set when processing images. You can think of these classes and their object instances
as the menus at the top of your favorite images editing software.

Adjust
~~~~~~

Draw
~~~~

Effect
~~~~~~

Filter
~~~~~~

Layer
~~~~~

Type
~~~~
