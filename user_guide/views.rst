Views
=====

The ``popphp/pop-view`` component provides the functionality for creating and rendering views within
your application. Data can be passed into a view, filtered and pushed out to the UI of the application
to be rendering within the view template. As mentioned in the `MVC section`_ of the user guide, the
``popphp/pop-view`` component supports both file-based and stream-based templates.

Files
-----

With file-based view templates, the view object utilizes traditional PHP script files with the extension
``php`` or ``phtml``. The benefit of this type of template is that you can fully leverage PHP in manipulating
and displaying your data in your view.

Streams
-------

With stream-based view templates, the view object uses a string template to render the data within the view.
While using this method doesn't allow the use of PHP directly in the template like the file-based templates
do, it does support basic logic and iteration to manipulate your data for display. The benefit of this
is that it provides some security in locking down a template and not allowing PHP to be directly processed
within it. Additionally, the template strings can be easily stored and managed within the application and
remove the need to have to edit and transfer template files to the server. This is a common tactic used by
content management systems that have template functionality built into them.

.. _MVC section: ./mvc.rst