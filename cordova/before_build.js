module.exports = function(ctx) {
    var fs = ctx.requireCordovaModule('fs'),
        path = ctx.requireCordovaModule('path');

    console.log("entering the hook script");

    if (ctx.opts.platforms.indexOf('android') > -1) {
        var platformRoot = path.join(ctx.opts.projectRoot, 'platforms/android');
        var gsjson = fs.readFileSync("google-services.json");
        console.log("before_build----",path.join(platformRoot,"google-services.json"),gsjson);
        fs.writeFileSync(path.join(platformRoot,"google-services.json"), gsjson);
    } else {
        /*var platformRoot = path.join(ctx.opts.projectRoot, 'platforms/ios/MoskvaOpros');
        var gsjson = fs.readFileSync("GoogleService-Info.plist");
        fs.writeFileSync(path.join(platformRoot,"GoogleService-Info.plist"), gsjson);*/
    }
};