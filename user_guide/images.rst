Images
======

Image manipulation and processing is another set of features that is often needed for a web
application. It is common to have to process images in some way for the web application to
perform its required functionality. The `popphp/pop-image` component provides that functionality
with a robust set of image processing and manipulation features. Within the component are
adapters written to support the ``gd``, ``imagick`` and ``gmagick`` extensions*.

Additionally, there is an ``Svg`` adapter that supports the creation and manipulation of SVG image
files via an API that is similar to the other raster-based image adapters. With all of the adapters,
there is a base set of image creation, processing and manipulation features that are available.

By using either the ``imagick`` or ``gmagick`` extensions [*]_, you will open up a larger set of
features and functionality for your application, such as the ability to handle more image formats
and perform more complex image processing functions.

.. [*] It must be noted that the ``imagick`` and ``gmagick`` extensions cannot be used at the same
       time as they have conflicts with shared libraries and components that are used by both extensions.

The Basics
----------


Extended Features
-----------------
