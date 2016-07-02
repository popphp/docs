Pop\\I18n
=========

The `popphp/pop-i18n` component is the internationalization and localization component. It handles
the translation of strings into the correct and necessary language for the country and region.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-i18n

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-i18n": "2.1.*",
        }
    }

Basic Use
---------

The `popphp/pop-i18n` component handles internationalization and localization. It provides the features
for translating and managing different languages and locales that may be required for an application.
It also provides for parameters to be injected into the text for personalization. To use the component,
you'll have to create you language and locale files. The accepted formats are either XML or JSON:

**fr.xml**

.. code-block:: xml

    <?xml version="1.0" encoding="utf-8"?>
    <!DOCTYPE language [
            <!ELEMENT language ANY>
            <!ELEMENT locale ANY>
            <!ELEMENT text (source,output)>
            <!ELEMENT source ANY>
            <!ELEMENT output ANY>
            <!ATTLIST language
                    src       CDATA    #REQUIRED
                    output    CDATA    #REQUIRED
                    name      CDATA    #REQUIRED
                    native    CDATA    #REQUIRED
                    >
            <!ATTLIST locale
                    region    CDATA    #REQUIRED
                    name      CDATA    #REQUIRED
                    native    CDATA    #REQUIRED
                    >
            ]>
    <language src="en" output="fr" name="French" native="Français">
        <locale region="FR" name="France" native="France">
            <text>
                <source>Hello, my name is %1. I love to program %2.</source>
                <output>Bonjour, mon nom est %1. Je aime programmer %2.</output>
            </text>
        </locale>
    </language>

**fr.json**

.. code-block:: json

    {
        "language"  : {
            "src"    : "en",
            "output" : "fr",
            "name"   : "French",
            "native" : "Français",
            "locale" : [{
                "region" : "FR",
                "name"   : "France",
                "native" : "France",
                "text"   : [
                    {
                        "source" : "Hello, my name is %1. I love to program %2.",
                        "output" : "Bonjour, mon nom est %1. Je aime programmer %2."
                    }
                ]
            }]
        }
    }

From there, you can create your I18n object and give it the folder with the language files in it.
It will auto-detect which file to load based on the language passed.

.. code-block:: php

    use Pop\I18n\I18n;

    $lang = new I18n('fr_FR', '/path/to/language/files');

    $string = $lang->__('Hello, my name is %1. I love to program %2.', ['Nick', 'PHP']);
    echo $string;

.. code-block:: text

    Bonjour, mon nom est Nick. Je aime programmer PHP.

Alternatively, you can directly echo the string out like this:

.. code-block:: php

    $lang->_e('Hello, my name is %1. I love to program %2.', ['Nick', 'PHP']);

**The I18n Constant**

You can set the language and locale when you instantiate the I18n object like above, or if you
prefer, you can set it in your application as a constant ``POP_LANG`` and the I18n object will look
for that as well. The default is ``en_US``.

Advanced Use
------------

The `popphp/pop-i18n` component provides the functionality to assist you in generating your required
language files. Knowing the time and possibly money required to translate your application's text into
multiple languages, the component can help with assembling the language files once you have the content.

You can give it arrays of data to generate complete files:

.. code-block:: php

    use Pop\I18n\Format;

    $lang = [
        'src'    => 'en',
        'output' => 'de',
        'name'   => 'German',
        'native' => 'Deutsch'
    ];

    $locales = [
        [
            'region' => 'DE',
            'name'   => 'Germany',
            'native' => 'Deutschland',
            'text' => [
                [
                    'source' => 'This field is required.',
                    'output' => 'Dieses Feld ist erforderlich.'
                ],
                [
                    'source' => 'Please enter your name.',
                    'output' => 'Bitte geben Sie Ihren Namen ein.'
                ]
            ]
        ]
    ];

    // Create the XML format
    Format\Xml::createFile($lang, $locale, '/path/to/language/files/de.xml');

    // Create in JSON format
    Format\Json::createFile($lang, $locale, '/path/to/language/files/de.json');

Also, if you have a a source text file and an output text file with a 1:1 line-by-line ratio, then you can
create the language files in fragment set and merge them as needed. An example of a 1:1 ratio source-to-output
text files:

**source/en.txt**

.. code-block:: text

    This field is required.
    Please enter your name.

**source/de.txt**

.. code-block:: text

    Dieses Feld ist erforderlich.
    Bitte geben Sie Ihren Namen ein.

So then, you can do this:

.. code-block:: php

    use Pop\I18n\Format;

    // Create the XML format fragment
    Format\Xml::createFragment('source/en.txt', 'output/de.txt', '/path/to/files/');

    // Create the JSON format fragment
    Format\Json::createFragment('source/en.txt', 'output/de.txt', '/path/to/files/');

And merge the fragments into a main language file.
