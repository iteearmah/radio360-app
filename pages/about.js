exports.createAboutPage=function(page_margin)
{
	var pageContent='<p>Radio 360 is a community based lifestyle radio with total news coverage.</p>';
  pageContent+='<p>Powered by EMG MULTIMEDIA </p>';
 pageContent+='<p>New Takoradi 00233';
 pageContent+='+233577602235 or +233209818181<br>';
 pageContent+='Typically replies within minutes<br>';
 pageContent+='http://www.myradio360.com/</p>';

  
	var pageTitle='About Radio360';
	var page = new tabris.Page({title: pageTitle});
  var scrollView = new tabris.ScrollView({
    layoutData: {left: 0, right: 0, top: 0, bottom: 0},
    direction: "vertical"
  }).appendTo(page);

  var imageView = new tabris.ImageView({
    left: 0, top: 0, right: 0,
    image: "images/logo.png",
    scaleMode: "none"
  }).appendTo(scrollView);

  new tabris.TextView({
    layoutData: {left: page_margin, right: page_margin,top:[imageView,5], bottom: page_margin},
    text: pageContent,
    markupEnabled: true
  }).appendTo(scrollView);
  return page;
}

