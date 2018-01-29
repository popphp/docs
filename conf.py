import sys, os
from sphinx.highlighting import lexers
from pygments.lexers.web import PhpLexer

sys.path.append(os.path.abspath('_exts'))

extensions = []
master_doc = 'index'
highlight_language = 'php'

project = u'Pop PHP Framework'
copyright = u'2016 Nick Sagona, III'

version = '3'
release = '3.6.4'

lexers['php'] = PhpLexer(startinline=True)

