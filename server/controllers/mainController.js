/**
 * GET /
 * HOMEPAGE 
*/
exports.homepage = async (req, res) => {
    const locals = {
        title: "Notes - Home",
        description: "Notes Application",
    }
    res.render('index', {
        locals,
        layout: '../views/layouts/front-page'
    });
}


/**
 * GET /
 * ABOUT 
*/
exports.about = async (req, res) => {
    const locals = {
        title: "Notes - About",
        description: "Notes Application",
    }
    res.render('about', locals);
}