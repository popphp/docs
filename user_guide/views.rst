Views
=====

The ``popphp/pop-view`` component provides the functionality for creating and rendering views within
your application. Data can be passed into a view, filtered and pushed out to the UI of the application
to be rendering within the view template. As mentioned in the `MVC section`_ of the user guide, the
``popphp/pop-view`` component supports both file-based and stream-based templates.

Files
-----

With file-based view templates, the view object utilizes traditional PHP script files with the extension
``.php`` or ``.phtml``. The benefit of this type of template is that you can fully leverage PHP in manipulating
and displaying your data in your view.

Let's revisit and expand upon the basic example given in the previous `MVC section`_. First let's take a
look at the view template, ``index.phtml``:

.. code-block:: php

    <!DOCTYPE html>
    <html>

    <head>
        <title><?=$title; ?></title>
    </head>
    <body>
        <h1><?=$title; ?></h1>
    <?=$content; ?>
        <ul>
    <?php foreach ($links as $url => $link): ?>
            <li><a href="<?=$url; ?>"><?=$link; ?></a></li>
    <?php endforeach; ?>
        </ul>
    </body>

    </html>

Then, we can set up the view and its data like below. Notice in the script above, we've set it up to loop
through an array of links with the ``$links`` variable.

.. code-block:: php

    $data = [
        'title'   => 'View Example',
        'content' => '    <p>Some page content.</p>',
        'links'   => [
            'http://www.popphp.org/'     => 'Pop PHP Framework',
            'http://popcorn.popphp.org/' => 'Popcorn Micro Framework',
            'http://www.phirecms.org/'   => 'Phire CMS'
        ]
    ];

    $view = new Pop\View\View('index.phtml', $data);

    echo $view;

The result of the above example is:

.. code-block:: html

    <!DOCTYPE html>
    <html>

    <head>
        <title>View Example</title>
    </head>
    <body>
        <h1>View Example</h1>
        <p>Some page content.</p>
        <ul>
            <li><a href="http://www.popphp.org/">Pop PHP Framework</a></li>
            <li><a href="http://popcorn.popphp.org/">Popcorn Micro Framework</a></li>
            <li><a href="http://www.phirecms.org/">Phire CMS</a></li>
        </ul>
    </body>

    </html>

Streams
-------

With stream-based view templates, the view object uses a string template to render the data within the view.
While using this method doesn't allow the use of PHP directly in the template like the file-based templates
do, it does support basic logic and iteration to manipulate your data for display. The benefit of this
is that it provides some security in locking down a template and not allowing PHP to be directly processed
within it. Additionally, the template strings can be easily stored and managed within the application and
remove the need to have to edit and transfer template files to the server. This is a common tactic used by
content management systems that have template functionality built into them.

Filtering Data
--------------

.. _MVC section: ./mvc.html