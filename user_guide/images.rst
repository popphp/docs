Images
======

Image manipulation and processing is often another feature set that may be needed for a web
application. It is common to have to process images in some way for the web application to
perform its required functionality. The `popphp/pop-image` component provides that functionality
with a robust set of image processing and manipulation features. Within the component are
adapters written to support the ``gd``, ``imagick`` and ``gmagick`` extensions. However, it
must be noted that typically, the ``imagick`` and ``gmagick`` extensions cannot be used at the
same time as they have dependency conflicts with what libraries and system components that used
"under the hood."

Also, with the ``gd`` extension, there is a base set of image processing and manipulation features
that are available. However, by using either the ``imagick`` or ``gmagick`` extensions, you will
open up a larger set of features and functionality to your application, such as the ability to
handle more image formats and perform more complex processing functions.