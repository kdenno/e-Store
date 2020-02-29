exports.NotFound = (req, res, next) =>{
    res.status(404).render('404', {pageTitle: 'Page Not Found', path: '', isAuthenticated: req.theuser});
} 

exports.ErrorOccured = (req, res, next) =>{
    res.status(500).render('500', {pageTitle: 'Error Occured', path: '', isAuthenticated: req.theuser});
} 