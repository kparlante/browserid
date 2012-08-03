#!/bin/bash

if [ ! -d $HOME/locale ] ; then
    svn co https://svn.mozilla.org/projects/l10n-misc/trunk/browserid/locale
fi

cd $HOME/locale/

X=`svn status -u | wc -l`

if [ "x$X" != "x1" ] ; then
    echo "oh boy, new translations.  time to update translate.personatest.org"
    # trigger a redeployment
    cd $HOME/git
    ../post-update.js
    cd $HOME/locale
    svn info | egrep ^Revision: >> $HOME/ver.txt
fi
