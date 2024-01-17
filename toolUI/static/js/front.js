// Load the web fonts from Google.
// #region
WebFont.load({
    google: {
        families: [
            'Anton',
            'Bad Script',
            'Catamaran',
            'Droid Sans',
            'Droid Serif',
            'Hammersmith One',
            'Hanalei',
            'IM Fell Double Pica',
            'Lobster',
            'Merriweather',
            'Noto Sans JP',
            'Open Sans',
            'Pangolin',
            'Roboto',
            'Shadows Into Light',
            'Stalinist One',
            'Ubuntu',
            'Ultra'
        ]
    },
    // called when the load of an individual font commences.
    fontloading: function (familyName, fvd) {
        console.log('Loading font [' + familyName + ']')
    },
    // called when the load of an individual font completes.
    fontactive: function (familyName, fvd) {
        console.log('Loaded font [' + familyName + ']')
        $('#font-name').append('<option value="' + familyName + '">' + familyName + '</option>');
    },
});

// #endregion