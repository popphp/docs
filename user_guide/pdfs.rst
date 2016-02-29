PDFs
====

PDF generation in an application is typically a required feature for any application that
does any type of in-depth reporting or data exporting. Many applications may require this
exported data to be in a concise, well-formatted and portable document and PDF provides this.

The PDF specification, as well as its shared assets' specifications, such as fonts and images,
are an extremely large and complex set of rules and syntax. This component attempts to harness
the power and features defined by those specifications and present an intuitive API that puts
the power of PDF at your fingertips.

Building a PDF
--------------

At the center of the `popphp/pop-pdf` component is the main ``Pop\Pdf\Pdf`` class. It serves
as a manager or controller of sorts for all of the various PDF assets that will pass through
during the process of PDF generation. The different assets are each outlined with their own
section below.

Here's a simple example building and generating a PDF document with some text. The finer points
of what's happening will be explained more in depth in the later sections.

.. code-block:: php

    use Pop\Pdf\Pdf;
    use Pop\Pdf\Document;
    use Pop\Pdf\Document\Font;
    use Pop\Pdf\Document\Page;

    // Create a page and add the text to it
    $page = new Page(Page::LETTER);
    $page->addText(new Page\Text('Hello World!', 24), Font::ARIAL, 50, 650);

    // Create a document, add the font to it and then the page
    $document = new Document();
    $document->addFont(new Font(Font::ARIAL));
    $document->addPage($page);

    // Pass the document to the Pdf object to build it and output it to HTTP
    $pdf = new Pdf();
    $pdf->outputToHttp($document);

.. image:: images/pop-pdf1.jpg

Importing a PDF
---------------

Importing an existing PDF or pages from one may be required in your application. Using the main
PDF object, you can specify the pdf to import as well as the select pages you may wish to import.
From there you can either select pages to modify or add new pages to the document. When you do
import an existing PDF, the method will return a parsed and working document object. In the example
below, we will import pages 2 and 5 from the existing PDF, add a new page in between them and
then save the new document:

.. code-block:: php

    use Pop\Pdf\Pdf;
    use Pop\Pdf\Document;
    use Pop\Pdf\Document\Font;
    use Pop\Pdf\Document\Page;

    $pdf = new Pdf();
    $document = $pdf->importFromFile('doc.pdf', [2, 5])

    // Create a page and add the text to it
    $page = new Page(Page::LETTER);
    $page->addText(new Page\Text('Hello World!', 24), Font::ARIAL, 50, 650);

    // Create a document, add the font to it and then the page
    $document = new Document();
    $document->addFont(new Font(Font::ARIAL));
    $document->addPage($page);
    $document->orderPages([1, 3, 2]); // 3 being our new page.

    // Pass the document to the Pdf object to build it and write it to a new file
    $pdf = new Pdf();
    $pdf->writeToFile('new-doc.pdf');

When the 2 pages are imported in, they default to page 1 and 2, respectively. Then we can add any
pages we need from there and control the final order of the pages with the ``orderPages`` method
like in the above example.

If you wish to import the whole PDF and all of its pages, simply leave the ``$pages`` parameter blank.

Coordinates
-----------

It should be noted that the PDF coordinate system has its origin (0, 0) at the bottom left. In the
example above, the text was placed at the (x, y) coordinate of (50, 650). When placed on a page that
is set to the size of a letter, which is 612 points x 792 points, that will make the text appear in
the top left. It the coordinates of the text were set to (50, 50) instead, the text would have appeared
in the bottom left.

As this coordinate system may or may not suit a developer's personal preference or the requirements
of the application, the origin point of the document can be set using the following method:

.. code-block:: php

    use Pop\Pdf\Document;

    $document = new Document();
    $document->setOrigin(Document::ORIGIN_TOP_LEFT);

Now, with the document's origin set to the top left, when you place assets into the document, you can
base it off of the new origin point. So for the text in the above example to be placed in the same place,
the new (x, y) coordinates would be (50, 142).

Alternatively, the full list of constants in the ``Pop\Pdf\Document`` class that represent the
different origins are:

* ORIGIN_TOP_LEFT
* ORIGIN_TOP_RIGHT
* ORIGIN_BOTTOM_LEFT
* ORIGIN_BOTTOM_RIGHT
* ORIGIN_CENTER

Documents
---------

A document object represents the top-level "container" object of the the PDF document. As you create
the various assets that are to be placed in the PDF document, you will inject them into the document
object. At the document level, the main 3 assets that can be added to a document level are **fonts**,
**forms**, **metatdata** and **pages**.  The font and form objects are added at document level as they
can be re-used on the page level by other assets.

Fonts
~~~~~

Font objects are the global document objects that contain information about the fonts that can be used
by the text objects within the pages of the document. A font can either be one of the standard fonts
supported by PDF natively, or an embedded font from a font file.

**Standard Fonts**

The set of standard, native PDF fonts include:

* Arial
* Arial,Italic
* Arial,Bold
* Arial,BoldItalic
* Courier
* Courier-Oblique
* Courier-Bold
* Courier-BoldOblique
* CourierNew
* CourierNew,Italic
* CourierNew,Bold
* CourierNew,BoldItalic
* Helvetica
* Helvetica-Oblique
* Helvetica-Bold
* Helvetica-BoldOblique
* Symbol
* Times-Roman
* Times-Bold
* Times-Italic
* Times-BoldItalic
* TimesNewRoman
* TimesNewRoman,Italic
* TimesNewRoman,Bold
* TimesNewRoman,BoldItalic
* ZapfDingbats

When adding a standard font to the document, you can add it and then reference it by name throughout
the building of the PDF. For reference, there are constants available in the ``Pop\Pdf\Document\Font``
class that have the correct standard font names stored in them as strings.

.. code-block:: php

    use Pop\Pdf\Document;
    use Pop\Pdf\Document\Font;

    $font = new Font(Font::TIMES_NEW_ROMAN_BOLDITALIC);

    $document = new Document();
    $document->addFont($font);

Now, the font defined as "TimesNewRoman,BoldItalic" is available to the document and for any text for which
you need it.

**Embedded Fonts**

The embedded font types that are supported are:

* TrueType
* OpenType
* Type1

When embedding an external font, you will need access to its name to correctly reference it by string
much in the same way you do for a standard font. That name becomes accessible once you create a font object
with an embedded font and it is successfully parsed.

**Notice about embedded fonts**

*There may be issues embedding a font if certain font data or font files are missing, incomplete
or corrupted. Furthermore, there may be issues embedding a font if the correct permissions or licensing
are not provided.*

.. code-block:: php

    use Pop\Pdf\Document;
    use Pop\Pdf\Document\Font;
    use Pop\Pdf\Document\Page;

    $customFont = new Font('custom-font.ttf');

    $document = new Document();
    $document->embedFont($customFont);

    $text = new Page\Text('Hello World!', 24);

    $page = new Page(Page::LETTER);
    $page->addText($text, $customFont->getName(), 50, 650);

The above example will attach the name and reference of the embedded custom font to that text object.
Additionally, when a font is added or embedded into a document, its name becomes the current font, which
is a property you can access like this:

.. code-block:: php

    $page->addText($text, $document->getCurrentFont(), 50, 650);

If you'd like to override or switch the current document font back to another font that's available,
you can do so like this:

.. code-block:: php

    $document->setCurrentFont('Arial');

Forms
~~~~~

Form objects are the global document objects that contain information about fields that are to be used
within a Form object on a page in the document. By themselves they are fairly simple to use and inject
into a document object. From there, you would add fields to a their respective pages, while attaching
them to a form object.

The example below demonstrates how to add a form object to a document:

.. code-block:: php

    use Pop\Pdf\Document;
    use Pop\Pdf\Document\Form;

    $form = new Form('contact_form');

    $document = new Document();
    $document->addForm($form);

Then, when you add a field to a page, you can reference the form to attach it to:

.. code-block:: php

    use Pop\Pdf\Document\Page;

    $name = new Page\Field\Text('name');
    $name->setWidth(200)
         ->setHeight(40);

    $page = new Page(Page::LETTER);
    $page->addField($name, 'contact_form', 50, 650);

The above example creates a name field for the contact form, giving it a width and height and placing
it at the (50, 650) coordinated. Fields will be covered more in depth below.

Metadata
--------

The metadata object contains the document identifier data such as title, author and date. If you'd like
to set the metadata of the document, you can with the following API:

.. code-block:: php

    use Pop\Pdf\Document;

    $metadata = new Document\Metadata();
    $metadata->setTitle('My Document')
        ->setAuthor('Some Author')
        ->setSubject('Some Subject')
        ->setCreator('Some Creator')
        ->setProducer('Some Producer')
        ->setCreationDate('August 19, 2015')
        ->setModDate('August 22, 2015')

    $document = new Document();
    $document->setMetadata($metadata);

And there are getter methods to retrieve the data from the metadata object. This data will commonly
be displayed in the the document title bar and info boxes of a PDF reader.

Pages
-----

Page object contain the majority of the assets that you would expect to be
within a PDF document.

Images
~~~~~~

Color
~~~~~

Paths
~~~~~

Text
~~~~

Annotations
~~~~~~~~~~~

Fields
~~~~~~
